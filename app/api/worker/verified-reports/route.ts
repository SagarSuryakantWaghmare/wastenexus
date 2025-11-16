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

    // Get location parameters from query string
    const { searchParams } = new URL(request.url);
    const locationFilter = searchParams.get('location'); // City/area name from worker

    let query: any = { status: 'verified' };

    // Fetch all verified reports
    const allReports = await Report.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Filter by location address if worker location is provided
    let filteredReports = allReports;
    if (locationFilter) {
      // Filter reports where location.address contains the worker's city/area
      filteredReports = allReports.filter((report) => {
        if (!report.location?.address) return false;
        // Case-insensitive partial match for city/area
        return report.location.address.toLowerCase().includes(locationFilter.toLowerCase());
      });
    }

    // Get all completed worker tasks for these reports
    const reportIds = filteredReports.map(r => r._id);
    const completedTasks = await WorkerTask.find({
      reportId: { $in: reportIds },
      status: 'completed'
    }).select('reportId completedDate');

    // Create a map of reportId to completedDate
    const completedMap = new Map(
      completedTasks.map(task => [task.reportId.toString(), task.completedDate])
    );

    // Add workerCompletedAt to each report
    const reportsWithStatus = filteredReports.map(report => {
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
        locationFilter: locationFilter || 'all',
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
