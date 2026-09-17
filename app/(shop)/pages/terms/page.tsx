import type { Metadata } from 'next';
import { FileText } from 'lucide-react';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms governing your use of our website and services.',
  alternates: { canonical: '/pages/terms' },
};

export default function TermsPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />
      <div className="max-w-3xl mx-auto mt-8">
        <div className="text-center mb-8">
          <span className="mx-auto h-14 w-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <FileText size={22} />
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold">Terms & Conditions</h1>
          <p className="mt-2 text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-5">
          <p>
            Welcome to <strong>{SITE.name}</strong>. By accessing or purchasing
            from our website, you agree to the following terms.
          </p>

          <section>
            <h2 className="font-display text-lg font-bold text-gray-900">1. Account & Orders</h2>
            <p className="text-sm">
              You're responsible for keeping your account credentials secure.
              We reserve the right to cancel any order that appears fraudulent
              or has inaccurate information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-gray-900">2. Pricing</h2>
            <p className="text-sm">
              All prices are in Bangladeshi Taka (৳). We may change prices
              without prior notice. In case of a pricing error, we may cancel
              the order and issue a full refund.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-gray-900">3. Payment</h2>
            <p className="text-sm">
              We accept Cash on Delivery, bKash, Nagad and Bank Transfer.
              bKash/Nagad/Bank orders are only processed after our team manually
              verifies your submitted Transaction ID. Fake or invalid reference
              numbers will result in cancellation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-gray-900">4. Delivery</h2>
            <p className="text-sm">
              Estimated delivery times are not guaranteed. Delays may occur due
              to weather, strikes or courier issues. Risk passes to you once the
              courier marks the order as delivered.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-gray-900">5. Returns</h2>
            <p className="text-sm">
              Returns are subject to our Return & Refund Policy. Items must be
              unopened and in original packaging within 7 days of delivery.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-gray-900">6. Product Information</h2>
            <p className="text-sm">
              We strive for accuracy but do not warrant that product
              descriptions, images or colors are 100% accurate. If you have
              allergies or skin conditions, consult a dermatologist before use.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-gray-900">7. Intellectual Property</h2>
            <p className="text-sm">
              All content (logos, images, text) on this site is our property or
              used with permission and may not be copied without consent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-gray-900">8. Limitation of Liability</h2>
            <p className="text-sm">
              Our liability is limited to the value of the product(s) purchased.
              We are not liable for indirect, consequential or incidental
              damages.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-gray-900">9. Governing Law</h2>
            <p className="text-sm">
              These terms are governed by the laws of Bangladesh.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-bold text-gray-900">10. Contact</h2>
            <p className="text-sm">
              Questions? Email{' '}
              <a href={`mailto:${SITE.supportEmail}`} className="text-rose-600">
                {SITE.supportEmail}
              </a>{' '}
              or call {SITE.supportPhone}.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
