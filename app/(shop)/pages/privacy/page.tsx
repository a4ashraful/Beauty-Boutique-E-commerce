import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How we collect, use and protect your personal information.',
  alternates: { canonical: '/pages/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />
      <div className="max-w-3xl mx-auto mt-8">
        <div className="text-center mb-8">
          <span className="mx-auto h-14 w-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <ShieldCheck size={22} />
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-5">
          <p>
            At <strong>{SITE.name}</strong>, we respect your privacy and are
            committed to protecting your personal information. This policy
            explains what we collect, why, and how we keep it safe.
          </p>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Information we collect
            </h2>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>Name, phone number, email (if provided)</li>
              <li>Delivery address (division, district, area, full address)</li>
              <li>Order and payment reference information</li>
              <li>Account login credentials (email + encrypted password)</li>
              <li>Basic browser/device information for analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              How we use your information
            </h2>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
              <li>To process and deliver your orders</li>
              <li>To contact you about order status</li>
              <li>To improve our products and services</li>
              <li>To send offers/promotions (only if you subscribe)</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              What we don&apos;t do
            </h2>
            <p className="text-sm">
              We never sell, rent or trade your personal information to third
              parties for their marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Data security
            </h2>
            <p className="text-sm">
              We use industry-standard encryption (HTTPS/SSL), secure Firebase
              Firestore database rules, and hashed passwords. Payment reference
              numbers are stored only as needed to process your order.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Cookies
            </h2>
            <p className="text-sm">
              We use essential cookies for cart persistence and optional
              analytics cookies (Google Analytics, Meta Pixel). You can disable
              cookies in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Your rights
            </h2>
            <p className="text-sm">
              You may request access, correction or deletion of your personal
              data at any time by emailing{' '}
              <a href={`mailto:${SITE.supportEmail}`} className="text-rose-600">
                {SITE.supportEmail}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-gray-900">
              Contact
            </h2>
            <p className="text-sm">
              For privacy-related questions, contact us at{' '}
              <a href={`mailto:${SITE.supportEmail}`} className="text-rose-600">
                {SITE.supportEmail}
              </a>{' '}
              or {SITE.supportPhone}.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
