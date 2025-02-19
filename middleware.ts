import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { auth } from './auth';

export default async function middleware(request: NextRequest) {
  // The authorized function that checks if a user is authenticated
  const authorized = async ({
    auth,
    request,
  }: {
    auth: any;
    request: NextRequest;
  }) => {
    // Array of regex patterns of paths we want to protect
    const protectedPaths = [
      /\/shipping-address/,
      /\/payment-method/,
      /\/place-order/,
      /\/profile/,
      /\/user\/(.*)/,
      /\/order\/(.*)/,
      /\/admin/,
    ];

    // Get pathname from the req URL object
    const { pathname } = request.nextUrl;

    // Check if user is not authenticated and accessing a protected path
    if (!auth && protectedPaths.some((p) => p.test(pathname))) {
      const callbackUrl = encodeURIComponent(pathname); // Use the current pathname as callbackUrl
      // Redirect to the sign-in page with callbackUrl
      return NextResponse.redirect(
        `http://localhost:3000/sign-in?callbackUrl=${callbackUrl}`,
      );
    }

    // Check for session cart cookie
    if (!request.cookies.get('sessionCartId')) {
      // Generate new session cart id cookie
      const sessionCartId = crypto.randomUUID();

      // Clone the req headers
      const newRequestHeaders = new Headers(request.headers);

      // Create new response and add the new headers
      const response = NextResponse.next({
        request: {
          headers: newRequestHeaders,
        },
      });

      // Set newly generated sessionCartId in the response cookies
      response.cookies.set('sessionCartId', sessionCartId);

      return response;
    } else {
      return NextResponse.next(); // No issues, continue processing
    }
  };

  // Perform the actual authentication check
  const authResult = await auth(); // Assuming you have some authentication setup here

  return authorized({ auth: authResult, request });
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
