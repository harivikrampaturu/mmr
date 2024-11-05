// /app/api/logout/route.js

import { serialize } from 'cookie';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookie = serialize('token', '', {
    httpOnly: true,
    secure: true,
    maxAge: -1, // Expire immediately
    sameSite: 'Strict',
    path: '/'
  });

  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', cookie);
  return response;
}
