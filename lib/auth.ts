/**
 * Authentication utilities
 * Handles password hashing, token generation, and verification
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logger } from './logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Warn if using default secret
if (JWT_SECRET === 'your-jwt-secret' && process.env.NODE_ENV === 'production') {
  throw new Error('SECURITY: Default JWT_SECRET detected in production!');
}

/**
 * Hashes a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } catch (error) {
    logger.error('Password hashing failed', error);
    throw new Error('Failed to hash password');
  }
}

/**
 * Compares a plain text password with a hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    logger.error('Password comparison failed', error);
    return false;
  }
}

/**
 * Generates a JWT token for a user
 * @param userId - User's ID
 * @param role - User's role
 * @returns JWT token
 */
export function generateToken(userId: string, role: string): string {
  try {
    return jwt.sign(
      { userId, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  } catch (error) {
    logger.error('Token generation failed', error);
    throw new Error('Failed to generate token');
  }
}

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.debug('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.debug('Invalid token');
    } else {
      logger.error('Token verification failed', error);
    }
    return null;
  }
}
