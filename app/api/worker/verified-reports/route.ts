import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
import User from '@/models/User';
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

    // Calculate statistics
    const stats = {
      total: reports.length,
      totalWeight: reports.reduce((sum, r) => sum + r.weightKg, 0),
      totalPoints: reports.reduce((sum, r) => sum + r.pointsAwarded, 0),
    };

    // Group by type
    const typeBreakdown = reports.reduce((acc: Record<string, { count: number; weight: number }>, report) => {
      if (!acc[report.type]) {
        acc[report.type] = { count: 0, weight: 0 };
      }
      acc[report.type].count++;
      acc[report.type].weight += report.weightKg;
      return acc;
    }, {});

    return NextResponse.json(
      {
        reports,
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
