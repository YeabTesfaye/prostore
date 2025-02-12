import Credential from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

import { getUserByEmail, getUserByUserId } from '@/data/user';
import { signInFormSchema } from './lib/validator';
import { compare } from './lib/constants/encrypt';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './db/prisma';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export default {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/sign-in',
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    Credential({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate the credentials using the schema
        const validatedFields = signInFormSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null; // Return null for invalid credentials
        }

        const { email, password } = validatedFields.data;

        // Fetch user from the database
        const user = await getUserByEmail(email);
        if (!user || !user.password) {
          throw new Error('Envalid email or password');
        }

        // Compare passwords
        const passwordsMatch = compare(password, user.password);
        if (!passwordsMatch) {
          return null;
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }: any) {
      const userExist = await getUserByUserId(user.id);
      if (userExist) return true;
      return false;
    },
    async session({ session, token }: any) {
      session.user.id = token.sub;
      session.user.name = token.name;
      session.user.role = token.role;

      return session;
    },
    async jwt({ token, trigger }: any) {
      if (!token.sub) return token;
      const userExist = await getUserByUserId(token.sub);
      if (!userExist) return token;

      console.log('trigger', trigger, 'trigger');

      if (trigger === 'signIn' || trigger === 'signUp') {
        const cookieObject = await cookies();
        const sessionCartId = cookieObject.get('sessionCartId')?.value;

        if (sessionCartId) {
          const sessionCart = await prisma.cart.findFirst({
            where: {
              sessionCartId,
            },
          });

          // Delete Current user cart
          if (sessionCart) {
            await prisma.cart.deleteMany({
              where: { userId: userExist.id },
            });
          }

          // Assign new Cart
          await prisma.cart.update({
            where: { id: sessionCart?.id },
            data: {
              userId: userExist.id,
            },
          });
        }
      }
      token.role = userExist.role;
      return token;
    },
    authorized({ auth, request }) {
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
        return true;
      }
    },
  },
} satisfies NextAuthConfig;
