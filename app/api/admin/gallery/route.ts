import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { uploadToCloudinary } from '@/lib/cloudinary';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET: Fetch all gallery items (admin view)
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const galleries = await Gallery.find()
      .populate('createdBy', 'name email')
      .sort({ order: 1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: galleries,
    });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

// POST: Create a new gallery item
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;
    const isActive = formData.get('isActive') === 'true';
    const order = parseInt(formData.get('order') as string) || 0;

    // Validation
    if (!name || name.trim().length < 3 || name.trim().length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 3 and 100 characters' },
        { status: 400 }
      );
    }

    if (!title || title.trim().length < 3 || title.trim().length > 60) {
      return NextResponse.json(
        { error: 'Title must be between 3 and 60 characters' },
        { status: 400 }
      );
    }

    if (!location || location.trim().length > 150) {
      return NextResponse.json(
        { error: 'Location is required and must not exceed 150 characters' },
        { status: 400 }
      );
    }

    if (!description || description.trim().length < 10 || description.trim().length > 500) {
      return NextResponse.json(
        { error: 'Description must be between 10 and 500 characters' },
        { status: 400 }
      );
    }

    if (!imageFile) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(imageFile);

    const newGallery = await Gallery.create({
      name: name.trim(),
      title: title.trim(),
      location: location.trim(),
      date: new Date(date),
      description: description.trim(),
      image: imageUrl,
      isActive: isActive ?? true,
      order: order ?? 0,
      createdBy: decoded.userId,
    });

    const populatedGallery = await Gallery.findById(newGallery._id).populate(
      'createdBy',
      'name email'
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Gallery item created successfully',
        data: populatedGallery,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}
