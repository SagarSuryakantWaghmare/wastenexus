import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { calculatePoints } from '@/lib/helpers';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    await dbConnect();

    const { id } = await context.params;

    // Get token from header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'champion') {
      return NextResponse.json(
        { error: 'Only champions can verify reports' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validation
    if (!status || !['verified', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either verified or rejected' },
        { status: 400 }
      );
    }

    // Find report
    const report = await Report.findById(id);
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    if (report.status !== 'pending') {
      return NextResponse.json(
        { error: 'Report has already been processed' },
        { status: 400 }
      );
    }

    // Update report status
    report.status = status;

    // Calculate and award points if verified
    if (status === 'verified') {
      const points = calculatePoints(report.weightKg, report.type);
      report.pointsAwarded = points;

      // Update user's total points
      await User.findByIdAndUpdate(
        report.userId,
        { $inc: { totalPoints: points } }
      );
    }

    await report.save();

    return NextResponse.json(
      {
        message: `Report ${status} successfully`,
        report: {
          id: report._id,
          type: report.type,
          weightKg: report.weightKg,
          status: report.status,
          pointsAwarded: report.pointsAwarded,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify report error:', error);
    return NextResponse.json(
      { error: 'Failed to verify report' },
      { status: 500 }
    );
  }
}
