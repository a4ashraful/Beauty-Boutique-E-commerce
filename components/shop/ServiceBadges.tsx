import { Truck, ShieldCheck, BadgeCheck, Headphones } from 'lucide-react';

const items = [
  { icon: Truck,        title: 'Free Delivery',   desc: 'On orders ৳1500+' },
  { icon: BadgeCheck,   title: '100% Authentic',  desc: 'Verified suppliers' },
  { icon: ShieldCheck,  title: 'Safe Payment',    desc: 'COD & manual verify' },
  { icon: Headphones,   title: '24/7 Support',    desc: 'Always here to help' },
];

export function ServiceBadges() {
  return (
    <section className="border-y border-gray-100 bg-white">
      <div className="container-shop py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((it) => (
          <div key={it.title} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <it.icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-900">{it.title}</p>
              <p className="text-[11px] sm:text-xs text-gray-500 truncate">{it.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}