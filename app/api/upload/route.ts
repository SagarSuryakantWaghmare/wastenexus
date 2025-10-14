import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { cookies } from 'next/headers';
import { ensureDirectoryExists, isAllowedFileType, getFileExtension } from '@/lib/file-utils';

// Define allowed file types for each upload type
const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  event: ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'jpg', 'jpeg', 'png', 'gif'],
  recent: ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'jpg', 'jpeg', 'png']
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

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export async function POST(request: Request) {
  try {
    // Check if user is authenticated via cookie
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');
    
    if (!userSession?.value) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userData = JSON.parse(userSession.value);
    const formData = await request.formData();
    const files = formData.getAll('files') as unknown as File[];
    const uploadType = formData.get('type') as UploadType;

    // Validate upload type
    if (!['event', 'recent'].includes(uploadType)) {
      return new NextResponse('Invalid upload type', { status: 400 });
    }

    if (!files || files.length === 0) {
      return new NextResponse('No files uploaded', { status: 400 });
    }

    // Validate file types
    const invalidFiles = files.filter(
      file => !isAllowedFileType(file.name, ALLOWED_FILE_TYPES[uploadType])
    );

    if (invalidFiles.length > 0) {
      return new NextResponse(
        `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES[uploadType].join(', ')}`,
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', uploadType);
    await ensureDirectoryExists(uploadDir);

    const uploadedFiles: UploadedFile[] = [];
    const uploadErrors: string[] = [];

    // Process each file
    for (const file of files) {
      try {
        const fileBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(fileBuffer);
        
        // Generate unique filename with original extension
        const fileExt = getFileExtension(file.name);
        if (!fileExt) {
          uploadErrors.push(`File ${file.name} has no extension`);
          continue;
        }
        
        const fileName = `${generateId()}.${fileExt}`;
        const filePath = join(uploadDir, fileName);
        const publicPath = `/uploads/${uploadType}/${fileName}`;

        // Save file to disk
        await writeFile(filePath, buffer);

        // Add to uploaded files array
        uploadedFiles.push({
          id: generateId(),
          name: file.name,
          type: uploadType,
          size: file.size,
          uploadedAt: new Date(),
          uploadedBy: userData.email || userData.username,
          path: publicPath
        });
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        uploadErrors.push(`Failed to process ${file.name}`);
      }
    }

    if (uploadedFiles.length === 0 && uploadErrors.length > 0) {
      return new NextResponse(
        `Failed to upload files: ${uploadErrors.join(', ')}`,
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `${uploadedFiles.length} file(s) uploaded successfully`,
      uploadedFiles,
      errors: uploadErrors.length > 0 ? uploadErrors : undefined
    });

  } catch (error) {
    console.error('Error uploading files:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

export async function GET() {
  try {
    // Check if user is authenticated
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');
    
    if (!userSession?.value) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Return empty array for now (can be connected to database later)
    return NextResponse.json({ files: [] });

  } catch (error) {
    console.error('Error fetching files:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
