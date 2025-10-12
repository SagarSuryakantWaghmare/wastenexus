// All the api related code is in utils/db/action.ts
import { dbConnect } from './db/index';
import User from './db/models/User';
import Notification from './db/models/Notification';
import Transaction from './db/models/Transaction';
import Report from './db/models/Report';
import Reward from './db/models/Reward';

export async function createUser(email: string, name: string) {
  await dbConnect();
  try {
    let user = await User.findOne({ email });
    if (user) return user;
    user = await User.create({
      email,
      name,
      clerkId: '', // Set Clerk ID if available
      role: 'user',
      points: 0,
    });
    return user;
  } catch (error) {
    console.error('Error creating user', error);
    return null;
  }
}

export async function getUserByEmail(email: string) {
  await dbConnect();
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    console.error('Error fetching user by email', error);
    return null;
  }
}

// TODO: Implement getUnreadNotifications
export async function getUnreadNotifications(userId: string) {
  // Implement logic using Notification model
  return null;
}

// TODO: Implement getUserBalance
export async function getUserBalance(userId: string): Promise<number> {
  // Implement logic using Transaction model
  return 0;
}

// TODO: Implement getRewardTransactions
export async function getRewardTransactions(userId: string) {
  // Implement logic using Transaction model
  return null;
}

// TODO: Implement markNotificationAsRead
export async function markNotificationAsRead(notificationId: string) {
  // Implement logic using Notification model
  return;
}

export async function createReport({
  userId,
  location,
  wasteType,
  amount,
  imageUrl,
  verificationResults
}: {
  userId: string;
  location: { address: string; latitude: number; longitude: number };
  wasteType: string;
  amount: string;
  imageUrl?: string;
  verificationResults?: any;
}) {
  await dbConnect();
  try {
    // Create the report with Google Maps location
    const report = await Report.create({
      userId,
      location,
      wasteType,
      amount,
      imageUrl,
      verificationResults,
      status: 'pending',
    });

    // AI verification placeholder (replace with actual AI logic)
    // If you have an AI service, call it here and update verificationResults/status

    // Award points for reporting
    const pointsEarned = 10;
    await Reward.create({
      userId,
      name: 'Report Reward',
      collectionInfo: 'Points earned from reporting waste',
      points: pointsEarned,
      level: 1,
      isAvailable: true,
    });

    await Transaction.create({
      userId,
      type: 'earned_report',
      amount: pointsEarned,
      description: 'Points earned for reporting',
    });

    await Notification.create({
      userId,
      message: `You have earned ${pointsEarned} points for reporting waste!`,
      type: 'reward',
    });

    return report;
  } catch (error) {
    console.error('Error creating report', error);
    throw error;
  }
// Removed orphaned and invalid code blocks after createReport

  // TODO: Refactor to Mongoose logic
    await dbConnect();
    try {
      const reports = await Report.find().sort({ createdAt: -1 }).limit(limit);
      return reports;
    } catch (error) {
      console.error('Error fetching recent reports', error);
      return [];
    }
}

// Removed remaining orphaned code blocks at end of file