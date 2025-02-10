import authConfig from '@/auth.config';

import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { getUserById } from './data/user';
import { prisma } from './db/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
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
      const sessionCartId = request.cookies.get('sessionCartId');

      // Check for cart cookie
      if (!sessionCartId) {
        const sessionCartId = crypto.randomUUID();
        const response = NextResponse.next({
          request: {
            headers: new Headers(request.headers),
          },
        });

        // Setting secure cookies with no cache
        response.cookies.set('sessionCartId', sessionCartId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });

        response.headers.set('Cache-Control', 'no-store');

        return response;
      } else {
        return NextResponse.next();
      }
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
});
