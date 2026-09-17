import {
  collection, getDocs, query, where, orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Category } from '@/types';

const col = collection(db, 'categories');

export async function getCategories(onlyActive = true): Promise<Category[]> {
  const q = onlyActive
    ? query(col, where('isActive', '==', true), orderBy('order', 'asc'))
    : query(col, orderBy('order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, 'id'>) }));
}

export async function getTopCategories(n = 8): Promise<Category[]> {
  const all = await getCategories();
  return all.filter((c) => !c.parentId).slice(0, n);
}

export async function getSubcategories(parentId: string): Promise<Category[]> {
  const snap = await getDocs(
    query(col, where('parentId', '==', parentId), where('isActive', '==', true), orderBy('order', 'asc'))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Category, 'id'>) }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const snap = await getDocs(query(col, where('slug', '==', slug)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as any) };
}