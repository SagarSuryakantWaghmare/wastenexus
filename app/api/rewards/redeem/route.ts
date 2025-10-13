import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/index';
import RewardRedemption from '@/lib/db/models/RewardRedemption';
import RewardItem from '@/lib/db/models/RewardItem';
import User from '@/lib/db/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { userId, rewardItemId } = await req.json();

    const [user, reward] = await Promise.all([
      User.findById(userId),
      RewardItem.findById(rewardItemId),
    ]);

    if (!user || !reward) {
      return NextResponse.json({ error: 'User or reward not found' }, { status: 404 });
    }

    if (user.points < reward.pointsCost) {
      return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
    }

    if (reward.stock === 0) {
      return NextResponse.json({ error: 'Out of stock' }, { status: 400 });
    }

    // Create redemption
    const redemptionCode = `WN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const redemption = new RewardRedemption({
      userId,
      rewardItemId,
      pointsSpent: reward.pointsCost,
      redemptionCode,
      status: 'approved',
    });

    await redemption.save();

    // Deduct points
    await User.findByIdAndUpdate(userId, { $inc: { points: -reward.pointsCost } });

    // Update stock if limited
    if (reward.stock > 0) {
      await RewardItem.findByIdAndUpdate(rewardItemId, { $inc: { stock: -1 } });
    }

    return NextResponse.json({ success: true, redemption, redemptionCode });
  } catch (error: any) {
    console.error('Redeem reward error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
