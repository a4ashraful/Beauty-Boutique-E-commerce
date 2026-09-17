import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBDT(amount: number): string {
  return `৳${Number(amount || 0).toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function calcDiscount(regular: number, sale?: number): number {
  if (!sale || sale >= regular) return 0;
  return Math.round(((regular - sale) / regular) * 100);
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

export function formatDate(date: any): string {
  if (!date) return '—';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatDateTime(date: any): string {
  if (!date) return '—';
  const d = date.toDate ? date.toDate() : new Date(date);
  return d.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BBT-${ts}-${rnd}`;
}

export function bdtToWords(amount: number): string {
  // simple: only used for invoices
  return `${amount} taka only`;
}

export const BD_DIVISIONS = [
  'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna',
  'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh',
];

export const BD_DISTRICTS: Record<string, string[]> = {
  Dhaka: ['Dhaka', 'Gazipur', 'Narayanganj', 'Tangail', 'Kishoreganj', 'Manikganj', 'Munshiganj', 'Narsingdi', 'Faridpur', 'Gopalganj', 'Madaripur', 'Rajbari', 'Shariatpur'],
  Chattogram: ['Chattogram', "Cox's Bazar", 'Cumilla', 'Feni', 'Noakhali', 'Lakshmipur', 'Chandpur', 'Brahmanbaria', 'Rangamati', 'Bandarban', 'Khagrachari'],
  Rajshahi: ['Rajshahi', 'Bogura', 'Pabna', 'Sirajganj', 'Natore', 'Naogaon', 'Chapainawabganj', 'Joypurhat'],
  Khulna: ['Khulna', 'Jashore', 'Kushtia', 'Satkhira', 'Bagerhat', 'Jhenaidah', 'Magura', 'Meherpur', 'Narail', 'Chuadanga'],
  Barishal: ['Barishal', 'Patuakhali', 'Bhola', 'Pirojpur', 'Barguna', 'Jhalokathi'],
  Sylhet: ['Sylhet', 'Moulvibazar', 'Habiganj', 'Sunamganj'],
  Rangpur: ['Rangpur', 'Dinajpur', 'Kurigram', 'Gaibandha', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon'],
  Mymensingh: ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur'],
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered',
];

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  returned: 'Returned',
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
};

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cod: 'Cash on Delivery',
  bkash: 'bKash',
  nagad: 'Nagad',
  bank: 'Bank Transfer',
  manual: 'Manual Payment',
};

export const SKIN_TYPES = ['Oily', 'Dry', 'Combination', 'Normal', 'Sensitive', 'All'];
export const SKIN_CONCERNS = ['Acne', 'Dark Spots', 'Pigmentation', 'Wrinkles', 'Dryness', 'Dullness', 'Pores', 'Redness', 'Sun Damage'];

export const PRODUCT_SIZES = ['10ml', '15ml', '30ml', '50ml', '100ml', '150ml', '200ml', '5g', '10g', '30g', '50g'];

import type { OrderStatus } from '@/types';

export function generateSKU(prefix = 'BBT'): string {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}