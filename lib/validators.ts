import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3).max(200),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  sku: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),
  regularPrice: z.number().min(0),
  salePrice: z.number().min(0).optional(),
  stock: z.number().int().min(0),
  size: z.string().optional(),
  ingredients: z.string().optional(),
  benefits: z.string().optional(),
  howToUse: z.string().optional(),
  skinTypes: z.array(z.string()).optional(),
  skinConcerns: z.array(z.string()).optional(),
  countryOfOrigin: z.string().optional(),
  expiryInfo: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isActive: z.boolean(),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  image: z.string().optional(),
  description: z.string().optional(),
  parentId: z.string().nullable().optional(),
  order: z.number().optional(),
  isActive: z.boolean().default(true),
});

export const brandSchema = z.object({
  name: z.string().min(2),
  logo: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const couponSchema = z.object({
  code: z.string().min(2).transform((s) => s.toUpperCase()),
  type: z.enum(['fixed', 'percent']),
  value: z.number().min(1),
  minOrder: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(0).optional(),
  isActive: z.boolean().default(true),
});

export const bannerSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  image: z.string().min(1),
  buttonText: z.string().optional(),
  buttonLink: z.string().optional(),
  order: z.number().optional(),
  position: z.enum(['hero', 'promo', 'sidebar']).optional(),
  isActive: z.boolean().default(true),
});

export const deliveryZoneSchema = z.object({
  name: z.string().min(2),
  divisions: z.array(z.string()).optional(),
  districts: z.array(z.string()).optional(),
  charge: z.number().min(0),
  isActive: z.boolean().default(true),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(2).max(100),
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid BD phone number'),
  email: z.string().email().optional().or(z.literal('')),
  division: z.string().min(2),
  district: z.string().min(2),
  area: z.string().min(2),
  address: z.string().min(5),
  paymentMethod: z.enum(['cod', 'bkash', 'nagad', 'bank', 'manual']),
  paymentReference: z.string().optional(),
  paymentNote: z.string().optional(),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(3).max(1000),
});