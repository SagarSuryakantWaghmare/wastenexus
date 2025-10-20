import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WorkerApplication from '@/models/WorkerApplication';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const locationCoordinatesStr = formData.get('locationCoordinates') as string;
    const photoFile = formData.get('photo') as File;
    const aadhaarFile = formData.get('aadhaarCard') as File;

    // Validate required fields
    if (!name || !email || !phone || !address) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!photoFile || !aadhaarFile) {
      return NextResponse.json(
        { error: 'Photo and Aadhaar card are required' },
        { status: 400 }
      );
    }

    // Check if application already exists
    const existingApplication = await WorkerApplication.findOne({ email });
    if (existingApplication) {
      return NextResponse.json(
        { error: 'An application with this email already exists' },
        { status: 400 }
      );
    }

    // Parse location coordinates
    let locationCoordinates;
    try {
      locationCoordinates = JSON.parse(locationCoordinatesStr);
    } catch {
      locationCoordinates = { lat: 0, lng: 0 };
    }

    // Upload photo to Cloudinary
    const photoBuffer = Buffer.from(await photoFile.arrayBuffer());
    const photoBase64 = photoBuffer.toString('base64');
    const photoDataURI = `data:${photoFile.type};base64,${photoBase64}`;

    const photoUpload = await cloudinary.uploader.upload(photoDataURI, {
      folder: 'wastenexus/worker-photos',
      resource_type: 'image',
    });

    // Upload Aadhaar card to Cloudinary
    const aadhaarBuffer = Buffer.from(await aadhaarFile.arrayBuffer());
    const aadhaarBase64 = aadhaarBuffer.toString('base64');
    const aadhaarDataURI = `data:${aadhaarFile.type};base64,${aadhaarBase64}`;

    const aadhaarUpload = await cloudinary.uploader.upload(aadhaarDataURI, {
      folder: 'wastenexus/worker-aadhaar',
      resource_type: 'image',
    });

    // Create worker application
    const workerApplication = await WorkerApplication.create({
      name,
      email,
      phone,
      address,
      locationCoordinates,
      photo: {
        public_id: photoUpload.public_id,
        secure_url: photoUpload.secure_url,
      },
      aadhaarCard: {
        public_id: aadhaarUpload.public_id,
        secure_url: aadhaarUpload.secure_url,
      },
      status: 'pending',
    });

    return NextResponse.json(
      {
        message: 'Application submitted successfully',
        application: {
          id: workerApplication._id,
          name: workerApplication.name,
          email: workerApplication.email,
          status: workerApplication.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting worker application:', error);
    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
