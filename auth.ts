import authConfig from '@/auth.config';

import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { prisma } from './db/prisma';
import { getUserById } from './data/user';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  callbacks: {
    async signIn({ user }: any) {
      const userExist = await getUserById(user.id);
      if (userExist) return true;
      return false;
    },
    async session({ session, token }: any) {
      session.user.id = token.sub;
      session.user.name = token.name;
      session.user.role = token.role;

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const userExist = await getUserById(token.sub);
      if (!userExist) return token;

      token.role = userExist.role;
      return token;
    },
    async authorized({ request }: any) {
      // Check for cart cookie
      if (!request.cookies.get('sessionCartId')) {
        const sessionCartId = crypto.randomUUID();

        // Clone the request headers
        const newRequestHeaders = new Headers(request.headers);

        // Create a new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        // Set the newly generate sessionCartId in the response cookies
        response.cookies.set('sessionCartId', sessionCartId);

        // Return the respnse with sessionCartId set
        return response;
      } else {
        return true;
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
});
