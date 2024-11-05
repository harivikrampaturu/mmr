// lib/middleware.js
import admin from '@/lib/firebaseAdmin';

export async function authenticate(req) {
  const token = req.headers
    .get('cookie')
    ?.split('; ')
    .find((cookie) => cookie.startsWith('token='))
    ?.split('=')[1];

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: No token provided' }),
      { status: 401 }
    );
  }

  try {
    // Verify the token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken; // Return the decoded token
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized: Invalid token' }),
      { status: 401 }
    );
  }
}
