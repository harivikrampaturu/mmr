/* import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(request) {
  const { username, password } = await request.json();
  await dbConnect();

  const adminUser = await User.findOne({ username, password });

  if (adminUser) {
    return new Response(null, { status: 200 });
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
}
 */

// /app/api/login/route.js

import { signInWithEmailAndPassword } from 'firebase/auth';
import { serialize } from 'cookie';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase'; // Import the auth instance

export async function POST(request) {
  const { email, password } = await request.json();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const token = await userCredential.user.getIdToken();

    // Set the token in an HTTP-only cookie
    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'Strict',
      path: '/'
    });

    const response = NextResponse.json({ success: true, token });
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }
}
