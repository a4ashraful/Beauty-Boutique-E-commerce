import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Heart, ShieldCheck, Users } from 'lucide-react';
import { SITE } from '@/lib/constants';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About Us',
  description: `Learn about ${SITE.name} — Bangladesh's trusted online beauty store.`,
  alternates: { canonical: '/pages/about' },
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'About Us' }]} />
      <div className="max-w-3xl mx-auto mt-8">
        <div className="text-center">
          <span className="mx-auto h-14 w-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <Sparkles size={22} />
          </span>
          <h1 className="mt-4 font-display text-3xl sm:text-4xl font-bold">Our Story</h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-rose-500 mx-auto" />
        </div>

        <div className="mt-10 space-y-5 text-gray-700 leading-relaxed">
          <p>
            <strong>{SITE.name}</strong> was born from a simple belief — that
            every person in Bangladesh deserves access to authentic, high-quality
            beauty products without the hassle of unreliable sources or inflated
            prices.
          </p>
          <p>
            We curate skincare, makeup, hair care and body care products from
            trusted global and local brands. Every item in our catalog is
            sourced through verified channels so you can shop with confidence.
          </p>
          <p>
            Our team of beauty enthusiasts personally tests the products we
            recommend — because you deserve honest advice, not just a sales pitch.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: ShieldCheck, title: '100% Authentic', desc: 'Verified sources only' },
            { icon: Heart,       title: 'Made with Love', desc: 'Curated by beauty experts' },
            { icon: Users,       title: '10,000+ Customers', desc: 'Trusted across Bangladesh' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border bg-white p-5 text-center">
              <span className="mx-auto h-11 w-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <f.icon size={18} />
              </span>
              <p className="mt-3 font-semibold text-sm">{f.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-flex rounded-full bg-rose-600 px-6 py-3 text-white text-sm font-medium hover:bg-rose-700"
          >
            Explore Our Products
          </Link>
        </div>
      </div>
    </>
  );
}
