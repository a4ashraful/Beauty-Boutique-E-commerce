import {
  collection, getDocs, query, where, doc, getDoc, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Coupon } from '@/types';

const col = collection(db, 'coupons');

export async function findCouponByCode(code: string): Promise<Coupon | null> {
  const up = code.trim().toUpperCase();
  const snap = await getDocs(query(col, where('code', '==', up)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Omit<Coupon, 'id'>) };
}

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{ ok: true; coupon: Coupon; discount: number } | { ok: false; error: string }> {
  const coupon = await findCouponByCode(code);
  if (!coupon) return { ok: false, error: 'Invalid coupon code' };
  if (!coupon.isActive) return { ok: false, error: 'Coupon is not active' };

  const now = Date.now();
  const start = coupon.startDate?.toMillis?.() ?? 0;
  const end = coupon.endDate?.toMillis?.() ?? Infinity;
  if (now < start) return { ok: false, error: 'Coupon is not yet active' };
  if (now > end) return { ok: false, error: 'Coupon has expired' };

  if (coupon.usageLimit && (coupon.usedCount ?? 0) >= coupon.usageLimit) {
    return { ok: false, error: 'Coupon usage limit reached' };
  }

  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return {
      ok: false,
      error: `Minimum order ৳${coupon.minOrder} required`,
    };
  }

  let discount =
    coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value;

  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  discount = Math.min(discount, subtotal);

  return { ok: true, coupon, discount };
}