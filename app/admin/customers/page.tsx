'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Loader2, Users, Eye, ShoppingBag } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { formatBDT, formatDate } from '@/lib/utils';
import type { Order, UserProfile } from '@/types';

export default function AdminCustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<UserProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [cSnap, oSnap] = await Promise.all([
          getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'))),
          getDocs(collection(db, 'orders')),
        ]);
        setCustomers(cSnap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) })));
        setOrders(oSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // pre-compute spending per customer
  const statsMap = useMemo(() => {
    const map: Record<string, { total: number; count: number; last?: any; lastDate?: any }> = {};
    orders.forEach((o) => {
      if (!o.customerId) return;
      if (!map[o.customerId]) map[o.customerId] = { total: 0, count: 0 };
      map[o.customerId].total += o.total;
      map[o.customerId].count += 1;
      const t = o.createdAt?.seconds || 0;
      if (!map[o.customerId].last || t > map[o.customerId].last) {
        map[o.customerId].last = t;
        map[o.customerId].lastDate = o.createdAt;
      }
    });
    return map;
  }, [orders]);

  const filtered = useMemo(() => {
    if (!search.trim()) return customers;
    const t = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(t) ||
        c.email?.toLowerCase().includes(t) ||
        c.phone?.includes(t)
    );
  }, [customers, search]);

  return (
    <div>
      <AdminPageHeader
        title="Customers"
        subtitle={`${customers.length} total`}
      />

      <div className="relative max-w-md mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone…"
          className="pl-9"
        />
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-rose-600" size={24} />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            <Users size={20} className="mx-auto text-gray-300 mb-2" />
            No customers yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left hidden md:table-cell">Joined</th>
                  <th className="p-3 text-left">Orders</th>
                  <th className="p-3 text-left">Spent</th>
                  <th className="p-3 text-left hidden lg:table-cell">Last Order</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((c) => {
                  const st = statsMap[c.uid] || { total: 0, count: 0 };
                  return (
                    <tr key={c.uid} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <span className="h-9 w-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-sm font-semibold shrink-0">
                            {c.name?.[0]?.toUpperCase() || c.email?.[0]?.toUpperCase() || '?'}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{c.name || '—'}</p>
                            <p className="text-xs text-gray-500 truncate">{c.email}</p>
                          </div>
                          {c.role === 'admin' && (
                            <Badge variant="info" className="text-[10px]">Admin</Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell text-xs text-gray-500">
                        {formatDate(c.createdAt)}
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-sm">
                          <ShoppingBag size={12} className="text-gray-400" /> {st.count}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-rose-600">
                        {formatBDT(st.total)}
                      </td>
                      <td className="p-3 hidden lg:table-cell text-xs text-gray-500">
                        {(st as any).lastDate ? formatDate((st as any).lastDate) : '—'}
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/admin/customers/${c.uid}`}
                          className="inline-flex p-1.5 rounded hover:bg-gray-100 text-gray-600"
                        >
                          <Eye size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
