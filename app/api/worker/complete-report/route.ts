import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
import WorkerTask from '@/models/WorkerTask';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
  userId: string;
  role: string;
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded: JWTPayload;
    
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Verify user is a worker
    if (decoded.role !== 'worker') {
      return NextResponse.json(
        { error: 'Access denied - Workers only' },
        { status: 403 }
      );
    }

    const { reportId } = await request.json();

    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID is required' },
        { status: 400 }
      );
    }

    // Check if report exists and is verified
    const report = await Report.findById(reportId);
    if (!report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    if (report.status !== 'verified') {
      return NextResponse.json(
        { error: 'Only verified reports can be marked as completed' },
        { status: 400 }
      );
    }

    // Create or update worker task for this report
    const existingTask = await WorkerTask.findOne({
      reportId: reportId,
      workerId: decoded.userId,
    });

    if (existingTask) {
      // Update existing task to completed
      existingTask.status = 'completed';
      existingTask.completedDate = new Date();
      await existingTask.save();
    } else {
      // Create new completed task
      await WorkerTask.create({
        reportId: reportId,
        workerId: decoded.userId,
        status: 'completed',
        assignedDate: new Date(),
        completedDate: new Date(),
      });
    }

    // Award bonus points to worker for completing the collection (15 points)
    await User.findByIdAndUpdate(
      decoded.userId,
      { $inc: { totalPoints: 15 } }
    );

    // Note: Report status remains 'verified' - WorkerTask tracks collection completion

    return NextResponse.json({
      success: true,
      message: 'Report marked as completed successfully. +15 points earned!',
      task: existingTask || { reportId, status: 'completed' },
      pointsEarned: 15,
    });
  } catch (error) {
    console.error('Error completing report:', error);
    return NextResponse.json(
      { error: 'Failed to complete report' },
      { status: 500 }
    );
  }
}
