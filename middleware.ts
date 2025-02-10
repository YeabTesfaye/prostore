import { auth } from './auth';
import authConfig from './auth.config';
import NextAuth from 'next-auth';

export default auth((req) => {
  const { nextUrl } = req;

  const isLoggedIn = !!req.auth;

  return;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
