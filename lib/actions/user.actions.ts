'use server';

import { signIn, signOut } from '@/auth';
import { prisma } from '@/db/prisma';
import { formatError } from '@/lib/utils';
import { hashSync } from 'bcrypt-ts-edge';
import { AuthError } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signInFormSchema, signUpFormSchema } from '../validator';

const defaultValues = {
  email: '',
  password: '',
};

// Sign in the user with credentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData,
) {
  try {
    const email = formData.get('email');
    const password = formData.get('password');

    const validatedFields = signInFormSchema.safeParse({
      email,
      password,
    });

    if (!validatedFields.success) {
      return {
        message: 'validation error',
        errors: validatedFields.error.flatten().formErrors,
      };
    }
    await signIn('credentials', formData);
    return { success: true, message: 'Signed in successfully', errors: {} };
  } catch (error: any) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return {
            message: 'Invalid email or password',
            errors: {
              ...defaultValues,
              credentials: 'incorrect email or password',
            },
          };
        default:
          return {
            message: 'unkown error',
            errors: {
              ...defaultValues,
              unknown: 'unkown error',
            },
          };
      }
    }

    return { success: false, message: formatError(error) };
  }
}

// Sign the user out
export async function singOutUser() {
  await signOut();
}

// Register a new user
// Register a new user
export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
    });

    const plainPassword = user.password;

    // Hash the password
    user.password = hashSync(user.password, 10);

    // Create the user in the database
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    // Sign in the user after registration
    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: 'User created successfully' };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error),
    };
  }
}
