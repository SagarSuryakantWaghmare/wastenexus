import { NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import User from '@/models/User'; // Required for Mongoose populate
import { verifyToken } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { successResponse, ErrorResponses, checkRateLimit } from '@/lib/api-response';
import { validateReportInput } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Get token from header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return ErrorResponses.unauthorized();
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return ErrorResponses.unauthorized('Invalid or expired token');
    }

    // Rate limiting per user
    const rateLimit = checkRateLimit(`report:${decoded.userId}`, 20, 3600000); // 20 reports per hour
    if (!rateLimit.allowed) {
      return ErrorResponses.badRequest('Rate limit exceeded. Please try again later.');
    }

    await dbConnect();

    const body = await request.json();
    const { type, weightKg, imageUrl, aiClassification, location } = body;

    // Validate inputs using validation utility
    const validation = validateReportInput(type, weightKg);
    if (!validation.valid) {
      return ErrorResponses.validationError(validation.errors);
    }

    // Create report with validated data
    const report = await Report.create({
      userId: decoded.userId,
      type: validation.sanitized!.type,
      weightKg: validation.sanitized!.weightKg,
      status: 'pending',
      pointsAwarded: 0,
      imageUrl,
      aiClassification,
      location,
    });

    logger.info('Report submitted successfully', {
      reportId: report._id.toString(),
      userId: decoded.userId,
      type: validation.sanitized!.type,
      weightKg: validation.sanitized!.weightKg,
    });

    return successResponse(
      {
        report: {
          id: report._id,
          type: report.type,
          weightKg: report.weightKg,
          status: report.status,
          imageUrl: report.imageUrl,
          aiClassification: report.aiClassification,
          location: report.location,
          date: report.date,
        },
      },
      'Report submitted successfully',
      201
    );
  } catch (error) {
    logger.error('Report submission error', error);
    return ErrorResponses.internalError('Failed to submit report');
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from header
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return ErrorResponses.unauthorized();
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return ErrorResponses.unauthorized('Invalid or expired token');
    }

    await dbConnect();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Validate pagination
    if (page < 1 || limit < 1 || limit > 100) {
      return ErrorResponses.badRequest('Invalid pagination parameters');
    }

    // Build query based on role
    const query: Record<string, unknown> = {};
    
    if (decoded.role === 'client') {
      // Clients can only see their own reports
      query.userId = decoded.userId;
    } else if (decoded.role === 'champion' || decoded.role === 'admin') {
      // Champions and admins can see all reports or filter by userId
      if (userId) {
        query.userId = userId;
      }
    } else {
      return ErrorResponses.forbidden('Insufficient permissions');
    }

    if (status && ['pending', 'verified', 'rejected'].includes(status)) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = await Report.countDocuments(query);

    // Fetch reports
    const reports = await Report.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    logger.debug('Reports fetched', {
      userId: decoded.userId,
      role: decoded.role,
      count: reports.length,
      page,
    });

    return successResponse({
      reports: reports.map(report => ({
        id: report._id,
        user: report.userId,
        type: report.type,
        weightKg: report.weightKg,
        status: report.status,
        pointsAwarded: report.pointsAwarded,
        imageUrl: report.imageUrl,
        aiClassification: report.aiClassification,
        location: report.location,
        date: report.date,
        createdAt: report.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Fetch reports error', error);
    return ErrorResponses.internalError('Failed to fetch reports');
  }
}
