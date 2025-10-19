import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { verifyToken } from '@/lib/auth';

// Join an event
export async function POST(
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

    const eventId = id;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if event is upcoming
    if (event.status !== 'upcoming') {
      return NextResponse.json(
        { error: 'Can only join upcoming events' },
        { status: 400 }
      );
    }

    // Check if user is already a participant
    const isAlreadyParticipant = event.participants.some(
      (participantId) => participantId.toString() === decoded.userId
    );

    if (isAlreadyParticipant) {
      return NextResponse.json(
        { error: 'You are already registered for this event' },
        { status: 400 }
      );
    }

    // Add user to participants
    event.participants.push(decoded.userId);
    await event.save();

    return NextResponse.json(
      {
        message: 'Successfully joined the event',
        participantCount: event.participants.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Join event error:', error);
    return NextResponse.json(
      { error: 'Failed to join event' },
      { status: 500 }
    );
  }
}

// Leave an event
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
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const eventId = id;

    // Find the event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user is a participant
    const participantIndex = event.participants.findIndex(
      (participantId) => participantId.toString() === decoded.userId
    );

    if (participantIndex === -1) {
      return NextResponse.json(
        { error: 'You are not registered for this event' },
        { status: 400 }
      );
    }

    // Remove user from participants
    event.participants.splice(participantIndex, 1);
    await event.save();

    return NextResponse.json(
      {
        message: 'Successfully left the event',
        participantCount: event.participants.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Leave event error:', error);
    return NextResponse.json(
      { error: 'Failed to leave event' },
      { status: 500 }
    );
  }
}
