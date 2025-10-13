import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadBase64Image } from '@/lib/services/cloudinary';

// Log function with timestamp
const log = (...args: any[]) => {
  console.log(`[${new Date().toISOString()}]`, ...args);
};

// Error response helper
const errorResponse = (message: string, status: number, details?: any) => {
  log(`[ERROR] ${message}`, details || '');
  return NextResponse.json(
    { 
      success: false, 
      error: message,
      ...(process.env.NODE_ENV === 'development' && { details })
    },
    { status }
  );
};

// Set the maximum duration for this API route
export const maxDuration = 300; // 5 minutes

// Helper function to validate the request body
function validateReportData(data: any) {
  const { address, image } = data;
  const errors: string[] = [];

  if (!address || typeof address !== 'string' || address.trim().length < 5) {
    errors.push('A valid address is required');
  }

  if (!image || typeof image !== 'string') {
    errors.push('A valid image is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function POST(req: Request) {
  log('🔵 New report submission request received');
  
  try {
    // Validate user session first
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      log('❌ Unauthorized: No valid user session');
      return errorResponse('Unauthorized', 401);
    }
    
    const userId = session.user.id;
    
    // Parse request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return errorResponse('Invalid JSON in request body', 400);
    }
    
    // Validate required fields
    const { isValid, errors } = validateReportData(body);
    if (!isValid) {
      return errorResponse('Validation failed', 400, { errors });
    }
    
    const { 
      address, 
      image, 
      wasteType = 'unknown', 
      isRecyclable = false, 
      quantity = 1, 
      recyclability = 0,
      location 
    } = body;
    
    log(`📝 Processing report for user ${userId} at ${address.substring(0, 30)}...`);
    const startTime = Date.now();
    
    try {
      // Upload image to Cloudinary
      log('☁️ Starting image upload to Cloudinary...');
      const uploadStart = Date.now();
      
      const imageUrl = await uploadBase64Image(
        image,
        `report-${userId}-${Date.now()}.jpg`,
        { 
          folder: 'wastenexus/reports',
          context: {
            userId: userId.toString(),
            source: 'waste-report',
            timestamp: new Date().toISOString()
          }
        }
      );
      
      const uploadTime = Date.now() - uploadStart;
      log(`✅ Image uploaded to Cloudinary in ${uploadTime}ms`);
      log(`   - URL: ${imageUrl.split('/').slice(0, -1).join('/')}/...`);
      log(`   - Size: ${Math.ceil(Buffer.from(image, 'base64').length / 1024)} KB`);
      
      // Prepare report data
      const reportData = {
        userId,
        imageUrl,
        address: address.trim(),
        wasteType: wasteType || 'unknown',
        isRecyclable: Boolean(isRecyclable),
        quantity: Math.max(1, Math.min(100, Number(quantity) || 1)),
        recyclability: Math.min(100, Math.max(0, Number(recyclability) || 0)),
        location: location || {
          type: 'Point',
          coordinates: [0, 0]
        },
        metadata: {
          source: 'web',
          timestamp: new Date().toISOString()
        }
      };
      
      log('✅ Report processed successfully', {
        userId: reportData.userId,
        wasteType: reportData.wasteType,
        isRecyclable: reportData.isRecyclable,
        quantity: reportData.quantity,
        recyclability: reportData.recyclability,
        location: reportData.location,
        imageUrl: '[REDACTED]'
      });
      
      return NextResponse.json({ 
        success: true,
        message: 'Report processed successfully!',
        timestamp: new Date().toISOString(),
        metadata: {
          processTime: Date.now() - startTime,
          imageUploaded: true,
          coordinates: reportData.location?.coordinates || null
        }
      });
      
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorDetails = error instanceof Error ? {
        name: error.name,
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      } : error;
      
      log(`❌ Error processing report: ${errorMessage}`, errorDetails);
      
      return errorResponse(
        'Failed to process report',
        500,
        process.env.NODE_ENV === 'development' ? errorDetails : undefined
      );
    }
    
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log(`❌ Unexpected error: ${errorMessage}`, error);
    return errorResponse('Internal server error', 500);
  }
}
