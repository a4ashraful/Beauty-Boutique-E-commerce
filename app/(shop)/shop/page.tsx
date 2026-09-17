import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ShopClient } from './ShopClient';
import { ProductGridSkeleton } from '@/components/shop/ProductCardSkeleton';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Shop All Beauty Products',
  description:
    'Browse our complete collection of skincare, makeup, hair care and beauty products in Bangladesh.',
  alternates: { canonical: '/shop' },
};

export default function ShopPage() {
  return (
    <div className="container-shop py-4">
      <Breadcrumbs items={[{ label: 'Shop' }]} />
      <Suspense fallback={<div className="py-10"><ProductGridSkeleton count={12} /></div>}>
        <ShopClient />
      </Suspense>
    </div>
  );
}
