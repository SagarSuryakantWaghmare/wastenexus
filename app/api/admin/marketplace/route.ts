import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketplaceItem from '@/models/MarketplaceItem';
import { verifyToken } from '@/lib/auth';

// GET /api/admin/marketplace - Get all marketplace items with filtering
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // pending, approved, rejected, sold, all
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }

    // Fetch items with seller details
    const items = await MarketplaceItem.find(query)
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('seller', 'name email phone')
      .lean();

    const total = await MarketplaceItem.countDocuments(query);

    // Get statistics
    const [stats, categoryBreakdown] = await Promise.all([
      MarketplaceItem.aggregate([
        {
          $facet: {
            statusCounts: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 },
                },
              },
            ],
            overview: [
              {
                $group: {
                  _id: null,
                  totalItems: { $sum: 1 },
                  totalViews: { $sum: '$views' },
                  totalValue: { $sum: '$price' },
                  avgPrice: { $avg: '$price' },
                },
              },
            ],
          },
        },
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
    ]);

    // Format statistics
    const statusCounts = stats[0]?.statusCounts.reduce(
      (acc: { [key: string]: number }, item: { _id: string; count: number }) => {
        acc[item._id] = item.count;
        return acc;
      },
      {}
    ) || {};

    const overview = stats[0]?.overview[0] || {
      totalItems: 0,
      totalViews: 0,
      totalValue: 0,
      avgPrice: 0,
    };

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: {
        total: overview.totalItems,
        pending: statusCounts.pending || 0,
        approved: statusCounts.approved || 0,
        rejected: statusCounts.rejected || 0,
        sold: statusCounts.sold || 0,
        totalViews: overview.totalViews,
        totalValue: overview.totalValue,
        avgPrice: Math.round(overview.avgPrice || 0),
      },
      categoryBreakdown,
    });
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketplace items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
