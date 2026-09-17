'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './useAuth';

export function useAdminGuard() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (profile?.role !== 'admin') {
      router.replace('/admin/login?error=not-admin');
      return;
    }
    setChecking(false);
  }, [loading, user, profile, router, pathname]);

  return { user, profile, loading: loading || checking };
}
