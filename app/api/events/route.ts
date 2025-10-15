import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { verifyToken } from '@/lib/auth';

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
    if (!decoded || decoded.role !== 'champion') {
      return NextResponse.json(
        { error: 'Only champions can create events' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, location, coordinates, date } = body;

    // Validation
    if (!title || !description || !location || !date) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const eventDate = new Date(date);
    if (eventDate < new Date()) {
      return NextResponse.json(
        { error: 'Event date must be in the future' },
        { status: 400 }
      );
    }

    // Create event
    const event = await Event.create({
      championId: decoded.userId,
      title,
      description,
      location,
      coordinates,
      date: eventDate,
      status: 'upcoming',
    });

    return NextResponse.json(
      {
        message: 'Event created successfully',
        event: {
          id: event._id,
          title: event.title,
          description: event.description,
          location: event.location,
          coordinates: event.coordinates,
          date: event.date,
          status: event.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Event creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    // Build query
    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    }

    const events = await Event.find(query)
      .populate('championId', 'name email')
      .sort({ date: 1 })
      .limit(100);

    return NextResponse.json(
      {
        events: events.map(event => ({
          id: event._id,
          champion: event.championId,
          title: event.title,
          description: event.description,
          location: event.location,
          coordinates: event.coordinates,
          date: event.date,
          participantCount: event.participants.length,
          status: event.status,
          createdAt: event.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch events error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
