'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';
import { AccountNav } from '@/components/shop/AccountNav';
import { Breadcrumbs } from '@/components/shop/Breadcrumbs';
import { Loader2 } from 'lucide-react';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading } = useRequireAuth();

  if (loading) {
    return (
      <div className="container-shop py-20 flex items-center justify-center">
        <Loader2 className="animate-spin text-rose-600" size={28} />
      </div>
    );
  }

  return (
    <div className="container-shop py-6">
      <Breadcrumbs items={[{ label: 'My Account' }]} />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside className="lg:sticky lg:top-32 h-fit rounded-xl border bg-white p-2">
          <AccountNav />
        </aside>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
