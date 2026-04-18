// app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📊 Track event:', body);
    
    // هنا تقدر تخزن البيانات في Google Analytics أو أي خدمة تانية
    // حالياً بنرجع success بس
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking:', error);
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
  }
}