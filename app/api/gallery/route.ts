import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';

// GET: Fetch active gallery items for public display
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const galleries = await Gallery.find({ isActive: true })
      .select('name title location date description image order')
      .sort({ order: 1, createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: galleries,
    });
  } catch (error) {
    console.error('Error fetching public galleries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}
