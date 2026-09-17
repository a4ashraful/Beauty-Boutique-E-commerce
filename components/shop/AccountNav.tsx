'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';

const items = [
  { href: '/account', label: 'Profile', icon: User, exact: true },
  { href: '/account/orders', label: 'My Orders', icon: Package },
  { href: '/account/addresses', label: 'Addresses', icon: MapPin },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
];

export function AccountNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="flex flex-col gap-1">
      {items.map((it) => {
        const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition',
              active
                ? 'bg-rose-50 text-rose-700 border-l-4 border-rose-600'
                : 'text-gray-700 hover:bg-gray-50'
            )}
          >
            <it.icon size={16} />
            {it.label}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 text-left"
      >
        <LogOut size={16} />
        Logout
      </button>
    </nav>
  );
}