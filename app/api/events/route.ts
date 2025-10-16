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

    const form = await request.formData();
    const title = form.get('title') as string;
    const description = form.get('description') as string;
    const wasteFocus = form.get('wasteFocus') as string;
    const locationName = form.get('locationName') as string;
    const locationAddress = form.get('locationAddress') as string;
    const date = form.get('date') as string;
    
    // Handle multiple images
    const images: string[] = [];
    for (const entry of form.entries()) {
      const [key, value] = entry;
      if (key === 'image' && value instanceof File) {
        // Save file to disk or cloud storage here (for now, just use filename)
        images.push(value.name);
      }
    }

    // Validation
    if (!title || !description || !date) {
      return NextResponse.json(
        { error: 'Title, description, and date are required' },
        { status: 400 }
      );
    }

    if (description.length < 50) {
      return NextResponse.json(
        { error: 'Description must be at least 50 characters' },
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
      location: locationAddress || '',
      locationName: locationName || '',
      locationAddress: locationAddress || '',
      wasteFocus: wasteFocus || 'Waste Collection',
      date: eventDate,
      images,
      participants: [],
      status: 'upcoming',
    });

    return NextResponse.json(
      {
        message: 'Event created successfully',
        event: {
          id: event._id,
          championId: event.championId,
          title: event.title,
          description: event.description,
          location: event.location,
          locationName: event.locationName,
          locationAddress: event.locationAddress,
          wasteFocus: event.wasteFocus,
          eventDate: event.date,
          imageUrl: (event.images && event.images.length > 0) ? event.images[0] : '',
          images: event.images,
          participantCount: event.participants?.length || 0,
          status: event.status,
          createdAt: event.createdAt,
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
