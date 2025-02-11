import Credential from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

import { getUserByEmail } from '@/data/user';
import { signInFormSchema } from './lib/validator';
import { compare } from './lib/constants/encrypt';

export default {
  secret: process.env.AUTH_SECRET,
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
} satisfies NextAuthConfig;
