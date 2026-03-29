import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    // 🔥 Debug هنا
    console.log('entered:', password);
    console.log('env:', adminPassword);
    console.log('equal:', password === adminPassword);

    // ✅ الحل النهائي
    if (password.trim() === adminPassword?.trim()) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}