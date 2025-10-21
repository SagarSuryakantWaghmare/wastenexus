import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
import User from '@/models/User';
import WorkerTask from '@/models/WorkerTask';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Fetch all verified reports for worker
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

    // Fetch all verified reports
    const reports = await Report.find({ status: 'verified' })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Get all completed worker tasks for these reports
    const reportIds = reports.map(r => r._id);
    const completedTasks = await WorkerTask.find({
      reportId: { $in: reportIds },
      status: 'completed'
    }).select('reportId completedDate');

    // Create a map of reportId to completedDate
    const completedMap = new Map(
      completedTasks.map(task => [task.reportId.toString(), task.completedDate])
    );

    // Add workerCompletedAt to each report
    const reportsWithStatus = reports.map(report => {
      const reportObj = report.toObject();
      const completedDate = completedMap.get(report._id.toString());
      return {
        ...reportObj,
        workerCompletedAt: completedDate || null,
        isCompleted: !!completedDate
      };
    });

    // Calculate statistics
    const stats = {
      total: reportsWithStatus.length,
      totalWeight: reportsWithStatus.reduce((sum, r) => sum + r.weightKg, 0),
      totalPoints: reportsWithStatus.reduce((sum, r) => sum + r.pointsAwarded, 0),
    };

    // Group by type
    const typeBreakdown = reportsWithStatus.reduce((acc: Record<string, { count: number; weight: number }>, report) => {
      if (!acc[report.type]) {
        acc[report.type] = { count: 0, weight: 0 };
      }
      acc[report.type].count++;
      acc[report.type].weight += report.weightKg;
      return acc;
    }, {});

    return NextResponse.json(
      {
        reports: reportsWithStatus,
        stats,
        typeBreakdown,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching verified reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
