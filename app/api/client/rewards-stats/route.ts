import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import connectDB from '@/lib/mongodb';
import Report from '@/models/Report';
import Job from '@/models/Job';
import User from '@/models/User';
import MarketplaceItem from '@/models/MarketplaceItem';
import Event from '@/models/Event';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
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
    const totalPoints = currentUser?.totalPoints || 0;

    // Get user rank
    interface UserDoc {
      _id: Types.ObjectId | string;
      totalPoints: number;
    }
    
    const allUsers = await User.find({ role: 'client' })
      .select('_id totalPoints')
      .sort({ totalPoints: -1 })
      .lean<UserDoc[]>();
    
    const userRank = allUsers.findIndex((u: UserDoc) => {
      const idString = u._id instanceof Types.ObjectId ? u._id.toString() : String(u._id);
      return idString === userId;
    }) + 1;
    const totalUsers = allUsers.length;

    // Get reports count
    const reportsCount = await Report.countDocuments({ userId });

    // Get jobs count
    const jobsCount = await Job.countDocuments({ clientId: userId });

    // Get marketplace items count
    const marketplaceItemsCount = await MarketplaceItem.countDocuments({ sellerId: userId });

    // Get events joined count
    const eventsJoined = await Event.countDocuments({
      'registrations.userId': userId
    });

    // Calculate points breakdown by activity
    const reportPoints = await Report.aggregate([
      { $match: { userId: userId, status: 'verified' } },
      { $group: { _id: null, total: { $sum: '$pointsAwarded' } } }
    ]);

    const jobPoints = await Job.aggregate([
      { $match: { clientId: userId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$pointsAwarded' } } }
    ]);

    const marketplacePoints = await MarketplaceItem.aggregate([
      { $match: { sellerId: userId, status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$pointsAwarded' } } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalPoints,
        rank: userRank,
        totalUsers,
        reportsCount,
        jobsCount,
        marketplaceItemsCount,
        eventsJoined,
        pointsBreakdown: {
          reports: reportPoints[0]?.total || 0,
          jobs: jobPoints[0]?.total || 0,
          marketplace: marketplacePoints[0]?.total || 0,
        }
      }
    });

  } catch (error) {
    console.error('Error fetching rewards stats:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
