import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db/index';
import RewardItem from '@/lib/db/models/RewardItem';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    const rewards = await RewardItem.find({ isActive: true })
      .sort({ pointsCost: 1 });

    return NextResponse.json({ rewards });
  } catch (error: any) {
    console.error('Get rewards error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
