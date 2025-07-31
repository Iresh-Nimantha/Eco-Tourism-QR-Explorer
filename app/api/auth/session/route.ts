// src/app/api/admin/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/auth/utils';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, error: 'No token found' }, { status: 401 });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 });
  }

  return NextResponse.json({ success: true, user: { email: payload.email } });
}
