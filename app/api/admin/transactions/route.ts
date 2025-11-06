import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';
import Transaction from '@/models/Transaction';

// GET /api/admin/transactions - Get all transactions (Admin only)
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
    const type = searchParams.get('type');
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query
    const query: Record<string, unknown> = {};
    if (type) query.type = type;
    if (userId) query.userId = userId;

    // Fetch transactions with pagination
    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(query)
      .populate('userId', 'name email role')
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Transaction.countDocuments(query);

    // Calculate statistics
    const stats = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
    ]);

    const overallStats = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalPointsAwarded: { $sum: '$amount' },
          totalTransactions: { $sum: 1 },
          avgPointsPerTransaction: { $avg: '$amount' },
        },
      },
    ]);

    return NextResponse.json({
      transactions,
      stats,
      overallStats: overallStats[0] || {
        totalPointsAwarded: 0,
        totalTransactions: 0,
        avgPointsPerTransaction: 0,
      },
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/transactions - Manual adjustment (Admin only)
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { userId, amount, description, metadata } = body;

    if (!userId || !amount || !description) {
      return NextResponse.json(
        { error: 'userId, amount, and description are required' },
        { status: 400 }
      );
    }

    // Import here to avoid circular dependency
    const { awardPoints } = await import('@/lib/rewards');

    const result = await awardPoints({
      userId,
      type: 'manual_adjustment',
      amount,
      description,
      adminId: decoded.userId,
      metadata,
    });

    return NextResponse.json({
      message: 'Points adjusted successfully',
      transaction: result.transaction,
      newTotalPoints: result.newTotalPoints,
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
