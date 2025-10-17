import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketplaceItem from '@/models/MarketplaceItem';
import { verifyToken } from '@/lib/auth';

// GET /api/marketplace/[id] - Get single item details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Await params in Next.js 15
    const { id } = await params;

    const item = await MarketplaceItem.findById(id)
      .populate('seller', 'name email')
      .lean();

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Only show approved items to non-sellers
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    let isSeller = false;
    
    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.userId === item.seller._id.toString()) {
        isSeller = true;
      }
    }

    if (item.status !== 'approved' && !isSeller) {
      return NextResponse.json(
        { error: 'Item not available' },
        { status: 404 }
      );
    }

    // Increment view count (only for approved items and non-sellers)
    if (item.status === 'approved' && !isSeller) {
      await MarketplaceItem.findByIdAndUpdate(params.id, {
        $inc: { views: 1 },
      });
      item.views = (item.views || 0) + 1;
    }

    // Get similar items
    const similarItems = await MarketplaceItem.find({
      _id: { $ne: params.id },
      category: item.category,
      status: 'approved',
    })
      .limit(4)
      .select('title price images location condition')
      .lean();

    return NextResponse.json({
      item,
      similarItems,
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// PUT /api/marketplace/[id] - Update item
export async function PUT(
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

    const item = await MarketplaceItem.findById(params.id);
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if user is the seller
    if (item.seller.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'You can only edit your own items' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      condition,
      price,
      images,
      sellerContact,
      location,
      tags,
      isNegotiable,
      status,
    } = body;

    // Update allowed fields
    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (condition) item.condition = condition;
    if (price !== undefined) item.price = price;
    if (images) item.images = images;
    if (sellerContact) item.sellerContact = sellerContact;
    if (location) item.location = location;
    if (tags) item.tags = tags;
    if (isNegotiable !== undefined) item.isNegotiable = isNegotiable;
    
    // Allow seller to mark as sold
    if (status === 'sold' && item.status === 'approved') {
      item.status = 'sold';
      item.soldAt = new Date();
    }

    // If item was rejected and being re-edited, reset to pending
    if (item.status === 'rejected') {
      item.status = 'pending';
      item.rejectionReason = undefined;
    }

    await item.save();

    return NextResponse.json({
      message: 'Item updated successfully',
      item,
    });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE /api/marketplace/[id] - Delete item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const item = await MarketplaceItem.findById(params.id);
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if user is the seller
    if (item.seller.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own items' },
        { status: 403 }
      );
    }

    await MarketplaceItem.findByIdAndDelete(params.id);

    return NextResponse.json({
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
