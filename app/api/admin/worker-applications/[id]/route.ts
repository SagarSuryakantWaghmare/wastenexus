import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import WorkerApplication from '@/models/WorkerApplication';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { sendEmail, getWorkerVerificationEmail, getWorkerRejectionEmail } from '@/lib/email';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const application = await WorkerApplication.findById(id);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error('Error fetching worker application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const { action, rejectionReason } = await req.json();

    const application = await WorkerApplication.findById(id);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.status !== 'pending') {
      return NextResponse.json(
        { error: 'Application has already been processed' },
        { status: 400 }
      );
    }

    if (action === 'verify') {
      // Create user account for the worker
      const existingUser = await User.findOne({ email: application.email });
      if (existingUser) {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 400 }
        );
      }

      // Generate a temporary password (worker should change it on first login)
      const tempPassword = `Worker@${Math.random().toString(36).slice(-8)}`;
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      const newUser = await User.create({
        name: application.name,
        email: application.email,
        password: hashedPassword,
        role: 'worker',
        profileImage: application.photo?.secure_url,
      });

      // Update application status
      application.status = 'verified';
      application.verifiedAt = new Date();
      application.verifiedBy = decoded.userId;
      application.userId = newUser._id;
      await application.save();

      // Send email to worker with login credentials
      try {
        await sendEmail({
          to: application.email,
          subject: '🎉 Your WasteNexus Worker Application Has Been Approved!',
          html: getWorkerVerificationEmail(application.name, application.email, tempPassword),
        });
        console.log(`✅ Verification email sent to ${application.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send verification email:', emailError);
        // Don't fail the whole operation if email fails
      }

      return NextResponse.json({
        message: 'Application verified, worker account created, and email sent successfully',
        user: {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } else if (action === 'reject') {
      if (!rejectionReason) {
        return NextResponse.json(
          { error: 'Rejection reason is required' },
          { status: 400 }
        );
      }

      application.status = 'rejected';
      application.rejectionReason = rejectionReason;
      await application.save();

      // Send rejection email to applicant
      try {
        await sendEmail({
          to: application.email,
          subject: 'WasteNexus Worker Application Status Update',
          html: getWorkerRejectionEmail(application.name, rejectionReason),
        });
        console.log(`✅ Rejection email sent to ${application.email}`);
      } catch (emailError) {
        console.error('❌ Failed to send rejection email:', emailError);
        // Don't fail the whole operation if email fails
      }

      return NextResponse.json({ 
        message: 'Application rejected and email notification sent',
        status: 'rejected',
      });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error processing worker application:', error);
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}
