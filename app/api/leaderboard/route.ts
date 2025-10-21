import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const role = searchParams.get('role'); // Optional role filter

    // Build query - exclude admins from leaderboard
    const query: { role?: { $in: string[] } } = {};
    if (role && ['client', 'worker', 'champion'].includes(role)) {
      query.role = { $in: [role] };
    } else {
      query.role = { $in: ['client', 'worker', 'champion'] };
    }

    // Fetch top users by points
    const users = await User.find(query)
      .select('name email role totalPoints createdAt')
      .sort({ totalPoints: -1, createdAt: 1 })
      .limit(Math.min(limit, 100));

    return NextResponse.json(
      {
        leaderboard: users.map((user, index) => ({
          rank: index + 1,
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
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
