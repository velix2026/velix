import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();
    await kv.hset(`order:${id}`, { 
      status, 
      updatedAt: new Date().toISOString() 
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}