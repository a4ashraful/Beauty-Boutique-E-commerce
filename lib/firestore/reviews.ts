import {
  collection, getDocs, query, where, orderBy, limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Review } from '@/types';

const col = collection(db, 'reviews');

export async function getProductReviews(productId: string): Promise<Review[]> {
  const snap = await getDocs(
    query(col, where('productId', '==', productId), where('isApproved', '==', true), orderBy('createdAt', 'desc'), limit(50))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Review, 'id'>) }));
}

export async function getFeaturedReviews(n = 6): Promise<Review[]> {
  const snap = await getDocs(
    query(col, where('isApproved', '==', true), where('isFeatured', '==', true), orderBy('createdAt', 'desc'), limit(n))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Review, 'id'>) }));
}

export async function getRecentReviews(n = 6): Promise<Review[]> {
  const snap = await getDocs(
    query(col, where('isApproved', '==', true), orderBy('createdAt', 'desc'), limit(n))
  );
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Review, 'id'>) }));
}