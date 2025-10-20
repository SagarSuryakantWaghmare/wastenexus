import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WorkerApplication from '@/models/WorkerApplication';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const applications = await WorkerApplication.find().sort({ appliedAt: -1 });

    const stats = {
      total: applications.length,
      pending: applications.filter((app) => app.status === 'pending').length,
      verified: applications.filter((app) => app.status === 'verified').length,
      rejected: applications.filter((app) => app.status === 'rejected').length,
    };

    return NextResponse.json({ applications, stats });
  } catch (error) {
    console.error('Error fetching worker applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
