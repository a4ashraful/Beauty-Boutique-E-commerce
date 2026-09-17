import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: `${SITE.name} — Premium Cosmetics & Beauty Products in Bangladesh`,
  description:
    'Shop authentic skincare, makeup, hair care, and body care products. Cash on delivery, bKash & Nagad accepted. Fast delivery nationwide.',
  openGraph: {
    title: SITE.name,
    description: 'Authentic beauty products delivered across Bangladesh.',
    url: SITE.url,
    siteName: SITE.name,
    type: 'website',
  },
  alternates: { canonical: '/' },
};