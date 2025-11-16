/**
 * Standardized API response utilities
 * Provides consistent response format across all API routes
 */

import { NextResponse } from 'next/server';
import { logger } from './logger';

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Creates a successful API response
 */
export function successResponse<T>(
  data: T,
  message?: string,
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

/**
 * Creates an error API response
 */
export function errorResponse(
  message: string,
  status: number = 500,
  code?: string,
  details?: unknown
): NextResponse<ApiErrorResponse> {
  // Don't expose internal error details in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details: isProduction ? undefined : details,
      },
    },
    { status }
  );
}

/**
 * Common error responses
 */
export const ErrorResponses = {
  unauthorized: (message = 'Authentication required') =>
    errorResponse(message, 401, 'UNAUTHORIZED'),
  
  forbidden: (message = 'Access forbidden') =>
    errorResponse(message, 403, 'FORBIDDEN'),
  
  notFound: (resource = 'Resource') =>
    errorResponse(`${resource} not found`, 404, 'NOT_FOUND'),
  
  badRequest: (message = 'Invalid request') =>
    errorResponse(message, 400, 'BAD_REQUEST'),
  
  conflict: (message = 'Resource already exists') =>
    errorResponse(message, 409, 'CONFLICT'),
  
  internalError: (message = 'Internal server error') =>
    errorResponse(message, 500, 'INTERNAL_ERROR'),
  
  validationError: (details: unknown) =>
    errorResponse('Validation failed', 422, 'VALIDATION_ERROR', details),
};

/**
 * Wraps an API handler with error handling
 */
export function withErrorHandler<T>(
  handler: () => Promise<NextResponse<T>>
): Promise<NextResponse<T | ApiErrorResponse>> {
  return handler().catch((error: Error | unknown) => {
    logger.error('API handler error', error);
    
    // Handle known error types
    if (error instanceof Error) {
      if (error.message.includes('authentication')) {
        return ErrorResponses.unauthorized();
      }
      if (error.message.includes('not found')) {
        return ErrorResponses.notFound();
      }
      if (error.message.includes('validation')) {
        return ErrorResponses.badRequest(error.message);
      }
    }
    
    return ErrorResponses.internalError();
  });
}

/**
 * Rate limiting check (simple in-memory implementation)
 * For production, consider using Redis or a proper rate limiting service
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Clean up old entries periodically
  if (Math.random() < 0.01) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetAt < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || record.resetAt < now) {
    // Create new record
    const resetAt = now + windowMs;
    rateLimitMap.set(identifier, { count: 1, resetAt });
    return { allowed: true, remaining: maxRequests - 1, resetAt };
  }

  // Check if limit exceeded
  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: record.resetAt };
  }

  // Increment count
  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetAt: record.resetAt,
  };
}
