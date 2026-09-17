export type Role = 'customer' | 'admin';

export interface Address {
  id: string;
  label?: string;
  fullName: string;
  phone: string;
  division: string;
  district: string;
  area: string;
  address: string;
  isDefault?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  photoURL?: string;
  addresses?: Address[];
  disabled?: boolean;
  createdAt?: any;
}

export interface ProductImage {
  url: string;
  thumbUrl?: string;
  isMain?: boolean;
  order?: number;
}

export interface ProductVariant {
  id: string;
  name: string;         // e.g. "Ruby Red"
  sku?: string;
  price: number;
  stock: number;
  image?: string;
  shade?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  brandId?: string;
  brandName?: string;
  categoryId?: string;
  categoryName?: string;
  subcategoryId?: string;
  subcategoryName?: string;
  sku?: string;
  shortDescription?: string;
  description?: string;
  regularPrice: number;
  salePrice?: number;
  discountPercent?: number;
  stock: number;
  images: ProductImage[];
  variants?: ProductVariant[];
  size?: string;
  shades?: string[];
  ingredients?: string;
  benefits?: string;
  howToUse?: string;
  skinTypes?: string[];
  skinConcerns?: string[];
  countryOfOrigin?: string;
  expiryInfo?: string;
  seoTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isActive: boolean;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  viewCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parentId?: string | null;
  order?: number;
  isActive: boolean;
  seoTitle?: string;
  metaDescription?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  image?: string;
  price: number;
  qty: number;
  stock: number;
  sku?: string;
  variantName?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'fixed' | 'percent';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  startDate?: any;
  endDate?: any;
  usageLimit?: number;
  usedCount?: number;
  productIds?: string[];
  categoryIds?: string[];
  isActive: boolean;
}

export type OrderStatus =
  | 'pending' | 'confirmed' | 'processing' | 'shipped'
  | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'bank' | 'manual';

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  variantName?: string;
  image?: string;
  price: number;
  qty: number;
  sku?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  phone: string;
  email?: string;
  division: string;
  district: string;
  area: string;
  address: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentReference?: string;
  paymentNote?: string;
  status: OrderStatus;
  deliveryZoneId?: string;
  courier?: string;
  trackingNumber?: string;
  adminNotes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface Review {
  id: string;
  productId: string;
  customerId?: string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  isFeatured?: boolean;
  createdAt?: any;
}

export interface Banner {
  id: string;
  title?: string;
  subtitle?: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
  order?: number;
  isActive: boolean;
  position?: 'hero' | 'promo' | 'sidebar';
}

export interface DeliveryZone {
  id: string;
  name: string;
  divisions?: string[];
  districts?: string[];
  charge: number;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId?: string;
  orderId?: string;
  title: string;
  message: string;
  type: 'order' | 'system' | 'promo';
  read?: boolean;
  createdAt?: any;
}

export interface Setting {
  key: string;
  value: any;
}
