import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { SITE } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Premium Cosmetics & Beauty Products in Bangladesh`,
    template: `%s | ${SITE.name}`,
  },
  description:
    'Shop authentic skincare, makeup, haircare and beauty products in Bangladesh. Cash on Delivery, bKash, Nagad available.',
  keywords: ['cosmetics', 'beauty', 'skincare', 'makeup', 'Bangladesh', 'beauty boutique'],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'en_BD',
    url: SITE.url,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#e11d48',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}