'use server';

import { auth, signIn, signOut } from '@/auth';
import { prisma } from '@/db/prisma';
import { formatError } from '@/lib/utils';

import { ShippingAddress } from '@/types';
import { AuthError } from 'next-auth';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { z } from 'zod';
import { hash } from '../constants/encrypt';
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserSchema,
} from '../validator';
import { PAGE_SIZE } from '@/lib/constants';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

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
    user.password = await hash(user.password);

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

// Update user's address
export async function updateUserAddress(data: ShippingAddress) {
  try {
    const session = await auth();

    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id! },
    });

    if (!user) {
      return null;
    }
    const address = shippingAddressSchema.parse(data);

    await prisma.user.update({
      where: { id: user?.id },
      data: { address },
    });

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

export async function updateUserPaymentMethod(
  data: z.infer<typeof paymentMethodSchema>,
) {
  try {
    const session = await auth();

    const user = await prisma.user.findUnique({
      where: { id: session?.user?.id! },
    });
    if (!user) return null;

    const paymentMethod = paymentMethodSchema.parse(data);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        paymentMethod: paymentMethod.type,
      },
    });
    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update User Profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findUnique({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error('User not found');

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
        email: user.email,
      },
    });
    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Delete user
export async function deleteUser(userId: string) {
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) throw new Error('User not found');

    await prisma.user.delete({
      where: { id: userId },
    });

    revalidatePath('/admin/users');
    return {
      success: true,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update user
export async function updateUser(user: z.infer<typeof updateUserSchema>) {
  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        role: user.role,
        email: user.email,
      },
    });

    revalidatePath('/admin/users');

    return {
      success: true,
      message: 'User updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get all users
export async function getAllUsers({
  limit = PAGE_SIZE,
  page,
  query,
}: {
  limit?: number;
  page: number;
  query: string;
}) {
  const queryFilter: Prisma.UserWhereInput =
    query && query !== 'all'
      ? {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              } as Prisma.StringFilter,
            },
            {
              email: {
                contains: query,
                mode: 'insensitive',
              } as Prisma.StringFilter,
            },
          ],
        }
      : {};

  const data = await prisma.user.findMany({
    where: {
      ...queryFilter,
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  });

  const dataCount = await prisma.user.count();

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  };
}
