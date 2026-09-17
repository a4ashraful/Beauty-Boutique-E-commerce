'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { AdminMobileSheet } from '@/components/admin/AdminMobileSheet';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Login page is public
  if (isLogin) return <>{children}</>;

  return <AdminShell
    collapsed={collapsed}
    onToggleCollapse={() => setCollapsed((c) => !c)}
    mobileOpen={mobileOpen}
    onOpenMobile={() => setMobileOpen(true)}
    onCloseMobile={() => setMobileOpen(false)}
  >{children}</AdminShell>;
}

function AdminShell({
  children, collapsed, onToggleCollapse,
  mobileOpen, onOpenMobile, onCloseMobile,
}: {
  children: React.ReactNode;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onOpenMobile: () => void;
  onCloseMobile: () => void;
}) {
  const { loading } = useAdminGuard();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-rose-600" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar collapsed={collapsed} onToggle={onToggleCollapse} />
      <AdminMobileSheet open={mobileOpen} onClose={onCloseMobile} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar onMobileMenu={onOpenMobile} />
        <main className="flex-1 p-4 lg:p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}