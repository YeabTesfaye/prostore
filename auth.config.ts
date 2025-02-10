import Credential from 'next-auth/providers/credentials';


import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import { getUserByEmail } from './data/user';
import { loginSchema } from './schema';

export default {
  providers: [
    Credential({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Validate the credentials using the schema
        const validatedFields = loginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          console.log('Invalid credentials format:', validatedFields.error);
          return null; // Return null for invalid credentials
        }

        const { email, password } = validatedFields.data;

        // Fetch user from the database
        const user = await getUserByEmail(email);
        if (!user || !user.password) {
          console.log(`User with email ${email} not found or password not set`);
          return null; // Return null if user does not exist or does not have a password
        }

        // Compare passwords
        const passwordsMatch =  compareSync(password, user.password);
        if (!passwordsMatch) {
          console.log('Password mismatch for user:', email);
          return null; // Return null if passwords do not match
        }

        // Return the user if everything checks out
        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
