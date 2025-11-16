/**
 * Environment variable validation
 * Ensures all required environment variables are set at startup
 */

interface EnvironmentConfig {
  MONGODB_URI: string;
  JWT_SECRET: string;
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
  NODE_ENV: 'development' | 'production' | 'test';
  
  // Optional but recommended
  GEMINI_API_KEY?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?: string;
  EMAIL_USER?: string;
  EMAIL_PASS?: string;
}

/**
 * Validates that all required environment variables are set
 * @throws {Error} if any required variables are missing
 */
export function validateEnvironment(): EnvironmentConfig {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }

  // Validate JWT_SECRET strength
  const jwtSecret = process.env.JWT_SECRET!;
  if (jwtSecret.length < 32) {
    console.warn(
      'WARNING: JWT_SECRET should be at least 32 characters long for security'
    );
  }

  // Check for development default values in production
  if (process.env.NODE_ENV === 'production') {
    const dangerousDefaults = [
      'your-jwt-secret',
      'your-super-secret-key',
      'change-this',
    ];

    if (dangerousDefaults.some((val) => jwtSecret.includes(val))) {
      throw new Error(
        'SECURITY ERROR: You are using a default JWT_SECRET value in production. ' +
        'Please set a strong, unique secret.'
      );
    }
  }

  return {
    MONGODB_URI: process.env.MONGODB_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
    
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
  };
}

/**
 * Checks if optional features are configured
 */
export function checkOptionalFeatures() {
  const features = {
    aiClassification: !!process.env.GEMINI_API_KEY,
    imageUpload: !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ),
    maps: !!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    email: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
  };

  const disabled = Object.entries(features)
    .filter(([, enabled]) => !enabled)
    .map(([feature]) => feature);

  if (disabled.length > 0) {
    console.info(
      `INFO: The following features are disabled due to missing configuration: ${disabled.join(', ')}`
    );
  }

  return features;
}
