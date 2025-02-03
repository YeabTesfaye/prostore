'use server';
import { prisma } from '@/db/prisma';
import { LATEST_PRODUCTS_LIMIT } from '../constants';
import { convertToPlainObject } from '../utils';

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  // Convert Decimal fields to string to match your Product type
  const formattedData = data.map((product) => ({
    ...product,
    price: product.price.toString(), // ✅ Convert Decimal to string
    rating: product.rating.toString(), // ✅ Convert Decimal to string
  }));

  return convertToPlainObject(formattedData);
}

// Get single product by slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug },
  });
}
