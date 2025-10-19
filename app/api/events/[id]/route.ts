import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { verifyToken } from '@/lib/auth';

// GET /api/events/[id] - Get event details with participants
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    // Await params in Next.js 15
    const { id } = await params;

    // Find the event and populate champion and participants
    const event = await Event.findById(id)
      .populate('championId', 'name email profileImage')
      .populate('participants', 'name email profileImage');

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        event: {
          id: event._id,
          champion: event.championId,
          title: event.title,
          description: event.description,
          location: event.location,
          locationName: event.locationName,
          locationAddress: event.locationAddress,
          wasteFocus: event.wasteFocus,
          coordinates: event.coordinates,
          date: event.date,
          images: event.images || [],
          participants: event.participants,
          participantCount: event.participants.length,
          status: event.status,
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Fetch event error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event details' },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id] - Update an event (Champion only, must own the event)
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
    if (!decoded || decoded.role !== 'champion') {
      return NextResponse.json(
        { error: 'Only champions can update events' },
        { status: 403 }
      );
    }

    const eventId = id;
    const body = await request.json();

    // Find event and verify ownership
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.championId.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'You can only update your own events' },
        { status: 403 }
      );
    }

    // Update fields
    const {
      title,
      description,
      wasteFocus,
      locationName,
      locationAddress,
      eventDate,
      imageUrl,
    } = body;

    if (title) event.title = title;
    if (description) {
      if (description.length < 50) {
        return NextResponse.json(
          { error: 'Description must be at least 50 characters' },
          { status: 400 }
        );
      }
      event.description = description;
    }
    if (wasteFocus) event.wasteFocus = wasteFocus;
    if (locationName) event.locationName = locationName;
    if (locationAddress) event.locationAddress = locationAddress;
    if (eventDate) event.date = new Date(eventDate);
    if (imageUrl !== undefined) event.imageUrl = imageUrl;

    await event.save();

    return NextResponse.json(
      {
        message: 'Event updated successfully',
        event: {
          id: event._id,
          championId: event.championId,
          title: event.title,
          description: event.description,
          wasteFocus: event.wasteFocus,
          locationName: event.locationName,
          locationAddress: event.locationAddress,
          eventDate: event.date,
          imageUrl: event.imageUrl,
          participantCount: event.participants?.length || 0,
          status: event.status,
        },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id] - Delete an event (Champion only, must own the event)
export async function DELETE(
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
    if (!decoded || decoded.role !== 'champion') {
      return NextResponse.json(
        { error: 'Only champions can delete events' },
        { status: 403 }
      );
    }

    const eventId = id;

    // Find event and verify ownership
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (event.championId.toString() !== decoded.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own events' },
        { status: 403 }
      );
    }

    await Event.findByIdAndDelete(eventId);

    return NextResponse.json(
      {
        message: 'Event deleted successfully',
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
