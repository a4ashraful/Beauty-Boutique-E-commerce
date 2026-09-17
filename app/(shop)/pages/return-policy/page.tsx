import type { Metadata } from 'next';
import { RotateCcw, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Return & Refund Policy',
  description: 'Our 7-day return policy and refund process.',
  alternates: { canonical: '/pages/return-policy' },
};

export default function ReturnPolicyPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Return & Refund Policy' }]} />
      <div className="max-w-3xl mx-auto mt-8">
        <div className="text-center mb-8">
          <span className="mx-auto h-14 w-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <RotateCcw size={22} />
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold">Return & Refund Policy</h1>
          <p className="mt-2 text-sm text-gray-500">
            We want you to be 100% happy with your purchase.
          </p>
        </div>

        <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-600" /> Eligible for Return
            </h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Request made within 7 days of delivery</li>
              <li>Product unopened, unused, seals intact</li>
              <li>Original packaging and invoice available</li>
              <li>Received wrong, damaged or expired product</li>
            </ul>
          </section>

          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold text-base flex items-center gap-2">
              <XCircle size={16} className="text-red-600" /> Not Eligible
            </h2>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Opened, swatched, or used cosmetics</li>
              <li>Products with broken seals or missing packaging</li>
              <li>Free gifts, samples or promotional items</li>
              <li>Returns requested after 7 days</li>
              <li>Intimate/personal care items once opened</li>
            </ul>
          </section>

          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold text-base">How to request a return</h2>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>
                Call or WhatsApp us at{' '}
                <strong>{SITE.supportPhone}</strong> within 7 days of delivery.
              </li>
              <li>Provide your Order Number and reason for return.</li>
              <li>Send photos of the product (unopened, in original packaging).</li>
              <li>Our team will approve/reject within 24 hours.</li>
              <li>If approved, we'll arrange a pickup or ask you to ship it back.</li>
            </ol>
          </section>

          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold text-base">Refund Method</h2>
            <p className="mt-2">
              Once we receive the returned item and verify its condition, we'll
              refund the amount within <strong>3–7 working days</strong> via your
              original payment method. For Cash on Delivery orders, we refund
              via bKash or bank transfer.
            </p>
          </section>

          <section className="rounded-xl border bg-yellow-50 border-yellow-200 p-5 flex gap-3">
            <AlertCircle className="text-yellow-700 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-yellow-800">
              Delivery charges are non-refundable unless the return is due to our
              error (wrong/damaged item). Return shipping costs may apply.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
