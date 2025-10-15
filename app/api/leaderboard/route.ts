import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');

    // Fetch top users by points
    const users = await User.find({ role: 'client' })
      .select('name email totalPoints createdAt')
      .sort({ totalPoints: -1, createdAt: 1 })
      .limit(Math.min(limit, 100));

    return NextResponse.json(
      {
        leaderboard: users.map((user, index) => ({
          rank: index + 1,
          id: user._id,
          name: user.name,
          email: user.email,
          totalPoints: user.totalPoints,
          joinedAt: user.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch leaderboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
