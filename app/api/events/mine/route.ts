import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { verifyToken } from '@/lib/auth';

// GET /api/events/mine - Get events created by the authenticated champion
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

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'champion') {
      return NextResponse.json(
        { error: 'Only champions can access this endpoint' },
        { status: 403 }
      );
    }

    // Fetch events created by this champion
    const events = await Event.find({ championId: decoded.userId })
      .sort({ date: -1 }) // Future events first
      .limit(100);

    return NextResponse.json(
      {
        events: events.map(event => ({
          id: event._id,
          championId: event.championId,
          title: event.title,
          description: event.description,
          wasteFocus: event.wasteFocus || 'Waste Collection',
          locationName: event.locationName || event.location,
          locationAddress: event.locationAddress || event.location,
          eventDate: event.date,
          imageUrl: (event.images && event.images.length > 0) ? event.images[0] : '',
          images: event.images || [],
          participantCount: event.participants?.length || 0,
          participants: event.participants || [],
          status: event.status,
          createdAt: event.createdAt,
        })),
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch my events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
