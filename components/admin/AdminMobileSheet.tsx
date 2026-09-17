'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderTree, Award, ShoppingCart, Users,
  Ticket, Image as ImageIcon, Star, MapPin, CreditCard, Settings, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/brands', label: 'Brands', icon: Award },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/delivery-zones', label: 'Delivery Zones', icon: MapPin },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminMobileSheet({
  open, onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  if (!open) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <aside className="relative w-72 bg-gray-900 text-gray-300 flex flex-col">
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
          <p className="text-white font-bold text-sm">Beauty Boutique</p>
          <button onClick={onClose} className="p-1">
            <X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {NAV.map((it) => {
            const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 my-0.5 text-sm font-medium',
                  active
                    ? 'bg-rose-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )}
              >
                <it.icon size={18} />
                {it.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}