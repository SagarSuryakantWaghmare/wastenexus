import { NextRequest, NextResponse } from 'next/server';
import { createReport } from '@/lib/action';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Expecting: userId, location {address, latitude, longitude}, wasteType, amount, imageUrl, verificationResults
    const report = await createReport(body);
    return NextResponse.json({ success: true, report });
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to create report' }, { status: 500 });
  }
}
