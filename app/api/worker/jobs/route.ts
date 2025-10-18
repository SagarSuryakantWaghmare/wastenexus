import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import User from '@/models/User';
import mongoose from 'mongoose';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Fetch available jobs for workers
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

    // Verify user is a worker
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'worker') {
      return NextResponse.json(
        { error: 'Access denied. Workers only.' },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get('category');
    const viewType = searchParams.get('view'); // 'available' or 'my-jobs'

    let jobs;

    if (viewType === 'my-jobs') {
      // Fetch jobs assigned to this worker
      const query: { assignedWorkerId: string; status?: { $in: string[] } } = {
        assignedWorkerId: decoded.userId,
      };

      // Optionally filter by active statuses
      query.status = { $in: ['assigned', 'in-progress', 'completed'] };

      jobs = await Job.find(query)
        .populate('clientId', 'name email phone')
        .sort({ createdAt: -1 });

      // Calculate statistics for worker's jobs
      const workerJobs = await Job.find({ assignedWorkerId: decoded.userId });
      const stats = {
        total: workerJobs.length,
        assigned: workerJobs.filter((j) => j.status === 'assigned').length,
        inProgress: workerJobs.filter((j) => j.status === 'in-progress').length,
        completed: workerJobs.filter((j) => j.status === 'completed').length,
      };

      return NextResponse.json(
        {
          jobs,
          stats,
        },
        { status: 200 }
      );
    } else {
      // Fetch available verified jobs (not assigned yet)
      const query: { status: string; category?: string } = { status: 'verified' };

      if (categoryFilter && ['industry', 'home', 'other'].includes(categoryFilter)) {
        query.category = categoryFilter;
      }

      jobs = await Job.find(query)
        .populate('clientId', 'name email phone')
        .sort({ urgency: -1, createdAt: -1 }); // Sort by urgency then date

      return NextResponse.json(
        {
          jobs,
          total: jobs.length,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// PUT: Accept a job (Worker assigns themselves)
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

    // Verify user is a worker
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'worker') {
      return NextResponse.json(
        { error: 'Access denied. Workers only.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { jobId, action } = body;

    if (!jobId || !action) {
      return NextResponse.json(
        { error: 'Job ID and action are required' },
        { status: 400 }
      );
    }

    // Find job
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (action === 'accept') {
      // Worker accepts the job
      if (job.status !== 'verified') {
        return NextResponse.json(
          { error: 'Job is not available for acceptance' },
          { status: 400 }
        );
      }

      job.status = 'assigned';
      job.assignedWorkerId = decoded.userId as unknown as mongoose.Types.ObjectId;
      await job.save();

      const updatedJob = await Job.findById(jobId)
        .populate('clientId', 'name email phone')
        .populate('assignedWorkerId', 'name email phone');

      return NextResponse.json(
        {
          message: 'Job accepted successfully',
          job: updatedJob,
        },
        { status: 200 }
      );
    } else if (action === 'start') {
      // Worker starts the job
      if (job.assignedWorkerId?.toString() !== decoded.userId) {
        return NextResponse.json(
          { error: 'This job is not assigned to you' },
          { status: 403 }
        );
      }

      if (job.status !== 'assigned') {
        return NextResponse.json(
          { error: 'Job cannot be started in current status' },
          { status: 400 }
        );
      }

      job.status = 'in-progress';
      await job.save();

      const updatedJob = await Job.findById(jobId)
        .populate('clientId', 'name email phone')
        .populate('assignedWorkerId', 'name email phone');

      return NextResponse.json(
        {
          message: 'Job started successfully',
          job: updatedJob,
        },
        { status: 200 }
      );
    } else if (action === 'complete') {
      // Worker completes the job
      if (job.assignedWorkerId?.toString() !== decoded.userId) {
        return NextResponse.json(
          { error: 'This job is not assigned to you' },
          { status: 403 }
        );
      }

      if (job.status !== 'in-progress') {
        return NextResponse.json(
          { error: 'Job must be in progress to complete' },
          { status: 400 }
        );
      }

      job.status = 'completed';
      job.completedDate = new Date();
      await job.save();

      const updatedJob = await Job.findById(jobId)
        .populate('clientId', 'name email phone')
        .populate('assignedWorkerId', 'name email phone');

      return NextResponse.json(
        {
          message: 'Job completed successfully',
          job: updatedJob,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}
