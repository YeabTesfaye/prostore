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
    // authorized({ request }: any) {
    //   const sessionCartId = request.cookies.get('sessionCartId');
    //   console.log(sessionCartId, "request.cookies.get('sessionCartId')");
    //   // Check for session cart cookie
    //   if (!request.cookies.get('sessionCartId')) {
    //     // Generate new session cart id cookie
    //     const sessionCartId = crypto.randomUUID();

    //     // Clone the req headers
    //     const newRequestHeaders = new Headers(request.headers);

    //     // Create new response and add the new headers
    //     const response = NextResponse.next({
    //       request: {
    //         headers: newRequestHeaders,
    //       },
    //     });

    //     // Set newly generated sessionCartId in the response cookies
    //     response.cookies.set('sessionCartId', sessionCartId);

    //     return response;
    //   } else {
    //     return true;
    //   }
    // },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
});
