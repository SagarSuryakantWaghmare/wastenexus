import User from '@/models/User';
import Transaction from '@/models/Transaction';
import { Types } from 'mongoose';

/**
 * Reward configuration based on activity type
 * These values should match what's displayed on the rewards page
 */
export const REWARD_CONFIG = {
  // Report verification rewards (10 points per kg base)
  REPORT_VERIFIED: {
    BASE_POINTS_PER_KG: 10,
    WASTE_TYPE_MULTIPLIERS: {
      'e-waste': 5.0,      // 50 points per kg
      'plastic': 1.5,      // 15 points per kg
      'metal': 2.0,        // 20 points per kg
      'glass': 1.2,        // 12 points per kg
      'cardboard': 1.0,    // 10 points per kg
      'paper': 1.0,        // 10 points per kg
      'organic': 0.8,      // 8 points per kg
    },
    MIN_POINTS: 5,
    MAX_POINTS: 500,
  },
  
  // Job verification rewards
  JOB_VERIFIED: {
    BASE_POINTS: 25,
    CATEGORY_BONUS: {
      'industry': 10,  // +10 bonus for industrial jobs
      'home': 5,       // +5 bonus for home jobs
      'other': 0,
    },
    URGENCY_BONUS: {
      'high': 10,
      'medium': 5,
      'low': 0,
    },
  },
  
  // Marketplace item approval rewards
  MARKETPLACE_APPROVED: {
    BASE_POINTS: 30,
  },
  
  // Worker task completion rewards
  TASK_COMPLETED: {
    BASE_POINTS: 20,
  },
  
  // Event participation rewards
  EVENT_PARTICIPATION: {
    BASE_POINTS: 15,
  },
};

/**
 * Calculate points for a verified report
 */
export function calculateReportPoints(weightKg: number, wasteType: string): number {
  const config = REWARD_CONFIG.REPORT_VERIFIED;
  const multiplier = config.WASTE_TYPE_MULTIPLIERS[wasteType as keyof typeof config.WASTE_TYPE_MULTIPLIERS] || 1.0;
  const points = Math.floor(weightKg * config.BASE_POINTS_PER_KG * multiplier);
  
  // Apply min/max constraints
  return Math.max(config.MIN_POINTS, Math.min(points, config.MAX_POINTS));
}

/**
 * Calculate points for a verified job
 */
export function calculateJobPoints(category: string, urgency?: string): number {
  const config = REWARD_CONFIG.JOB_VERIFIED;
  const categoryBonus = config.CATEGORY_BONUS[category as keyof typeof config.CATEGORY_BONUS] || 0;
  const urgencyBonus = urgency ? (config.URGENCY_BONUS[urgency as keyof typeof config.URGENCY_BONUS] || 0) : 0;
  
  return config.BASE_POINTS + categoryBonus + urgencyBonus;
}

/**
 * Award points to a user and create a transaction record
 */
export interface AwardPointsParams {
  userId: string | Types.ObjectId;
  type: 'report_verified' | 'job_verified' | 'marketplace_approved' | 'task_completed' | 'event_participation' | 'manual_adjustment';
  amount: number;
  description: string;
  referenceId?: string | Types.ObjectId;
  referenceModel?: string;
  adminId?: string | Types.ObjectId;
  metadata?: Record<string, unknown>;
}

export async function awardPoints(params: AwardPointsParams) {
  const { userId, type, amount, description, referenceId, referenceModel, adminId, metadata } = params;
  
  try {
    // Update user's total points
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalPoints: amount } },
      { new: true }
    );
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Create transaction record
    const transaction = await Transaction.create({
      userId,
      type,
      amount,
      description,
      referenceId,
      referenceModel,
      adminId,
      metadata: {
        ...metadata,
        previousTotal: user.totalPoints - amount,
        newTotal: user.totalPoints,
      },
    });
    
    return {
      success: true,
      transaction,
      user,
      pointsAwarded: amount,
      newTotalPoints: user.totalPoints,
    };
  } catch (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
}

/**
 * Get user's transaction history
 */
export async function getUserTransactions(userId: string | Types.ObjectId, limit = 50) {
  try {
    const transactions = await Transaction.find({ userId })
      .populate('adminId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    return transactions;
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
}

/**
 * Get transaction statistics
 */
export async function getTransactionStats(userId?: string | Types.ObjectId) {
  try {
    const query = userId ? { userId } : {};
    
    const stats = await Transaction.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          avgAmount: { $avg: '$amount' },
        },
      },
    ]);
    
    return stats;
  } catch (error) {
    console.error('Error fetching transaction stats:', error);
    throw error;
  }
}
