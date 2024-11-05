// pages/api/auth/status.js
import { verifyIdToken } from '@/lib/authMiddleware';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    await verifyIdToken(token);
    return NextResponse.json({ authenticated: true });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
