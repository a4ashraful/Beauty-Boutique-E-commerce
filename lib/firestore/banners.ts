import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Banner } from '@/types';

const col = collection(db, 'banners');

export async function getBanners(position?: 'hero' | 'promo' | 'sidebar'): Promise<Banner[]> {
  const constraints: any[] = [where('isActive', '==', true)];
  if (position) constraints.push(where('position', '==', position));
  constraints.push(orderBy('order', 'asc'));
  const snap = await getDocs(query(col, ...constraints));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Banner, 'id'>) }));
}