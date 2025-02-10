import * as z from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z.string().nonempty({ message: 'Password is required' }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: 'A valid email address is required' }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  confirmPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters long',
  }),
});
