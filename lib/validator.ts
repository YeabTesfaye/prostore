import { z } from 'zod';
import { PAYMENT_METHODS } from './constants';
import { formatNumberWithDecimal } from './utils';

// Make sure price is formatted with two decimal places
const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    'Price must have exactly two decimal places (e.g., 49.99)',
  );

// Define the zod schema
export const baseProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category: z.string().min(3, 'Category must be at least 3 characters'),
  brand: z.string().min(3, 'Brand must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'Product must have at least one image'),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
  id: z.string().optional(),
});

// Schema for signing in a user
export const signInFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'Email required!' })
    .email({ message: 'Invalid email!' }),
  password: z
    .string()
    .trim()
    .min(1, { message: 'Password required!' })
    .min(6, { message: 'Password must have at least 8 characters!' }),
});

// Schema for siging up a user
export const signUpFormSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .regex(/^[a-zA-Z\s]+$/, {
        message: 'Name must contain only letters and spaces',
      }),
    email: z
      .string()
      .min(3, 'Email Must be at least 3 characters')
      .email('Please provide a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(64, "Password can't be longer than 64 characters")
      .regex(/^[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;<>,.?/~`-]+$/, {
        message: 'Password contains invalid characters',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Cart
export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  qty: z.number().int().nonnegative('Quantity must be a non-negative number'),
  image: z.string().min(1, 'Image URL is required'),
  price: currency,
});

// insert cart schema
export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, 'Session cart id is required'),
  userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
  city: z.string().min(3, 'city must be at least 3 characters'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
  country: z.string().min(3, 'Country must be at least 3 characters'),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Payment Schema
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, 'Payment method is required'),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ['type'],
    message: 'Invalid payment method',
  });

//Insert Order Schema
export const insertOrderSchema = z.object({
  userId: z.string().min(1, 'User is required'),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: 'Invalid payment method',
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// Update Profile Schema
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .regex(/^[a-zA-Z\s]+$/, {
      message: 'Name must contain only letters and spaces',
    }),
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .min(5, { message: 'Email must be at least 5 characters long' }),
});

// Schema for update a product
export const updateProductSchema = baseProductSchema;

// Update User Schema
export const updateUserSchema = updateProfileSchema.extend({
  id: z.string().min(1, 'Id is required'),
  role: z.enum(['admin', 'user']),
});

// Insert Review Schema
export const insertReviewSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  productId: z.string().min(1, 'Product is required'),
  userId: z.string().min(1, 'User is required'),
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
});
