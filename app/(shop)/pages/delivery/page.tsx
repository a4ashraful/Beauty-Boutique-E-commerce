import type { Metadata } from 'next';
import { Truck, Clock, MapPin, Wallet } from 'lucide-react';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Delivery Information',
  description: 'Delivery times, charges and areas we cover.',
  alternates: { canonical: '/pages/delivery' },
};

export default function DeliveryPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: 'Delivery Information' }]} />
      <div className="max-w-3xl mx-auto mt-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold">Delivery Information</h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-rose-500 mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl border bg-white p-5">
            <Truck size={20} className="text-rose-600" />
            <p className="mt-2 font-semibold text-sm">Nationwide Delivery</p>
            <p className="text-xs text-gray-500 mt-1">
              We deliver to all 64 districts in Bangladesh.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <Clock size={20} className="text-rose-600" />
            <p className="mt-2 font-semibold text-sm">Fast Turnaround</p>
            <p className="text-xs text-gray-500 mt-1">
              Inside Dhaka: 1–2 days · Outside: 2–4 days
            </p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <Wallet size={20} className="text-rose-600" />
            <p className="mt-2 font-semibold text-sm">Charges</p>
            <p className="text-xs text-gray-500 mt-1">
              Inside Dhaka ৳60 · Outside ৳120
            </p>
            <p className="text-xs text-green-600 mt-1 font-medium">
              Free inside Dhaka on orders ৳1500+
            </p>
          </div>
          <div className="rounded-xl border bg-white p-5">
            <MapPin size={20} className="text-rose-600" />
            <p className="mt-2 font-semibold text-sm">Order Tracking</p>
            <p className="text-xs text-gray-500 mt-1">
              Track anytime from our Track Order page.
            </p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
          <h2 className="font-display text-xl font-bold text-gray-900">How it works</h2>
          <ol className="list-decimal pl-6 space-y-2 text-sm">
            <li>You place your order on our website.</li>
            <li>Our team verifies the order (and payment if bKash/Nagad/Bank).</li>
            <li>We pack your order with care and hand it to our courier.</li>
            <li>You receive an SMS/phone confirmation with tracking info.</li>
            <li>Courier delivers to your doorstep.</li>
          </ol>

          <h2 className="font-display text-xl font-bold text-gray-900 mt-6">
            Areas we serve
          </h2>
          <p className="text-sm">
            All 8 divisions of Bangladesh — Dhaka, Chattogram, Rajshahi, Khulna,
            Barishal, Sylhet, Rangpur and Mymensingh. Delivery to remote areas
            may take an extra day.
          </p>

          <h2 className="font-display text-xl font-bold text-gray-900 mt-6">
            Delays
          </h2>
          <p className="text-sm">
            During Eid, Puja, or heavy rain, delivery may take longer than
            usual. We'll notify you via SMS if there's any delay.
          </p>
        </div>
      </div>
    </>
  );
}
