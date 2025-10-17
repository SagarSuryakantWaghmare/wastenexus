import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketplaceItem from '@/models/MarketplaceItem';
import { verifyToken } from '@/lib/auth';

// GET /api/marketplace/my-items - Get user's own items
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // Filter by status

    const query: Record<string, unknown> = { seller: decoded.userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const items = await MarketplaceItem.find(query)
      .sort('-createdAt')
      .lean();

    // Calculate statistics
    const stats = {
      total: items.length,
      pending: items.filter((item) => item.status === 'pending').length,
      approved: items.filter((item) => item.status === 'approved').length,
      rejected: items.filter((item) => item.status === 'rejected').length,
      sold: items.filter((item) => item.status === 'sold').length,
      totalViews: items.reduce((sum, item) => sum + (item.views || 0), 0),
      totalFavorites: items.reduce((sum, item) => sum + (item.favorites?.length || 0), 0),
    };

    return NextResponse.json({
      items,
      stats,
    });
  } catch (error) {
    console.error('Error fetching user items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
