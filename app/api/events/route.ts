import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/index';
import Event from '@/lib/db/models/Event';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'upcoming';
    
    const events = await Event.find({ status })
      .sort({ date: 1 })
      .populate('organizer', 'name')
      .populate('participants', 'name');

    return NextResponse.json({ events });
  } catch (error: any) {
    console.error('Get events error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const body = await req.json();
    const event = new Event(body);
    await event.save();

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
