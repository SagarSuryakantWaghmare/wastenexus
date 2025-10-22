import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Report from '@/models/Report';
import Event from '@/models/Event';
import MarketplaceItem from '@/models/MarketplaceItem';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Verify admin authentication
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Check if user is admin
    const user = await User.findById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    // Get current date ranges for comparison
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // Get total users count
    const totalUsers = await User.countDocuments();
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth }
    });
    const currentMonthUsers = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Calculate user growth percentage
    const userGrowth = lastMonthUsers > 0 
      ? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers * 100).toFixed(1)
      : 0;

    // Get reports count
    const totalReports = await Report.countDocuments();
    const lastWeekReports = await Report.countDocuments({
      createdAt: { $gte: startOfLastWeek, $lt: startOfWeek }
    });
    const currentWeekReports = await Report.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    // Calculate report growth percentage
    const reportGrowth = lastWeekReports > 0
      ? ((currentWeekReports - lastWeekReports) / lastWeekReports * 100).toFixed(1)
      : 0;

    // Get pending actions count
    const pendingMarketplace = await MarketplaceItem.countDocuments({ status: 'pending' });
    const pendingReports = await Report.countDocuments({ status: 'pending' });
    const pendingWorkerApplications = await User.countDocuments({ 
      role: 'worker',
      'workerApplication.status': 'pending'
    });
    
    const totalPending = pendingMarketplace + pendingReports + pendingWorkerApplications;
    const urgentCount = pendingReports; // Reports are considered urgent

    // Get events count
    const totalEvents = await Event.countDocuments();
    const lastMonthEvents = await Event.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth }
    });
    const currentMonthEvents = await Event.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // Calculate event growth percentage
    const eventGrowth = lastMonthEvents > 0
      ? ((currentMonthEvents - lastMonthEvents) / lastMonthEvents * 100).toFixed(1)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: {
          count: totalUsers,
          growth: Number(userGrowth),
          isPositive: Number(userGrowth) >= 0
        },
        newReports: {
          count: totalReports,
          growth: Number(reportGrowth),
          isPositive: Number(reportGrowth) >= 0
        },
        pendingActions: {
          count: totalPending,
          urgent: urgentCount
        },
        totalEvents: {
          count: totalEvents,
          growth: Number(eventGrowth),
          isPositive: Number(eventGrowth) >= 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
