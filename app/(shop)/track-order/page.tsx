import { Suspense } from 'react';
import type { Metadata } from 'next';
import { TrackOrderClient } from './TrackOrderClient';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description:
    'Track your Beauty Boutique By Tandra order status in real time. Enter your order number and phone number.',
  alternates: { canonical: '/track-order' },
};

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="container-shop py-20 text-center text-gray-500">Loading…</div>}>
      <TrackOrderClient />
    </Suspense>
  );
}
