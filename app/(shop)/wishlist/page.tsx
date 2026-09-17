import type { Metadata } from 'next';
import { WishlistClient } from './WishlistClient';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';

export const metadata: Metadata = {
  title: 'My Wishlist',
  description: 'Your saved beauty products.',
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <div className="container-shop py-6">
      <Breadcrumbs items={[{ label: 'Wishlist' }]} />
      <h1 className="font-display text-2xl sm:text-3xl font-bold mt-6 mb-6">My Wishlist</h1>
      <WishlistClient />
    </div>
  );
}
