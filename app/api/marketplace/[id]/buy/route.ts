import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketplaceItem from '@/models/MarketplaceItem';
import { verifyToken } from '@/lib/auth';

// POST /api/marketplace/[id]/buy - Mark item as sold
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization required' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { id } = await context.params;
    const { buyerName, buyerContact } = await req.json();

    if (!buyerName || !buyerContact) {
      return NextResponse.json(
        { message: 'Buyer name and contact are required' },
        { status: 400 }
      );
    }

    const item = await MarketplaceItem.findById(id);

    if (!item) {
      return NextResponse.json(
        { message: 'Item not found' },
        { status: 404 }
      );
    }

    // Check if item is already sold
    if (item.status === 'sold') {
      return NextResponse.json(
        { message: 'This item has already been sold' },
        { status: 400 }
      );
    }

    // Check if item is approved
    if (item.status !== 'approved') {
      return NextResponse.json(
        { message: 'This item is not available for purchase' },
        { status: 400 }
      );
    }

    // Check if user is trying to buy their own item
    if (item.seller.toString() === decoded.userId) {
      return NextResponse.json(
        { message: 'You cannot buy your own item' },
        { status: 400 }
      );
    }

    // Update item status to sold
    item.status = 'sold';
    item.buyer = decoded.userId;
    item.buyerName = buyerName;
    item.buyerContact = buyerContact;
    item.soldAt = new Date();

    await item.save();

    return NextResponse.json(
      {
        message: 'Purchase request successful! The seller will contact you soon.',
        item,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing purchase:', error);
    return NextResponse.json(
      { message: 'Failed to process purchase' },
      { status: 500 }
    );
  }
}
