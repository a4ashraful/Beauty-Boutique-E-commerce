'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, FolderTree, Award, ShoppingCart, Users,
  Ticket, Image as ImageIcon, Star, MapPin, CreditCard, Settings,
  ChevronLeft, Sparkles,
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
  { href: '/admin/payments', label: 'Payment Settings', icon: CreditCard },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar({
  collapsed, onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-gray-900 text-gray-300 transition-all duration-200',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 h-16 px-4 border-b border-gray-800">
        <span className="h-8 w-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0">
          <Sparkles size={16} />
        </span>
        {!collapsed && (
          <div className="leading-tight min-w-0">
            <p className="text-white font-bold text-sm">Beauty Boutique</p>
            <p className="text-[10px] uppercase tracking-widest text-rose-400">Admin</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map((it) => {
          const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              title={collapsed ? it.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 my-0.5 text-sm font-medium transition',
                active
                  ? 'bg-rose-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <it.icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{it.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800 p-2">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-gray-400 hover:bg-gray-800 hover:text-white"
        >
          <ChevronLeft
            size={14}
            className={cn('transition-transform', collapsed && 'rotate-180')}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}