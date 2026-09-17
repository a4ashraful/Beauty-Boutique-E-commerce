import {
  collection, addDoc, serverTimestamp, getDocs, query, where, orderBy,
  doc, updateDoc, deleteDoc, limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Notification } from '@/types';

const col = collection(db, 'notifications');

export async function createNotification(n: Omit<Notification, 'id' | 'createdAt'>) {
  await addDoc(col, { ...n, read: false, createdAt: serverTimestamp() });
}

export async function getNotificationsForUser(uid: string, max = 30): Promise<Notification[]> {
  const snap = await getDocs(
    query(col, where('userId', '==', uid), orderBy('createdAt', 'desc'), limit(max))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export async function getAdminNotifications(max = 30): Promise<Notification[]> {
  const snap = await getDocs(
    query(col, where('userId', '==', null), orderBy('createdAt', 'desc'), limit(max))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
}

export async function markNotificationRead(id: string) {
  await updateDoc(doc(col, id), { read: true });
}

export async function deleteNotification(id: string) {
  await deleteDoc(doc(col, id));
}