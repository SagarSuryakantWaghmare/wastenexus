import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketplaceItem from '@/models/MarketplaceItem';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// PUT /api/admin/marketplace/[id]/verify - Approve or reject item
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

    // Verify token and check admin role
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action, rejectionReason } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      );
    }

    if (action === 'reject' && !rejectionReason) {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
      );
    }

    const item = await MarketplaceItem.findById(id);
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    if (item.status !== 'pending') {
      return NextResponse.json(
        { error: 'Only pending items can be verified' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      item.status = 'approved';
      item.approvedAt = new Date();
      item.approvedBy = decoded.userId as never;
      item.rejectionReason = undefined;

      // Award points to seller for approved marketplace item (30 points)
      const pointsToAward = 30;
      await User.findByIdAndUpdate(
        item.sellerId,
        { $inc: { totalPoints: pointsToAward } }
      );

      await item.save();

      return NextResponse.json({
        message: `Item approved successfully! +${pointsToAward} points awarded to seller`,
        item,
        pointsAwarded: pointsToAward,
      });
    } else {
      item.status = 'rejected';
      item.rejectionReason = rejectionReason;
      
      await item.save();

      return NextResponse.json({
        message: `Item rejected successfully`,
        item,
      });
    }
  } catch (error) {
    console.error('Error verifying item:', error);
    return NextResponse.json(
      { error: 'Failed to verify item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
