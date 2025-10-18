import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    await dbConnect();


    // Import models (register User before population)
    const User = (await import('@/models/User')).default;
    const Event = (await import('@/models/Event')).default;

    // Fetch all events with champion details
    const events = await Event.find({})
      .populate('championId', 'name email')
      .populate('participants', 'name email')
      .sort({ date: -1 });

    // Calculate statistics
    const now = new Date();
    const stats = {
      total: events.length,
      upcoming: events.filter((e: { date: Date; status: string }) => new Date(e.date) > now || e.status === 'upcoming').length,
      ongoing: events.filter((e: { status: string }) => e.status === 'ongoing').length,
      completed: events.filter((e: { status: string }) => e.status === 'completed').length,
      totalParticipants: events.reduce((sum: number, e: { participants: unknown[] }) => sum + (e.participants?.length || 0), 0),
    };

    // Get unique locations
    const locations = [...new Set(events.map((e: { location: string }) => e.location))];

    // Calculate waste focus breakdown
    const wasteFocusBreakdown = events.reduce((acc: Record<string, number>, event: { wasteFocus?: string }) => {
      if (event.wasteFocus) {
        acc[event.wasteFocus] = (acc[event.wasteFocus] || 0) + 1;
      }
      return acc;
    }, {});

    // Get upcoming events (next 10)
    const upcomingEvents = events
      .filter((e: { date: Date; status: string }) => new Date(e.date) > now || e.status === 'upcoming')
      .slice(0, 10);

    // Get recent events (last 10)
    const recentEvents = events.slice(0, 10);

    return NextResponse.json({
      events,
      stats,
      locations,
      wasteFocusBreakdown,
      upcomingEvents,
      recentEvents,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// Update event status
export async function PUT(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { eventId, status } = body;

    if (!eventId || !status) {
      return NextResponse.json({ error: 'Event ID and status are required' }, { status: 400 });
    }

    if (!['upcoming', 'ongoing', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    await dbConnect();

    // Import Event model
    const Event = (await import('@/models/Event')).default;

    // Update event
    const event = await Event.findByIdAndUpdate(
      eventId,
      { status },
      { new: true }
    ).populate('championId', 'name email');

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Event status updated successfully',
      event,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// Delete event
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    await dbConnect();

    // Import Event model
    const Event = (await import('@/models/Event')).default;

    // Delete event
    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
