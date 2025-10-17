import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    await dbConnect();

    // Import User model
    const User = (await import('@/models/User')).default;

    // Fetch all users (exclude password field)
    const users = await User.find({}, '-password').sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      total: users.length,
      clients: users.filter((u: { role: string }) => u.role === 'client').length,
      champions: users.filter((u: { role: string }) => u.role === 'champion').length,
      admins: users.filter((u: { role: string }) => u.role === 'admin').length,
    };

    return NextResponse.json({
      users,
      stats,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
