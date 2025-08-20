// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  const { pathname } = request.nextUrl;

  // Redirect to /login if user is not authenticated and trying to access /admin or its subpages
  if (pathname.startsWith('/admin') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to /admin if the user is authenticated and trying to access the login page
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Allow the request to continue if none of the conditions are met
  return NextResponse.next();
}

// Apply middleware only to /admin and its subpages
export const config = {
  matcher: ['/admin/:path*']
};
