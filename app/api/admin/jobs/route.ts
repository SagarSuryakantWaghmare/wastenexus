import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Fetch all jobs (Admin only)
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

    // Verify user is an admin
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admins only.' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');
    const categoryFilter = searchParams.get('category');

    // Build query
    const query: { status?: string; category?: string } = {};
    if (statusFilter && ['pending', 'verified', 'rejected', 'assigned', 'in-progress', 'completed'].includes(statusFilter)) {
      query.status = statusFilter;
    }
    if (categoryFilter && ['industry', 'home', 'other'].includes(categoryFilter)) {
      query.category = categoryFilter;
    }

    // Fetch jobs with populated data
    const jobs = await Job.find(query)
      .populate('clientId', 'name email phone')
      .populate('assignedWorkerId', 'name email phone')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const allJobs = await Job.find({});
    const stats = {
      total: allJobs.length,
      pending: allJobs.filter((j) => j.status === 'pending').length,
      verified: allJobs.filter((j) => j.status === 'verified').length,
      rejected: allJobs.filter((j) => j.status === 'rejected').length,
      assigned: allJobs.filter((j) => j.status === 'assigned').length,
      inProgress: allJobs.filter((j) => j.status === 'in-progress').length,
      completed: allJobs.filter((j) => j.status === 'completed').length,
      byCategory: {
        industry: allJobs.filter((j) => j.category === 'industry').length,
        home: allJobs.filter((j) => j.category === 'home').length,
        other: allJobs.filter((j) => j.category === 'other').length,
      },
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

// PUT: Update job status (Verify/Reject) - Admin only
export async function PUT(request: NextRequest) {
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

    // Verify user is an admin
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Admins only.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { jobId, status, adminNotes } = body;

    if (!jobId || !status) {
      return NextResponse.json(
        { error: 'Job ID and status are required' },
        { status: 400 }
      );
    }

    if (!['pending', 'verified', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: pending, verified, or rejected' },
        { status: 400 }
      );
    }

    // Find and update job
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Update job
    job.status = status;
    if (adminNotes) {
      job.adminNotes = adminNotes;
    }
    await job.save();

    const updatedJob = await Job.findById(jobId)
      .populate('clientId', 'name email phone')
      .populate('assignedWorkerId', 'name email phone');

    return NextResponse.json(
      {
        message: `Job ${status} successfully`,
        job: updatedJob,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}
