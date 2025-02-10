import { auth } from './auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  // Perform actions only if necessary based on the login status
  if (isLoggedIn) {
    // Your login-specific logic here, if needed
  }
  // You can return a redirect or further handle the request if needed
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
