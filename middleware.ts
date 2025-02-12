import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import authConfig from './auth.config';

export default NextAuth(authConfig).auth;

// export function middleware(request: NextRequest) {
//   const sessionCartId = request.cookies.get('sessionCartId');

//   // Check for session cart cookie
//   if (!sessionCartId) {
//     // Generate new session cart id
//     const newSessionCartId = crypto.randomUUID();

//     // Create new response
//     const response = NextResponse.next();

//     // Set newly generated sessionCartId in the response cookies
//     response.cookies.set('sessionCartId', newSessionCartId, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       path: '/',
//       maxAge: 60 * 60 * 24, // 1 day expiration
//     });

//     return response;
//   }

//   return NextResponse.next();
// }

// Apply middleware to desired routes

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
