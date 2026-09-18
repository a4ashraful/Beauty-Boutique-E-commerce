import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Brand } from '@/types';

const col = collection(db, 'brands');

/**
 * The old query was `where('isActive','==',true) + orderBy('name')`, which
 * needs a composite index in Firestore. Without it the query throws, the
 * caller's `.catch(() => [])` swallowed the error, and the Brands filter
 * silently rendered empty. It also hid every brand created before the
 * `isActive` field existed. We now read the (small) collection and filter
 * and sort in memory — no index, no missing brands.
 */
export async function getBrands(onlyActive = true): Promise<Brand[]> {
  const snap = await getDocs(col);
  let brands = snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Brand, 'id'>),
  }));

  // Treat a missing isActive as active (legacy docs)
  if (onlyActive) brands = brands.filter((b) => b.isActive !== false);

  // Backfill a slug if one was never saved, so filtering by brand works
  brands = brands.map((b) => ({
    ...b,
    slug: b.slug || (b.name || '').toLowerCase().trim().replace(/\s+/g, '-'),
  }));

  return brands.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const snap = await getDocs(query(col, where('slug', '==', slug), limit(1)));
  if (!snap.empty) {
    const d = snap.docs[0];
    return { id: d.id, ...(d.data() as any) };
  }
  // Fallback for brands saved without a slug field
  const all = await getBrands(false);
  return all.find((b) => b.slug === slug) || null;
}
