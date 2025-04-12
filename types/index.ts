import {
  cartItemSchema,
  insertCartSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  baseProductSchema,
  insertReviewSchema,
  paymentResultSchema,
  shippingAddressSchema,
  updateProductSchema,
} from '@/lib/validator';
import { z } from 'zod';

export type Product = z.infer<typeof baseProductSchema> & {
  id: string;
  rating: string;
  createdAt: Date;
  numReviews: number;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: Boolean;
  paidAt: Date | null;
  isDelivered: Boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
  paymentResult: PaymentResult;
};

export type PaymentResult = z.infer<typeof paymentResultSchema>;

export type SalesDataType = {
  month: string;
  totalSales: number;
}[];

export type Review = z.infer<typeof insertReviewSchema> & {
  id: string;
  createdAt: Date;
  user?: { name: string };
};

type InsertProduct = z.infer<typeof baseProductSchema>;
type UpdateProduct = z.infer<typeof updateProductSchema>;
export type FormSchema = InsertProduct | UpdateProduct;
