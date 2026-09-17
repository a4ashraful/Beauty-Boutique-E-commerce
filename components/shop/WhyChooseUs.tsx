import { ShieldCheck, Truck, Sparkles, Headphones, BadgeCheck, RotateCcw } from 'lucide-react';

const items = [
  {
    icon: BadgeCheck,
    title: '100% Authentic',
    desc: 'Every product is sourced from authorized suppliers.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Same-day inside Dhaka, 2–4 days nationwide.',
  },
  {
    icon: ShieldCheck,
    title: 'Cash on Delivery',
    desc: 'Pay when you receive. No risk, no fuss.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    desc: '7-day return policy on eligible items.',
  },
  {
    icon: Sparkles,
    title: 'Handpicked Products',
    desc: 'Curated by beauty experts for every skin type.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Support',
    desc: 'Reach us via WhatsApp, call, or Facebook.',
  },
];

export function WhyChooseUs() {
  return (
    <section className="bg-rose-50/50 py-14 my-10">
      <div className="container-shop">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">
            Why Choose Us
          </h2>
          <p className="mt-2 text-sm text-gray-500 max-w-xl mx-auto">
            We're not just another online store — we're your beauty partner.
          </p>
          <div className="mt-3 h-1 w-16 rounded-full bg-rose-500 mx-auto" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((it) => (
            <div
              key={it.title}
              className="rounded-xl bg-white p-5 border border-rose-100 hover:shadow-md transition"
            >
              <div className="h-11 w-11 rounded-full bg-rose-600 text-white flex items-center justify-center">
                <it.icon size={20} />
              </div>
              <h3 className="mt-4 font-semibold text-sm">{it.title}</h3>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}