import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Report from '@/models/Report';
import User from '@/models/User';
import { awardPoints, calculateReportPoints } from '@/lib/rewards';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    await dbConnect();

    // Fetch all reports with user details
    const reports = await Report.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      total: reports.length,
      pending: reports.filter((r: { status: string }) => r.status === 'pending').length,
      verified: reports.filter((r: { status: string }) => r.status === 'verified').length,
      rejected: reports.filter((r: { status: string }) => r.status === 'rejected').length,
      totalWeight: reports.reduce((sum: number, r: { weightKg: number }) => sum + r.weightKg, 0),
      totalPoints: reports.reduce((sum: number, r: { pointsAwarded: number }) => sum + r.pointsAwarded, 0),
    };

    // Calculate type breakdown
    const typeBreakdown = reports.reduce((acc: Record<string, { count: number; weight: number; points: number }>, report: { type: string; weightKg: number; pointsAwarded: number }) => {
      if (!acc[report.type]) {
        acc[report.type] = { count: 0, weight: 0, points: 0 };
      }
      acc[report.type].count++;
      acc[report.type].weight += report.weightKg;
      acc[report.type].points += report.pointsAwarded;
      return acc;
    }, {});

    // Get recent reports (last 10)
    const recentReports = reports.slice(0, 10);

    return NextResponse.json({
      reports,
      stats,
      typeBreakdown,
      recentReports,
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// Verify/Reject report
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { reportId, action, points, reason } = body;

    if (!reportId || !action) {
      return NextResponse.json({ error: 'Report ID and action are required' }, { status: 400 });
    }

    if (action !== 'verify' && action !== 'reject') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await dbConnect();

    // Find report
    const report = await Report.findById(reportId);
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    if (action === 'verify') {
      // Calculate points based on weight and waste type
      const pointsToAward = points || calculateReportPoints(report.weightKg, report.type);
      
      report.status = 'verified';
      report.pointsAwarded = pointsToAward;
      await report.save();

      // Award points and create transaction record
      const rewardResult = await awardPoints({
        userId: report.userId,
        type: 'report_verified',
        amount: pointsToAward,
        description: `Waste report verified: ${report.weightKg}kg of ${report.type}`,
        referenceId: report._id,
        referenceModel: 'Report',
        adminId: decoded.userId,
        metadata: {
          weightKg: report.weightKg,
          wasteType: report.type,
          reportDate: report.date,
        },
      });

      return NextResponse.json({
        message: 'Report verified successfully',
        report,
        pointsAwarded: pointsToAward,
        transaction: rewardResult.transaction,
        newTotalPoints: rewardResult.newTotalPoints,
      });
    } else if (action === 'reject') {
      report.status = 'rejected';
      await report.save();

      return NextResponse.json({
        message: 'Report rejected successfully',
        report,
        reason,
      });
    }
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}
