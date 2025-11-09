import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

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
    
    // Handle multiple images - upload to Cloudinary
    const images: string[] = [];
    console.log('Processing event images...');
    
    for (const entry of form.entries()) {
      const [key, value] = entry;
      if (key === 'image' && value instanceof File) {
        try {
          console.log(`Uploading image: ${value.name}`);
          const cloudinaryUrl = await uploadToCloudinary(value);
          console.log(`Image uploaded successfully: ${cloudinaryUrl}`);
          images.push(cloudinaryUrl);
        } catch (uploadError) {
          console.error(`Failed to upload image ${value.name}:`, uploadError);
          // Continue with other images even if one fails
        }
      }
    }
    
    console.log(`Total images uploaded: ${images.length}`);

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

    // Award bonus points to champion for creating event (50 points)
    await User.findByIdAndUpdate(
      decoded.userId,
      { $inc: { totalPoints: 50 } }
    );

    return NextResponse.json(
      {
        message: 'Event created successfully! +50 points earned',
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
        pointsEarned: 50,
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
    const limit = searchParams.get('limit');

    // Build query
    const query: Record<string, unknown> = {};
    if (status) {
      query.status = status;
    }

    let eventsQuery = Event.find(query)
      .populate('championId', 'name email')
      .sort({ createdAt: -1 }); // Sort by most recent first

    if (limit) {
      eventsQuery = eventsQuery.limit(parseInt(limit));
    } else {
      eventsQuery = eventsQuery.limit(100);
    }

    const events = await eventsQuery;

    return NextResponse.json(
      {
        events: events.map(event => ({
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
          images: event.images,
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
