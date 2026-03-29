// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
    }

    if (!status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }

    await kv.hset(`order:${id}`, {
      status,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'حدث خطأ' }, { status: 500 });
  }
}