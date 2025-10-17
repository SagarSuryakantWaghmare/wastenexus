import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketplaceItem from '@/models/MarketplaceItem';
import { verifyToken } from '@/lib/auth';

// POST /api/marketplace/[id]/favorite - Toggle favorite
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Await params in Next.js 15
    const { id } = await params;

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

    const item = await MarketplaceItem.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Only approved items can be favorited
    if (item.status !== 'approved') {
      return NextResponse.json(
        { error: 'Item not available' },
        { status: 404 }
      );
    }

    const userId = decoded.userId;
    const isFavorited = item.favorites.includes(userId as never);

    if (isFavorited) {
  // Remove from favorites
  item.favorites = item.favorites.filter((favId: string) => favId.toString() !== userId);
    } else {
      // Add to favorites
      item.favorites.push(userId as never);
    }

    await item.save();

    return NextResponse.json({
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      isFavorited: !isFavorited,
      favoritesCount: item.favorites.length,
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json(
      { error: 'Failed to toggle favorite', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
