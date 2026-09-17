'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  Menu, ShoppingBag, Heart, User, Phone, MapPin, ChevronDown, LogOut,
} from 'lucide-react';
import { Sparkles } from 'lucide-react';

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <span className="h-9 w-9 rounded-full bg-rose-600 text-white flex items-center justify-center">
        <Sparkles size={18} />
      </span>
      {!compact && (
        <div className="leading-tight">
          <p className="font-display font-bold text-gray-900 text-[15px]">
            Beauty Boutique
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-rose-600 font-medium">
            By Tandra
          </p>
        </div>
      )}
    </Link>
  );
}
import { SearchBar } from './SearchBar';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { SITE } from '@/lib/constants';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { CartDrawer } from './CartDrawer';

const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Skincare', href: '/category/skincare' },
  { label: 'Makeup', href: '/category/makeup' },
  { label: 'Hair Care', href: '/category/hair-care' },
  { label: 'Brands', href: '/brands' },
  { label: 'Track Order', href: '/track-order' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const itemCount = useCart((s) => s.itemCount());
  const wishCount = useWishlist((s) => s.ids.length);
  const { user, profile } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-rose-600 text-white text-xs">
        <div className="container-shop flex h-9 items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-1">
              <Phone size={12} /> {SITE.supportPhone}
            </span>
            <span className="hidden md:flex items-center gap-1">
              <MapPin size={12} /> Dhaka, Bangladesh
            </span>
          </div>
          <p className="text-center flex-1 md:flex-none font-medium">
            🚚 Free delivery inside Dhaka on orders over ৳1500
          </p>
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/pages/delivery">Delivery Info</Link>
            <Link href="/track-order">Track Order</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
        <div className="container-shop flex h-16 items-center gap-4">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button className="lg:hidden p-2 -ml-2" aria-label="Menu">
                <Menu size={22} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:max-w-sm p-0">
              <div className="p-4 border-b">
                <Logo />
              </div>
              <div className="p-4">
                <SearchBar mobile />
              </div>
              <nav className="px-2">
                {NAV.map((n) => (
                  <SheetClose asChild key={n.href}>
                    <Link
                      href={n.href}
                      className="block rounded-lg px-3 py-3 text-sm font-medium text-gray-800 hover:bg-rose-50 hover:text-rose-700"
                    >
                      {n.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="border-t mt-4 p-4 space-y-3 text-sm">
                {user ? (
                  <>
                    <Link href="/account" className="block font-medium">My Account</Link>
                    <Link href="/account/orders" className="block">My Orders</Link>
                    <button
                      onClick={handleLogout}
                      className="text-rose-600 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block font-medium">Login</Link>
                    <Link href="/register" className="block">Create Account</Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>

          <Logo />
          <SearchBar />

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2 rounded-full hover:bg-rose-50 text-gray-700"
            >
              <Heart size={20} />
              {wishCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-rose-600 text-[10px] text-white flex items-center justify-center font-medium">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <CartDrawer>
              <button
                aria-label="Cart"
                className="relative p-2 rounded-full hover:bg-rose-50 text-gray-700"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-rose-600 text-[10px] text-white flex items-center justify-center font-medium">
                    {itemCount}
                  </span>
                )}
              </button>
            </CartDrawer>

            {/* Account */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:flex items-center gap-1 p-2 rounded-full hover:bg-rose-50">
                    <User size={20} />
                    <ChevronDown size={14} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    Hi, {profile?.name || user.email?.split('@')[0]}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-rose-600">
                    <LogOut size={14} className="mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="hidden sm:inline-flex h-9 items-center rounded-full bg-rose-600 px-4 text-sm font-medium text-white hover:bg-rose-700"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:block border-t border-gray-100">
          <div className="container-shop flex items-center gap-1 h-11">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-rose-600"
              >
                {n.label}
              </Link>
            ))}
            <Link
              href="/shop?sale=1"
              className="ml-auto px-3 py-2 text-sm font-semibold text-rose-600"
            >
              🔥 Hot Deals
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
