import {
  collection, getDocs, orderBy, query, where, Timestamp,
  doc, updateDoc, serverTimestamp, addDoc, limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { createNotification } from './notifications';
import type { Order, OrderStatus, PaymentStatus } from '@/types';

const col = collection(db, 'orders');

export async function getAllOrders(): Promise<Order[]> {
  const snap = await getDocs(query(col, orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export async function updateStatus(
  orderId: string,
  status: OrderStatus,
  extra: Partial<Order> = {}
) {
  const patch: any = { status, updatedAt: serverTimestamp(), ...extra };
  await updateDoc(doc(col, orderId), patch);

  // Notify customer (if we know who they are)
  const order = await getOrderById(orderId);
  if (order?.customerId) {
    const messages: Record<string, string> = {
      confirmed: 'Your order has been confirmed.',
      processing: 'Your order is being prepared.',
      shipped: `Your order has been shipped${extra.courier ? ` via ${extra.courier}` : ''}.`,
      out_for_delivery: 'Your order is out for delivery today.',
      delivered: 'Your order was delivered. Enjoy!',
      cancelled: 'Your order has been cancelled.',
      returned: 'Your order has been marked as returned/refunded.',
    };
    await createNotification({
      userId: order.customerId,
      orderId,
      title: `Order ${order.orderNumber}`,
      message: messages[status] || `Status updated to ${status}`,
      type: 'order',
    });
  }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus) {
  await updateDoc(doc(col, orderId), {
    paymentStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function updateCourierInfo(
  orderId: string,
  courier: string,
  trackingNumber: string
) {
  await updateDoc(doc(col, orderId), {
    courier,
    trackingNumber,
    updatedAt: serverTimestamp(),
  });
}

export async function updateAdminNotes(orderId: string, adminNotes: string) {
  await updateDoc(doc(col, orderId), { adminNotes, updatedAt: serverTimestamp() });
}

// private helper
async function getOrderById(id: string): Promise<Order | null> {
  const snap = await getDocs(query(col, where('__name__', '==', id)));
  // fallback direct get
  const { getDoc } = await import('firebase/firestore');
  const d = await getDoc(doc(col, id));
  return d.exists() ? { id: d.id, ...(d.data() as any) } : null;
}