import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import WorkerTask from '@/models/WorkerTask';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Check if user is admin
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }


    // Get filter and statsOnly from query params
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all';
    const statsOnly = searchParams.get('statsOnly') === '1';

    // Calculate stats (always needed)
    const stats = {
      total: await WorkerTask.countDocuments(),
      pending: await WorkerTask.countDocuments({ status: 'pending' }),
      inProgress: await WorkerTask.countDocuments({ status: 'in-progress' }),
      completed: await WorkerTask.countDocuments({ status: 'completed' }),
    };

    if (statsOnly) {
      return NextResponse.json({ stats });
    }

    // Build query for tasks
    let query = {};
    if (filter === 'completed') {
      query = { status: 'completed' };
    } else if (filter === 'in-progress') {
      query = { status: 'in-progress' };
    } else if (filter === 'pending') {
      query = { status: 'pending' };
    }

    // Fetch worker tasks with populated data
    const tasks = await WorkerTask.find(query)
      .populate('workerId', 'name email phone')
      .populate({
        path: 'reportId',
        select: 'type weightKg location imageUrl pointsAwarded userId',
        populate: {
          path: 'userId',
          select: 'name email'
        }
      })
      .sort({ completedAt: -1, createdAt: -1 })
      .limit(100);

    return NextResponse.json({
      tasks,
      stats
    });

  } catch (error) {
    console.error('Error fetching worker tasks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
