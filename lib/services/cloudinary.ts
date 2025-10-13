interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

interface UploadOptions {
  folder?: string;
  public_id?: string;
  tags?: string[];
  context?: Record<string, string>;
  upload_preset?: string;
}

/**
 * Uploads a file or buffer to Cloudinary
 * @param file - File object or buffer with metadata
 * @param options - Additional upload options
 * @returns Promise that resolves to the secure URL of the uploaded file
 */
export async function uploadToCloudinary(
  file: File | { buffer: Buffer; name: string; type: string },
  options: UploadOptions = {}
): Promise<string> {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'wastenexus';
  
  if (!CLOUD_NAME) {
    throw new Error('Cloudinary cloud name is not configured. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME');
  }

  if (!UPLOAD_PRESET) {
    console.warn('No Cloudinary upload preset provided. Using default.');
  }

  try {
    const formData = new FormData();
    
    // Handle both File and buffer objects
    if (file instanceof File) {
      formData.append('file', file);
    } else {
      // Create a Blob from buffer for server-side uploads
      const blob = new Blob([file.buffer], { type: file.type });
      formData.append('file', new File([blob], file.name, { type: file.type }));
    }

    // Set default options
    const uploadOptions: UploadOptions = {
      folder: 'wastenexus/reports',
      upload_preset: UPLOAD_PRESET,
      ...options
    };

    // Append all options to form data
    Object.entries(uploadOptions).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      let errorMessage = `Cloudinary upload failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage += `: ${errorData.error?.message || JSON.stringify(errorData)}`;
      } catch (e) {
        const text = await response.text();
        errorMessage += `: ${text}`;
      }
      console.error('❌ Cloudinary upload failed:', errorMessage);
      throw new Error(errorMessage);
    }

    const data: CloudinaryResponse = await response.json();
    console.log(`✅ Uploaded to Cloudinary: ${data.public_id} (${(data.bytes / 1024).toFixed(2)} KB)`);
    return data.secure_url;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw new Error(
      `Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Uploads a base64 encoded image to Cloudinary
 * @param base64Data - Base64 encoded image data (with or without data URL prefix)
 * @param fileName - Optional custom file name (defaults to timestamped name)
 * @param options - Additional upload options
 * @returns Promise that resolves to the secure URL of the uploaded file
 */
export async function uploadBase64Image(
  base64Data: string, 
  fileName: string = `img-${Date.now()}.jpg`,
  options: Omit<UploadOptions, 'public_id'> = {}
): Promise<string> {
  try {
    if (!base64Data) {
      throw new Error('No image data provided');
    }

    // Remove data URL prefix if present
    const base64String = base64Data.includes('base64,') 
      ? base64Data.split('base64,')[1] 
      : base64Data;
    
    // Validate base64 string
    if (!/^[A-Za-z0-9+/=]+$/.test(base64String)) {
      throw new Error('Invalid base64 image data');
    }

    const buffer = Buffer.from(base64String, 'base64');
    
    // Validate buffer size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (buffer.length > maxSize) {
      throw new Error(`Image size (${(buffer.length / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed size (10MB)`);
    }

    // Extract file extension from filename or default to jpg
    const fileExt = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const mimeType = `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;

    return await uploadToCloudinary(
      {
        buffer,
        name: fileName,
        type: mimeType
      },
      {
        ...options,
        // Set public_id from filename (without extension)
        public_id: fileName.split('.')[0]
      }
    );
  } catch (error) {
    console.error('❌ Error processing base64 image:', error);
    throw new Error(
      `Failed to process base64 image: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Generates a Cloudinary URL with optional transformations
 * @param publicId - The public ID of the image
 * @param transformations - Optional transformation string (e.g., 'w_500,h_500,c_fill')
 * @param format - Optional output format (jpg, png, webp, etc.)
 * @param quality - Optional quality parameter (1-100)
 * @returns Complete Cloudinary URL
 */
export function getCloudinaryUrl(
  publicId: string, 
  transformations?: string,
  format?: string,
  quality?: number
): string {
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!CLOUD_NAME) {
    throw new Error('Cloudinary cloud name is not configured');
  }

  if (!publicId) {
    throw new Error('Public ID is required');
  }

  const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  let url = baseUrl;
  
  // Add transformations if provided
  if (transformations) {
    url += `/${transformations}`;
    
    // Add quality if provided
    if (quality && quality > 0 && quality <= 100) {
      url += `,q_${Math.round(quality)}`;
    }
    
    // Add format if provided
    if (format) {
      url += `/${format}`;
    }
  }
  
  // Add public ID and ensure it doesn't start with a slash
  url += `/${publicId.replace(/^\/+/, '')}`;
  
  return url;
}

export async function fileToBase64(file: File | Blob): Promise<string> {
  if (!file) {
    throw new Error('No file provided');
  }

  // Check file size (max 10MB)
  if ('size' in file && file.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds 10MB limit');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        if (typeof reader.result !== 'string') {
          throw new Error('Failed to read file as data URL');
        }
        
        // Validate the result is a valid data URL
        if (!reader.result.startsWith('data:')) {
          throw new Error('Invalid data URL format');
        }
        
        resolve(reader.result);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error('FileReader error:', error);
      reject(new Error(`Failed to read file: ${error?.toString() || 'Unknown error'}`));
    };
    
    reader.onabort = () => {
      reject(new Error('File reading was aborted'));
    };
    
    try {
      reader.readAsDataURL(file);
    } catch (error) {
      reject(new Error(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
