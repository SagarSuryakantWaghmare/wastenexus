import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/index';
import User from '@/lib/db/models/User';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const topUsers = await User.find({ role: 'user' })
      .sort({ points: -1 })
      .limit(limit)
      .select('name email points');

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      points: user.points,
      userId: user._id,
    }));

    return NextResponse.json({ leaderboard });
  } catch (error: any) {
    console.error('Get leaderboard error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
