'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, Store, LogOut, Bell, User } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/hooks/useAuthActions';

export function AdminTopbar({ onMobileMenu }: { onMobileMenu: () => void }) {
  const { profile } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <header className="h-16 bg-white border-b flex items-center gap-3 px-4 lg:px-6">
      <button
        onClick={onMobileMenu}
        className="lg:hidden p-2 -ml-2"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1">
        <p className="text-sm text-gray-500 hidden sm:block">Welcome back,</p>
        <p className="text-sm font-semibold text-gray-900">
          {profile?.name || 'Admin'}
        </p>
      </div>

      <Link
        href="/"
        target="_blank"
        className="hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-lg border text-sm hover:bg-gray-50"
      >
        <Store size={14} /> View Store
      </Link>

      <button className="relative p-2 rounded-full hover:bg-gray-100" aria-label="Notifications">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-600" />
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100">
            <span className="h-8 w-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-semibold text-sm">
              {profile?.name?.[0]?.toUpperCase() || 'A'}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>{profile?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/account">
              <User size={14} className="mr-2" /> My Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-rose-600">
            <LogOut size={14} className="mr-2" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}