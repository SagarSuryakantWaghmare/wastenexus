import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import WorkerTask from '@/models/WorkerTask';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Fetch tasks for logged-in worker
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

    // Get status filter from query params
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    // Build query
    const query: { workerId: string; status?: string } = { workerId: decoded.userId };
    if (statusFilter && ['assigned', 'in-progress', 'completed'].includes(statusFilter)) {
      query.status = statusFilter;
    }

    // Fetch tasks with populated data
    const tasks = await WorkerTask.find(query)
      .populate({
        path: 'reportId',
        select: 'type weightKg imageUrl location status',
        populate: {
          path: 'userId',
          select: 'name email',
        },
      })
      .sort({ assignedDate: -1 });

    // Calculate statistics
    const allTasks = await WorkerTask.find({ workerId: decoded.userId });
    const stats = {
      totalAssigned: allTasks.length,
      pending: allTasks.filter((t) => t.status === 'assigned').length,
      inProgress: allTasks.filter((t) => t.status === 'in-progress').length,
      completed: allTasks.filter((t) => t.status === 'completed').length,
      totalWeight: 0,
    };

    // Calculate total weight from completed tasks
    const completedTasks = await WorkerTask.find({
      workerId: decoded.userId,
      status: 'completed',
    }).populate('reportId');

    stats.totalWeight = completedTasks.reduce((sum, task) => {
      const reportId = task.reportId as unknown as { weightKg?: number };
      return sum + (reportId?.weightKg || 0);
    }, 0);

    return NextResponse.json(
      {
        tasks,
        stats,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching worker tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// PUT: Update task status
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
    const { taskId, status } = body;

    if (!taskId || !status) {
      return NextResponse.json(
        { error: 'Task ID and status are required' },
        { status: 400 }
      );
    }

    if (!['assigned', 'in-progress', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Find task and verify it belongs to this worker
    const task = await WorkerTask.findOne({
      _id: taskId,
      workerId: decoded.userId,
    });

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found or access denied' },
        { status: 404 }
      );
    }

    // Update task status with appropriate dates
    const updateData: { status: string; startedDate?: Date; completedDate?: Date } = { status };
    
    if (status === 'in-progress' && task.status === 'assigned') {
      updateData.startedDate = new Date();
    } else if (status === 'completed' && task.status === 'in-progress') {
      updateData.completedDate = new Date();
    }

    const updatedTask = await WorkerTask.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true }
    ).populate({
      path: 'reportId',
      select: 'type weightKg imageUrl location status',
      populate: {
        path: 'userId',
        select: 'name email',
      },
    });

    return NextResponse.json(
      {
        message: 'Task status updated successfully',
        task: updatedTask,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating task status:', error);
    return NextResponse.json(
      { error: 'Failed to update task status' },
      { status: 500 }
    );
  }
}
