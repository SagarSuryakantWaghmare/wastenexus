import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import WorkerTask from '@/models/WorkerTask';
import WorkerApplication from '@/models/WorkerApplication';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();
    const adminUser = await User.findById(decoded.userId);

    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = await params;

    // First, check if the id corresponds to a WorkerApplication (application id)
    const application = await WorkerApplication.findById(id as string);
    if (application) {
      await WorkerApplication.findByIdAndDelete(id as string);
      return NextResponse.json({ success: true, message: 'Worker application deleted successfully' });
    }

    // Otherwise, assume it's a User id. Remove any worker tasks and applications linked to this user, then delete the user.
    await WorkerTask.deleteMany({ workerId: id });
    await WorkerApplication.deleteMany({ userId: id });

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ error: 'Worker not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Worker deleted successfully' });
  } catch (error) {
    console.error('Error deleting worker:', error);
    return NextResponse.json({ error: 'Failed to delete worker' }, { status: 500 });
  }
}
