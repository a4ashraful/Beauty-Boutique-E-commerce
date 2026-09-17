import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp, collection, getDocs, query, orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { UserProfile, Address } from '@/types';

const usersCol = collection(db, 'users');

export async function ensureUserProfile(
  uid: string,
  data: { email: string; name: string; photoURL?: string }
): Promise<UserProfile> {
  const ref = doc(usersCol, uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const payload = {
      email: data.email,
      name: data.name || data.email.split('@')[0],
      phone: '',
      role: 'customer' as const,
      photoURL: data.photoURL || '',
      addresses: [],
      disabled: false,
      createdAt: serverTimestamp(),
    };
    await setDoc(ref, payload);
    return { uid, ...payload } as any;
  }
  return { uid, ...(snap.data() as any) };
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(usersCol, uid));
  return snap.exists() ? ({ uid, ...(snap.data() as any) } as UserProfile) : null;
}

export async function updateUserProfile(uid: string, patch: Partial<UserProfile>) {
  await updateDoc(doc(usersCol, uid), { ...patch, updatedAt: serverTimestamp() });
}

export async function setUserAddresses(uid: string, addresses: Address[]) {
  await updateDoc(doc(usersCol, uid), { addresses, updatedAt: serverTimestamp() });
}

// ---------- ADMIN ----------
export async function getAllCustomers(): Promise<UserProfile[]> {
  const snap = await getDocs(query(usersCol, orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }));
}
