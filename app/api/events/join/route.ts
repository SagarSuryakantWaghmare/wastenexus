import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/index';
import Event from '@/lib/db/models/Event';
import User from '@/lib/db/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { eventId, userId } = await req.json();

    const event = await Event.findById(eventId);
    
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.participants.length >= event.maxParticipants) {
      return NextResponse.json({ error: 'Event is full' }, { status: 400 });
    }

    if (event.participants.includes(userId)) {
      return NextResponse.json({ error: 'Already joined' }, { status: 400 });
    }

    event.participants.push(userId);
    await event.save();

    // Award points when joining
    await User.findByIdAndUpdate(userId, { $inc: { points: event.pointsReward } });

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error('Join event error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
