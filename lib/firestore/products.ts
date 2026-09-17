import {
  collection, query, where, orderBy, limit, getDocs, doc, getDoc,
  QueryConstraint, startAfter, QueryDocumentSnapshot, DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Product } from '@/types';

const col = collection(db, 'products');

function mapDoc(d: QueryDocumentSnapshot<DocumentData>): Product {
  return { id: d.id, ...(d.data() as Omit<Product, 'id'>) };
}

// ---------- BASIC LIST ----------
export async function getProducts(opts: {
  categoryId?: string;
  subcategoryId?: string;
  brandId?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  maxPrice?: number;
  minPrice?: number;
  onSale?: boolean;
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'best-selling' | 'rating';
  pageSize?: number;
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
  searchTerm?: string;
} = {}): Promise<{ products: Product[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
  const constraints: QueryConstraint[] = [where('isActive', '==', true)];

  if (opts.categoryId)     constraints.push(where('categoryId', '==', opts.categoryId));
  if (opts.subcategoryId)  constraints.push(where('subcategoryId', '==', opts.subcategoryId));
  if (opts.brandId)        constraints.push(where('brandId', '==', opts.brandId));
  if (opts.isFeatured)     constraints.push(where('isFeatured', '==', true));
  if (opts.isBestSeller)   constraints.push(where('isBestSeller', '==', true));
  if (opts.isNewArrival)   constraints.push(where('isNewArrival', '==', true));

  // Sorting
  switch (opts.sortBy) {
    case 'price-asc':     constraints.push(orderBy('salePrice', 'asc'));  break;
    case 'price-desc':    constraints.push(orderBy('salePrice', 'desc')); break;
    case 'best-selling':  constraints.push(orderBy('soldCount', 'desc')); break;
    case 'rating':        constraints.push(orderBy('rating', 'desc'));    break;
    case 'newest':
    default:              constraints.push(orderBy('createdAt', 'desc'));
  }

  if (opts.lastDoc) constraints.push(startAfter(opts.lastDoc));
  constraints.push(limit(opts.pageSize ?? 24));

  const snap = await getDocs(query(col, ...constraints));
  let products = snap.docs.map(mapDoc);

  // Client-side filters (Firestore can't do everything in one query)
  if (opts.searchTerm) {
    const term = opts.searchTerm.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.brandName?.toLowerCase().includes(term) ||
        p.sku?.toLowerCase().includes(term)
    );
  }
  if (opts.minPrice !== undefined) products = products.filter((p) => (p.salePrice ?? p.regularPrice) >= opts.minPrice!);
  if (opts.maxPrice !== undefined) products = products.filter((p) => (p.salePrice ?? p.regularPrice) <= opts.maxPrice!);
  if (opts.onSale) products = products.filter((p) => !!p.salePrice && p.salePrice < p.regularPrice);

  return { products, lastDoc: snap.docs[snap.docs.length - 1] ?? null };
}

// ---------- SINGLE PRODUCT ----------
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const snap = await getDocs(query(col, where('slug', '==', slug), limit(1)));
  if (snap.empty) return null;
  return mapDoc(snap.docs[0]);
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, 'products', id));
  return snap.exists() ? { id: snap.id, ...(snap.data() as any) } : null;
}

// ---------- RELATED ----------
export async function getRelatedProducts(p: Product, n = 8): Promise<Product[]> {
  const snap = await getDocs(query(
    col,
    where('isActive', '==', true),
    where('categoryId', '==', p.categoryId || ''),
    orderBy('createdAt', 'desc'),
    limit(n + 1)
  ));
  return snap.docs
    .map(mapDoc)
    .filter((x) => x.id !== p.id)
    .slice(0, n);
}

// ---------- HOMEPAGE SECTIONS ----------
export async function getFeaturedProducts(n = 8) {
  return (await getProducts({ isFeatured: true, sortBy: 'newest', pageSize: n })).products;
}

export async function getNewArrivals(n = 8) {
  return (await getProducts({ sortBy: 'newest', pageSize: n })).products;
}

export async function getBestSellers(n = 8) {
  return (await getProducts({ sortBy: 'best-selling', pageSize: n })).products;
}

export async function getDiscountedProducts(n = 8) {
  const { products } = await getProducts({ sortBy: 'newest', pageSize: n * 3 });
  return products.filter((p) => p.salePrice && p.salePrice < p.regularPrice).slice(0, n);
}

export async function getUnderPrice(maxPrice: number, n = 8) {
  const { products } = await getProducts({ sortBy: 'newest', pageSize: n * 3 });
  return products
    .filter((p) => (p.salePrice ?? p.regularPrice) <= maxPrice)
    .slice(0, n);
}

// ---------- SEARCH / FILTER HELPERS ----------
export async function getAllActiveProducts(limitNum = 500): Promise<Product[]> {
  const snap = await getDocs(query(col, where('isActive', '==', true), limit(limitNum)));
  return snap.docs.map(mapDoc);
}

// ---------- VIEW COUNT ----------
import { updateDoc, increment } from 'firebase/firestore';
export async function incrementProductView(id: string) {
  try {
    await updateDoc(doc(db, 'products', id), { viewCount: increment(1) });
  } catch {}
}