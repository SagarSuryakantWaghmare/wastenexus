import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketplaceItem from '@/models/MarketplaceItem';
import { verifyToken } from '@/lib/auth';

// GET /api/admin/marketplace/pending - Get all pending items
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const pendingItems = await MarketplaceItem.find({ status: 'pending' })
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .populate('seller', 'name email')
      .lean();

    const total = await MarketplaceItem.countDocuments({ status: 'pending' });

    return NextResponse.json({
      items: pendingItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching pending items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
