import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketplaceItem from '@/models/MarketplaceItem';
import { verifyToken } from '@/lib/auth';

// GET /api/admin/marketplace/stats - Get marketplace statistics
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

    // Verify token and check admin role
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get overall statistics
    const [
      totalItems,
      pendingItems,
      approvedItems,
      rejectedItems,
      soldItems,
      totalViews,
      categoryStats,
      recentItems,
    ] = await Promise.all([
      MarketplaceItem.countDocuments(),
      MarketplaceItem.countDocuments({ status: 'pending' }),
      MarketplaceItem.countDocuments({ status: 'approved' }),
      MarketplaceItem.countDocuments({ status: 'rejected' }),
      MarketplaceItem.countDocuments({ status: 'sold' }),
      MarketplaceItem.aggregate([
        { $group: { _id: null, totalViews: { $sum: '$views' } } },
      ]),
      MarketplaceItem.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalValue: { $sum: '$price' },
          },
        },
        { $sort: { count: -1 } },
      ]),
      MarketplaceItem.find()
        .sort('-createdAt')
        .limit(10)
        .select('title status createdAt price')
        .populate('seller', 'name')
        .lean(),
    ]);

    const stats = {
      overview: {
        totalItems,
        pendingItems,
        approvedItems,
        rejectedItems,
        soldItems,
        totalViews: totalViews[0]?.totalViews || 0,
      },
      categoryBreakdown: categoryStats,
      recentItems,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching marketplace stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
