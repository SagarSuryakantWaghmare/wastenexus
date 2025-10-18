import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// POST: Create a new job (Client only)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from Authorization header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Verify user is a client
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'client') {
      return NextResponse.json(
        { error: 'Access denied. Clients only.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      location,
      wasteType,
      estimatedWeight,
      budget,
      urgency,
      scheduledDate,
      clientContact,
      images,
    } = body;

    // Validate required fields
    if (!title || !description || !category || !location?.address || !wasteType || wasteType.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, category, location address, and waste type are required' },
        { status: 400 }
      );
    }

    // Validate category
    if (!['industry', 'home', 'other'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be: industry, home, or other' },
        { status: 400 }
      );
    }

    // Create new job
    const newJob = await Job.create({
      clientId: decoded.userId,
      title,
      description,
      category,
      location,
      wasteType,
      estimatedWeight,
      budget,
      urgency: urgency || 'medium',
      scheduledDate,
      clientContact: clientContact || {
        name: user.name,
        email: user.email,
      },
      images: images || [],
      status: 'pending', // Pending admin verification
    });

    const populatedJob = await Job.findById(newJob._id).populate('clientId', 'name email');

    return NextResponse.json(
      {
        message: 'Job posted successfully. Awaiting admin verification.',
        job: populatedJob,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

// GET: Fetch jobs for logged-in client
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from Authorization header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token and get user
    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Verify user is a client
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'client') {
      return NextResponse.json(
        { error: 'Access denied. Clients only.' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    // Build query
    const query: { clientId: string; status?: string } = { clientId: decoded.userId };
    if (statusFilter && ['pending', 'verified', 'rejected', 'assigned', 'in-progress', 'completed'].includes(statusFilter)) {
      query.status = statusFilter;
    }

    // Fetch jobs with populated data
    const jobs = await Job.find(query)
      .populate('assignedWorkerId', 'name email phone')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const allJobs = await Job.find({ clientId: decoded.userId });
    const stats = {
      total: allJobs.length,
      pending: allJobs.filter((j) => j.status === 'pending').length,
      verified: allJobs.filter((j) => j.status === 'verified').length,
      rejected: allJobs.filter((j) => j.status === 'rejected').length,
      assigned: allJobs.filter((j) => j.status === 'assigned').length,
      inProgress: allJobs.filter((j) => j.status === 'in-progress').length,
      completed: allJobs.filter((j) => j.status === 'completed').length,
    };

    return NextResponse.json(
      {
        jobs,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
