import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    // Verify admin access
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Connect to database
    await dbConnect();

    // Get mongoose connection and models
    const db = mongoose.connection;
    
    // Fetch activities with pagination
    const activities = await db.collection('activities')
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const total = await db.collection('activities').countDocuments();

    // Format the response
    const formattedActivities = activities.map((activity: any) => ({
      id: activity._id?.toString() || '',
      action: activity.action || '',
      type: activity.type || 'system',
      details: activity.details || '',
      userId: activity.userId?.toString() || '',
      user: activity.userName || 'System',
      timestamp: activity.createdAt || new Date(),
      time: formatTimeAgo(activity.createdAt || new Date())
    }));

    return NextResponse.json({
      data: formattedActivities,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    });

  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

// Helper function to format time as "X time ago"
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 
        ? `${interval} ${unit} ago` 
        : `${interval} ${unit}s ago`;
    }
  }
  
  return 'just now';
}

// Import mongoose at the top level
import mongoose from 'mongoose';
