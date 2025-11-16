import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { successResponse, ErrorResponses, checkRateLimit } from '@/lib/api-response';
import { isValidEmail, isValidPassword, isValidRole, sanitizeString } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(`signup:${clientIp}`, 5, 3600000); // 5 requests per hour
    
    if (!rateLimit.allowed) {
      return ErrorResponses.badRequest('Too many signup attempts. Please try again later.');
    }

    await dbConnect();

    const body = await request.json();
    const { name, email, password, role } = body;

    // Comprehensive validation
    if (!name || !email || !password || !role) {
      return ErrorResponses.badRequest('All fields are required');
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return ErrorResponses.badRequest('Invalid email format');
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return ErrorResponses.badRequest(
        'Password must be at least 8 characters and contain both letters and numbers'
      );
    }

    // Validate role
    if (!isValidRole(role)) {
      return ErrorResponses.badRequest('Invalid role. Must be client, champion, or worker');
    }

    // Sanitize inputs
    const sanitizedName = sanitizeString(name);
    const sanitizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: sanitizedEmail });
    if (existingUser) {
      logger.warn('Signup attempt with existing email', { email: sanitizedEmail });
      return ErrorResponses.conflict('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name: sanitizedName,
      email: sanitizedEmail,
      password: hashedPassword,
      role,
    });

    logger.info('User created successfully', { 
      userId: user._id.toString(), 
      email: sanitizedEmail, 
      role 
    });

    // Return user without password
    return successResponse(
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage || '',
          totalPoints: user.totalPoints,
        },
      },
      'User created successfully',
      201
    );
  } catch (error) {
    logger.error('Signup error', error);
    return ErrorResponses.internalError('Failed to create user');
  }
}
