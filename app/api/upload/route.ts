import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ensureDirectoryExists, isAllowedFileType, getFileExtension } from '@/lib/file-utils';

// Define allowed file types for each upload type
const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  event: ['pdf', 'docx', 'xlsx', 'jpg', 'jpeg', 'png'],
  recent: ['pdf', 'docx', 'xlsx']
};

// Define required roles for each upload type
const REQUIRED_ROLES: Record<string, string[]> = {
  event: ['admin', 'event_manager'],
  recent: ['admin', 'content_manager']
};

type UploadType = 'event' | 'recent';

interface UploadedFile {
  id: string;
  name: string;
  type: UploadType;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
  path: string;
}

export async function POST(request: Request) {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const uploadType = formData.get('type') as UploadType;

    if (!files || files.length === 0) {
      return new NextResponse('No files uploaded', { status: 400 });
    }

    if (!['event', 'recent'].includes(uploadType)) {
      return new NextResponse('Invalid upload type', { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', uploadType);
    await mkdir(uploadDir, { recursive: true });

    const uploadedFiles: UploadedFile[] = [];

    // Process each file
    for (const file of files) {
      const fileBuffer = await (file as unknown as Blob).arrayBuffer();
      const buffer = Buffer.from(fileBuffer);
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = join(uploadDir, fileName);
      const publicPath = `/uploads/${uploadType}/${fileName}`;

      // Save file to disk
      await writeFile(filePath, buffer);

      // Add to uploaded files array
      uploadedFiles.push({
        id: uuidv4(),
        name: file.name,
        type: uploadType,
        size: file.size,
        uploadedAt: new Date(),
        uploadedBy: session.user.email,
        path: publicPath
      });
    }

    // TODO: Save file metadata to database (Prisma example)
    // await prisma.file.createMany({
    //   data: uploadedFiles.map(file => ({
    //     id: file.id,
    //     name: file.name,
    //     type: file.type,
    //     size: file.size,
    //     path: file.path,
    //     uploadedBy: file.uploadedBy,
    //   })),
    // });

    return NextResponse.json({ 
      success: true, 
      message: 'Files uploaded successfully',
      uploadedFiles 
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function GET() {
  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // TODO: Fetch files from database (Prisma example)
    // const files = await prisma.file.findMany({
    //   where: { 
    //     OR: [
    //       { type: 'event' },
    //       { type: 'recent' }
    //     ]
    //   },
    //   orderBy: { uploadedAt: 'desc' },
    //   take: 50
    // });

    // For now, return empty array
    return NextResponse.json({ files: [] });

  } catch (error) {
    console.error('Error fetching files:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
