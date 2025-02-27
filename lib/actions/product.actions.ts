'use server';
import { prisma } from '@/db/prisma';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import { convertToPlainObject, formatError } from '../utils';
import { skip } from 'node:test';
import { revalidatePath } from 'next/cache';
import { TypeOf, z } from 'zod';
import { insertProductSchema, updateProductSchema } from '../validator';

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

// Get all Products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category: string;
}) {
  const data = await prisma.product.findMany({
    take: limit,
    skip: (page - 1) * limit,
    // where: {
    //   name: {
    //     contains: query,
    //     mode: 'insensitive',
    //   },
    //   category: category ? { equals: category } : undefined,
    // },
  });

  const dataCount = await prisma.product.count();

  return { data, totalPages: Math.ceil(dataCount / limit) };
}

// Delete product by Id
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findUnique({ where: { id } });

    if (!productExists) throw new Error('Product not found');

    await prisma.product.delete({
      where: { id },
    });

    revalidatePath('/admin/products');
    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create Product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {
  try {
    // Validate and create product
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product created successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Update Product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    // Validate and find product
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findUnique({
      where: { id: product.id },
    });

    if (!productExists) throw new Error('Product not found');

    // Update product
    await prisma.product.update({ where: { id: product.id }, data: product });

    revalidatePath('/admin/products');
    return {
      success: true,
      message: 'Product updated successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}
