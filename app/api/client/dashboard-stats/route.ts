import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import Job from '@/models/Job';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

import { Types } from 'mongoose';

interface UserDocument {
  _id: Types.ObjectId | string;
  totalPoints: number;
  [key: string]: any; // Allow other properties
}

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded: JWTPayload;
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      if (typeof payload === 'string' || !('userId' in payload) || !('role' in payload)) {
        throw new Error('Invalid token payload');
      }
      decoded = payload as JWTPayload;
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    if (decoded.role !== 'client') {
      return NextResponse.json(
        { success: false, message: 'Forbidden - Not a client' },
        { status: 403 }
      );
    }

    await connectDB();

    const userId = decoded.userId;

    // Get current user data
    const currentUser = await User.findById(userId).select('totalPoints');

    // Calculate date ranges
    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Total Points with growth
    const totalPoints = currentUser?.totalPoints || 0;
    const pointsLastWeek = await Report.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: twoWeeksAgo, $lt: lastWeek }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$pointsAwarded' }
        }
      }
    ]);
    const previousPoints = pointsLastWeek[0]?.total || 0;
    const pointsGrowth = previousPoints > 0 ? ((totalPoints - previousPoints) / previousPoints * 100) : 0;

    // User Rank
    const allUsers = await User.find({ role: 'client' })
      .select('_id totalPoints')
      .sort({ totalPoints: -1 })
      .lean<UserDocument[]>();
    
    const userRank = allUsers.findIndex(u => u._id.toString() === userId) + 1;
    
    // Calculate rank from last week
    const usersLastWeek = await User.find({ role: 'client' })
      .select('_id totalPoints')
      .lean<UserDocument[]>();
    
    const userRanksLastWeek = [...usersLastWeek].sort((a, b) => b.totalPoints - a.totalPoints);
    const rankLastWeek = userRanksLastWeek.findIndex(u => u._id.toString() === userId) + 1;
    const rankChange = rankLastWeek - userRank; // Positive means rank improved

    // Total Reports
    const totalReports = await Report.countDocuments({ userId });
    const reportsLastWeek = await Report.countDocuments({
      userId,
      createdAt: { $gte: twoWeeksAgo, $lt: lastWeek }
    });
    const reportsGrowth = reportsLastWeek > 0 
      ? ((totalReports - reportsLastWeek) / reportsLastWeek * 100) 
      : totalReports > 0 ? 100 : 0;

    // Active Jobs
    const activeJobs = await Job.countDocuments({
      clientId: userId,
      status: { $in: ['pending', 'assigned', 'in-progress'] }
    });
    const activeJobsLastWeek = await Job.countDocuments({
      clientId: userId,
      status: { $in: ['pending', 'assigned', 'in-progress'] },
      createdAt: { $lt: lastWeek }
    });
    const jobsGrowth = activeJobsLastWeek > 0 
      ? ((activeJobs - activeJobsLastWeek) / activeJobsLastWeek * 100) 
      : activeJobs > 0 ? 100 : 0;

    // Additional stats
    const verifiedReports = await Report.countDocuments({
      userId,
      status: 'verified'
    });

    const completedJobs = await Job.countDocuments({
      clientId: userId,
      status: 'completed'
    });

    const totalWasteCollected = await Report.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
          status: 'verified',
          weightKg: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$weightKg' }
        }
      }
    ]);

    const stats = {
      totalPoints: {
        count: totalPoints,
        growth: Math.round(pointsGrowth * 10) / 10,
        isPositive: pointsGrowth >= 0
      },
      userRank: {
        rank: userRank,
        total: allUsers.length,
        change: rankChange,
        isImproved: rankChange > 0
      },
      totalReports: {
        count: totalReports,
        verified: verifiedReports,
        growth: Math.round(reportsGrowth * 10) / 10,
        isPositive: reportsGrowth >= 0
      },
      activeJobs: {
        count: activeJobs,
        completed: completedJobs,
        growth: Math.round(jobsGrowth * 10) / 10,
        isPositive: jobsGrowth >= 0
      },
      totalWasteCollected: totalWasteCollected[0]?.total || 0
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching client dashboard stats:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch dashboard stats',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
