import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { generateOrderNumber } from '@/lib/utils';
import type { OrderItem, PaymentMethod } from '@/types';

/**
 * Orders MUST be created with the Admin SDK, never the browser SDK.
 *
 * The previous version called `placeOrder()` from lib/firestore/orders.ts
 * inside the API route. That module uses the *client* SDK (firebase/firestore),
 * which on Node talks gRPC and attaches the app id as the `x-firebase-gmpid`
 * metadata header — producing:
 *   Error: Metadata string value "1:3560...5ea691 " contains illegal characters
 * And even when that header is clean, the transaction decrements product
 * stock, which firestore.rules only allows for admins — so checkout could
 * never have succeeded from an unauthenticated client SDK on the server.
 */

export interface PlaceOrderInput {
  customerId?: string;
  customerName: string;
  phone: string;
  email?: string;
  division: string;
  district: string;
  area: string;
  address: string;
  items: OrderItem[];
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  paymentNote?: string;
  deliveryZoneId: string;
  deliveryCharge: number;
  notes?: string;
}

function toMillis(v: any): number | null {
  if (!v) return null;
  if (typeof v.toMillis === 'function') return v.toMillis();
  if (v._seconds) return v._seconds * 1000;
  if (v.seconds) return v.seconds * 1000;
  const t = new Date(v).getTime();
  return Number.isNaN(t) ? null : t;
}

async function validateCouponAdmin(code: string, subtotal: number) {
  const up = code.trim().toUpperCase();
  const snap = await adminDb.collection('coupons').where('code', '==', up).limit(1).get();
  if (snap.empty) throw new Error('Invalid coupon code');

  const ref = snap.docs[0].ref;
  const c = snap.docs[0].data() as any;

  if (!c.isActive) throw new Error('Coupon is not active');

  const now = Date.now();
  const start = toMillis(c.startDate);
  const end = toMillis(c.endDate);
  if (start && now < start) throw new Error('Coupon is not yet active');
  if (end && now > end) throw new Error('Coupon has expired');

  if (c.usageLimit && (c.usedCount ?? 0) >= c.usageLimit) {
    throw new Error('Coupon usage limit reached');
  }
  if (c.minOrder && subtotal < c.minOrder) {
    throw new Error(`Minimum order ৳${c.minOrder} required`);
  }

  let discount = c.type === 'percent' ? (subtotal * c.value) / 100 : c.value;
  if (c.maxDiscount) discount = Math.min(discount, c.maxDiscount);
  discount = Math.min(Math.round(discount), subtotal);

  return { ref, code: c.code as string, discount };
}

export async function placeOrderAdmin(input: PlaceOrderInput): Promise<{
  orderId: string;
  orderNumber: string;
}> {
  const subtotal = input.items.reduce((s, i) => s + i.price * i.qty, 0);

  let discount = 0;
  let couponCode: string | null = null;
  let couponRef: any = null;

  if (input.couponCode) {
    const r = await validateCouponAdmin(input.couponCode, subtotal);
    discount = r.discount;
    couponCode = r.code;
    couponRef = r.ref;
  }

  const total = Math.max(0, subtotal - discount + input.deliveryCharge);
  const orderNumber = generateOrderNumber();
  const orderRef = adminDb.collection('orders').doc();

  await adminDb.runTransaction(async (tx) => {
    const productRefs = input.items.map((i) =>
      adminDb.collection('products').doc(i.productId)
    );

    // ---- ALL READS FIRST (Firestore transaction requirement) ----
    const productSnaps = await tx.getAll(...productRefs);

    // ---- Validate stock ----
    const stockUpdates: Array<{ ref: any; data: any }> = [];

    for (let idx = 0; idx < input.items.length; idx++) {
      const item = input.items[idx];
      const snap = productSnaps[idx];
      if (!snap.exists) throw new Error(`Product ${item.name} no longer exists`);
      const p = snap.data() as any;

      if (item.variantId) {
        const v = (p.variants || []).find((x: any) => x.id === item.variantId);
        if (!v) throw new Error(`Variant unavailable for ${item.name}`);
        if ((v.stock ?? 0) < item.qty) {
          throw new Error(`Only ${v.stock ?? 0} left in stock for ${item.name}`);
        }
        const variants = (p.variants || []).map((x: any) =>
          x.id === item.variantId
            ? { ...x, stock: Math.max(0, (x.stock ?? 0) - item.qty) }
            : x
        );
        const newStock = variants.reduce((s: number, x: any) => s + (x.stock || 0), 0);
        stockUpdates.push({
          ref: productRefs[idx],
          data: {
            variants,
            stock: newStock,
            soldCount: FieldValue.increment(item.qty),
            updatedAt: FieldValue.serverTimestamp(),
          },
        });
      } else {
        if ((p.stock ?? 0) < item.qty) {
          throw new Error(`Only ${p.stock ?? 0} left in stock for ${item.name}`);
        }
        stockUpdates.push({
          ref: productRefs[idx],
          data: {
            stock: FieldValue.increment(-item.qty),
            soldCount: FieldValue.increment(item.qty),
            updatedAt: FieldValue.serverTimestamp(),
          },
        });
      }
    }

    // ---- WRITES ----
    tx.set(orderRef, {
      orderNumber,
      customerId: input.customerId || null,
      customerName: input.customerName,
      phone: input.phone,
      email: input.email || '',
      division: input.division,
      district: input.district,
      area: input.area,
      address: input.address,
      items: input.items,
      subtotal,
      discount,
      deliveryCharge: input.deliveryCharge,
      total,
      couponCode: couponCode || null,
      paymentMethod: input.paymentMethod,
      paymentStatus: 'pending',
      paymentReference: input.paymentReference || '',
      paymentNote: input.paymentNote || '',
      status: 'pending',
      deliveryZoneId: input.deliveryZoneId,
      courier: '',
      trackingNumber: '',
      adminNotes: input.notes || '',
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    stockUpdates.forEach((u) => tx.update(u.ref, u.data));

    if (couponRef) {
      tx.update(couponRef, { usedCount: FieldValue.increment(1) });
    }
  });

  return { orderId: orderRef.id, orderNumber };
}
