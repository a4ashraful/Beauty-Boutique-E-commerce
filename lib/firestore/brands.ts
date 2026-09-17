import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Brand } from '@/types';

const col = collection(db, 'brands');

export async function getBrands(onlyActive = true): Promise<Brand[]> {
  const q = onlyActive
    ? query(col, where('isActive', '==', true), orderBy('name', 'asc'))
    : query(col, orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Brand, 'id'>) }));
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const snap = await getDocs(query(col, where('slug', '==', slug)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as any) };
}