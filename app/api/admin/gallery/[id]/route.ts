import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Gallery from '@/models/Gallery';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { uploadToCloudinary } from '@/lib/cloudinary';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET: Fetch single gallery item
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const gallery = await Gallery.findById(id).populate('createdBy', 'name email');

    if (!gallery) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery item' },
      { status: 500 }
    );
  }
}

// PUT: Update gallery item
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    // Support both JSON and FormData. Prefer formData when present.
    let name: string | null = null;
    let title: string | null = null;
    let location: string | null = null;
    let date: string | null = null;
    let description: string | null = null;
    let image: string | null = null;
    let isActive: boolean | null = null;
    let order: number | null = null;
    let removeImage = false;

    // Decide parsing strategy based on Content-Type header to avoid consuming body twice
    const contentType = (req.headers.get('content-type') || '').toLowerCase();
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      name = (form.get('name') as string) || null;
      title = (form.get('title') as string) || null;
      location = (form.get('location') as string) || null;
      date = (form.get('date') as string) || null;
      description = (form.get('description') as string) || null;
      isActive = form.get('isActive') ? (form.get('isActive') === 'true') : null;
      order = form.get('order') ? parseInt(form.get('order') as string) : null;
      removeImage = form.get('removeImage') === 'true';

      const imageEntry = form.get('image');
      if (imageEntry instanceof File) {
        const imageFile = imageEntry as File;
        if (imageFile.size > 0 && imageFile.type.startsWith('image/')) {
          try {
            const uploadedUrl = await uploadToCloudinary(imageFile);
            image = uploadedUrl;
          } catch (uploadErr) {
            console.error('Failed to upload image during update:', uploadErr);
            return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
          }
        }
      }
    } else {
      // Expect JSON
      const body = await req.json();
      name = body.name ?? null;
      title = body.title ?? null;
      location = body.location ?? null;
      date = body.date ?? null;
      description = body.description ?? null;
      image = body.image ?? null;
      isActive = typeof body.isActive === 'boolean' ? body.isActive : null;
      order = typeof body.order === 'number' ? body.order : null;
      removeImage = body.removeImage === true;
    }

    // Validation
    if (name && (name.trim().length < 3 || name.trim().length > 100)) {
      return NextResponse.json(
        { error: 'Name must be between 3 and 100 characters' },
        { status: 400 }
      );
    }

    if (title && (title.trim().length < 3 || title.trim().length > 60)) {
      return NextResponse.json(
        { error: 'Title must be between 3 and 60 characters' },
        { status: 400 }
      );
    }

    if (location && location.trim().length > 150) {
      return NextResponse.json(
        { error: 'Location must not exceed 150 characters' },
        { status: 400 }
      );
    }

    if (description && (description.trim().length < 10 || description.trim().length > 300)) {
      return NextResponse.json(
        { error: 'Description must be between 10 and 300 characters' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name.trim();
    if (title) updateData.title = title.trim();
    if (location) updateData.location = location.trim();
    if (date) updateData.date = new Date(date);
    if (description) updateData.description = description.trim();
    if (image) updateData.image = image;
    if (removeImage) updateData.image = '';
    if (typeof isActive === 'boolean') updateData.isActive = isActive;
    if (typeof order === 'number') updateData.order = order;

    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!updatedGallery) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: updatedGallery,
    });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
      { status: 500 }
    );
  }
}

// DELETE: Delete gallery item
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const deletedGallery = await Gallery.findByIdAndDelete(id);

    if (!deletedGallery) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}
