import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/admin-auth';
import Redis from 'ioredis';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const redis = new Redis(process.env.REDIS_URL!);
const COUNTDOWN_KEY = 'velix_countdown';

export async function POST(request: NextRequest) {
  if (!(await checkAdminAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { targetDate } = await request.json();
    if (!targetDate) {
      return NextResponse.json({ error: 'targetDate is required' }, { status: 400 });
    }
    const d = new Date(targetDate);
    if (isNaN(d.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }
    await redis.set(COUNTDOWN_KEY, targetDate);
    return NextResponse.json({ success: true, targetDate });
  } catch (error) {
    console.error('Error setting countdown:', error);
    return NextResponse.json({ error: 'Failed to set countdown' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const targetDate = await redis.get(COUNTDOWN_KEY);
    return NextResponse.json({ targetDate: targetDate || null });
  } catch (error) {
    console.error('Error getting countdown:', error);
    return NextResponse.json({ targetDate: null });
  }
}
