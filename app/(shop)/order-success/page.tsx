import Link from 'next/link';
import type { Metadata } from 'next';
import { CheckCircle2, Package, Phone, MessageCircle } from 'lucide-react';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Order Placed Successfully',
  robots: { index: false, follow: false },
};

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  const orderNumber = searchParams.order || '';

  return (
    <div className="container-shop py-14">
      <div className="max-w-xl mx-auto text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={44} className="text-green-600" />
        </div>

        <h1 className="mt-6 font-display text-3xl font-bold text-gray-900">
          Thank You! 🎉
        </h1>
        <p className="mt-2 text-gray-600">
          Your order has been placed successfully.
        </p>

        {orderNumber && (
          <div className="mt-6 rounded-xl border bg-rose-50/60 p-5">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Order Number
            </p>
            <p className="text-2xl font-bold text-rose-600 mt-1 font-mono">
              {orderNumber}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Save this number to track your order.
            </p>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="rounded-xl border p-4">
            <Package size={20} className="text-rose-500" />
            <p className="mt-2 text-sm font-medium">What happens next?</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Our team will verify your order and payment (if manual).
              You'll receive a confirmation call within 2–4 hours.
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <Phone size={20} className="text-rose-500" />
            <p className="mt-2 text-sm font-medium">Need help?</p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Call or WhatsApp us at{' '}
              <a href={`tel:${SITE.supportPhone}`} className="text-rose-600 font-medium">
                {SITE.supportPhone}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {orderNumber && (
            <Link
              href={`/track-order?order=${orderNumber}`}
              className="inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 px-6"
            >
              <Package size={16} /> Track Order
            </Link>
          )}
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 h-11 rounded-lg border text-sm font-medium hover:bg-gray-50 px-6"
          >
            Continue Shopping
          </Link>
          {SITE.whatsapp && (
            <a
              href={`https://wa.me/${SITE.whatsapp}?text=Hi,%20I%20just%20placed%20order%20${orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 rounded-lg border text-sm font-medium hover:bg-gray-50 px-6"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
