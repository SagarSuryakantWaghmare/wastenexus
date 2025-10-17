import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import MarketplaceItem from '@/models/MarketplaceItem';
import { verifyToken } from '@/lib/auth';

// GET /api/marketplace - Browse all approved items with filters
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // Filters
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || '-createdAt'; // Default: newest first
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Build query
    const query: Record<string, unknown> = { status: 'approved' };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (condition) {
      query.condition = condition;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const items = await MarketplaceItem.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('seller', 'name')
      .lean();

    const total = await MarketplaceItem.countDocuments(query);

    return NextResponse.json({
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching marketplace items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST /api/marketplace - Create new item (pending approval)
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

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get user details from database
    const User = (await import('@/models/User')).default;
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
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
    } = body;

    // Validation
    if (!title || !description || !category || !condition || price === undefined || !images || images.length === 0) {
      return NextResponse.json(
        { error: 'Please provide all required fields: title, description, category, condition, price, and at least one image' },
        { status: 400 }
      );
    }

    if (!location?.address || !location?.city || !location?.state) {
      return NextResponse.json(
        { error: 'Please provide complete location information' },
        { status: 400 }
      );
    }

    if (images.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 images allowed' },
        { status: 400 }
      );
    }

    // Create new marketplace item
    console.log('Creating marketplace item with data:', {
      title,
      description,
      category,
      condition,
      price,
      imagesCount: images.length,
      seller: decoded.userId,
      sellerName: user.name,
      location,
    });

    const newItem = await MarketplaceItem.create({
      title,
      description,
      category,
      condition,
      price,
      images,
      seller: decoded.userId,
      sellerName: user.name,
      sellerContact: sellerContact || user.email,
      location,
      tags: tags || [],
      isNegotiable: isNegotiable !== false,
      status: 'pending', // Always pending initially
    });

    console.log('Item created successfully:', newItem._id);

    return NextResponse.json(
      {
        message: 'Item submitted for approval',
        item: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating marketplace item:', error);
    return NextResponse.json(
      { error: 'Failed to create item', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
