import {
  addDoc, collection, doc, getDoc, getDocs, increment, limit,
  query, runTransaction, serverTimestamp, updateDoc, where, orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { generateOrderNumber } from '@/lib/utils';
import { validateCoupon } from './coupons';
import type { Order, OrderItem, PaymentMethod } from '@/types';

const col = collection(db, 'orders');

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

export async function placeOrder(input: PlaceOrderInput): Promise<{
  orderId: string;
  orderNumber: string;
}> {
  const subtotal = input.items.reduce((s, i) => s + i.price * i.qty, 0);

  // Validate coupon
  let discount = 0;
  let couponCode: string | undefined;
  if (input.couponCode) {
    const r = await validateCoupon(input.couponCode, subtotal);
    if (!r.ok) throw new Error(r.error);
    discount = r.discount;
    couponCode = r.coupon.code;
  }

  const total = Math.max(0, subtotal - discount + input.deliveryCharge);
  const orderNumber = generateOrderNumber();

  const result = await runTransaction(db, async (tx) => {
    // 1) Check stock for each item
    const productRefs = input.items.map((i) => doc(db, 'products', i.productId));
    const productSnaps = await Promise.all(productRefs.map((r) => tx.get(r)));

    for (let idx = 0; idx < input.items.length; idx++) {
      const item = input.items[idx];
      const snap = productSnaps[idx];
      if (!snap.exists()) throw new Error(`Product ${item.name} no longer exists`);
      const p = snap.data() as any;

      if (item.variantId) {
        const v = (p.variants || []).find((x: any) => x.id === item.variantId);
        if (!v) throw new Error(`Variant unavailable for ${item.name}`);
        if (v.stock < item.qty) {
          throw new Error(`Only ${v.stock} left in stock for ${item.name}`);
        }
      } else {
        if ((p.stock ?? 0) < item.qty) {
          throw new Error(`Only ${p.stock ?? 0} left in stock for ${item.name}`);
        }
      }
    }

    // 2) Create order
    const orderRef = doc(col);
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
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 3) Decrement stock
    for (let idx = 0; idx < input.items.length; idx++) {
      const item = input.items[idx];
      const p = productSnaps[idx].data() as any;

      if (item.variantId) {
        const variants = (p.variants || []).map((v: any) =>
          v.id === item.variantId ? { ...v, stock: Math.max(0, v.stock - item.qty) } : v
        );
        const newStock = variants.reduce((s: number, v: any) => s + (v.stock || 0), 0);
        tx.update(productRefs[idx], {
          variants,
          stock: newStock,
          soldCount: increment(item.qty),
          updatedAt: serverTimestamp(),
        });
      } else {
        tx.update(productRefs[idx], {
          stock: increment(-item.qty),
          soldCount: increment(item.qty),
          updatedAt: serverTimestamp(),
        });
      }
    }

    // 4) Increment coupon usage
    if (couponCode) {
      const cSnap = await getDocs(query(collection(db, 'coupons'), where('code', '==', couponCode)));
      cSnap.forEach((d) => tx.update(d.ref, { usedCount: increment(1) }));
    }

    return { orderId: orderRef.id, orderNumber };
  });

  return result;
}

// ---------- FETCH ----------
export async function getOrderById(id: string): Promise<Order | null> {
  const snap = await getDoc(doc(db, 'orders', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Order, 'id'>) };
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const snap = await getDocs(query(col, where('orderNumber', '==', orderNumber), limit(1)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Omit<Order, 'id'>) };
}

export async function getOrderByNumberOrPhone(
  orderNumber: string,
  phone: string
): Promise<Order | null> {
  const order = await getOrderByNumber(orderNumber);
  if (!order) return null;
  if (order.phone !== phone) return null;
  return order;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const snap = await getDocs(
    query(col, where('customerId', '==', userId), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Order, 'id'>) }));
}

// ---------- ADMIN ----------
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
) {
  await updateDoc(doc(db, 'orders', orderId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function updateOrderPayment(
  orderId: string,
  paymentStatus: Order['paymentStatus']
) {
  await updateDoc(doc(db, 'orders', orderId), {
    paymentStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function updateOrderShipping(
  orderId: string,
  courier: string,
  trackingNumber: string
) {
  await updateDoc(doc(db, 'orders', orderId), {
    courier,
    trackingNumber,
    status: 'shipped',
    updatedAt: serverTimestamp(),
  });
}