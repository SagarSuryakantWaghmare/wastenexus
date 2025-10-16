import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

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
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, weightKg, imageUrl, aiClassification, location } = body;

    // Validation
    if (!type || !weightKg) {
      return NextResponse.json(
        { error: 'Type and weight are required' },
        { status: 400 }
      );
    }

    if (weightKg < 0.1) {
      return NextResponse.json(
        { error: 'Weight must be at least 0.1 kg' },
        { status: 400 }
      );
    }

    const validTypes = ['plastic', 'cardboard', 'e-waste', 'metal', 'glass', 'organic', 'paper'];
    if (!validTypes.includes(type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid waste type' },
        { status: 400 }
      );
    }

    // Create report
    const report = await Report.create({
      userId: decoded.userId,
      type: type.toLowerCase(),
      weightKg: parseFloat(weightKg),
      status: 'pending',
      pointsAwarded: 0,
      imageUrl,
      aiClassification,
      location,
    });

    return NextResponse.json(
      {
        message: 'Report submitted successfully',
        report: {
          id: report._id,
          type: report.type,
          weightKg: report.weightKg,
          status: report.status,
          imageUrl: report.imageUrl,
          aiClassification: report.aiClassification,
          location: report.location,
          date: report.date,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Report submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

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
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');

    // Build query
    const query: Record<string, unknown> = {};
    
    if (decoded.role === 'client') {
      // Clients can only see their own reports
      query.userId = decoded.userId;
    } else if (decoded.role === 'champion') {
      // Champions can see all reports or filter by userId
      if (userId) {
        query.userId = userId;
      }
    }

    if (status) {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(
      {
        reports: reports.map(report => ({
          id: report._id,
          user: report.userId,
          type: report.type,
          weightKg: report.weightKg,
          status: report.status,
          pointsAwarded: report.pointsAwarded,
          imageUrl: report.imageUrl,
          aiClassification: report.aiClassification,
          location: report.location,
          date: report.date,
          createdAt: report.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch reports error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
