'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Loader2, Eye, Download, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { getAllOrders } from '@/lib/firestore/adminOrders';
import {
  formatBDT, formatDateTime, PAYMENT_METHOD_LABEL, ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
} from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Order } from '@/types';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'out_for_delivery', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
];

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setOrders(await getAllOrders());
      } catch (e: any) {
        toast.error(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: orders.length };
    orders.forEach((o) => {
      map[o.status] = (map[o.status] || 0) + 1;
    });
    return map;
  }, [orders]);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (tab !== 'all') list = list.filter((o) => o.status === tab);
    if (search.trim()) {
      const t = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(t) ||
          o.customerName.toLowerCase().includes(t) ||
          o.phone.includes(t) ||
          (o.email || '').toLowerCase().includes(t)
      );
    }
    return list;
  }, [orders, tab, search]);

  const exportCSV = () => {
    const rows = [
      ['Order #', 'Date', 'Customer', 'Phone', 'Total', 'Payment', 'Status'],
      ...filtered.map((o) => [
        o.orderNumber,
        formatDateTime(o.createdAt),
        o.customerName,
        o.phone,
        String(o.total),
        PAYMENT_METHOD_LABEL[o.paymentMethod],
        ORDER_STATUS_LABEL[o.status],
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <AdminPageHeader
        title="Orders"
        subtitle={`${orders.length} total · ${counts.pending || 0} pending`}
        action={
          <Button variant="outline" onClick={exportCSV} disabled={!filtered.length}>
            <Download size={14} /> Export CSV
          </Button>
        }
      />

      {/* Tabs */}
      <div className="mb-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 min-w-max">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 h-9 rounded-full text-sm font-medium whitespace-nowrap transition ${
                tab === t.id
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border text-gray-700 hover:border-rose-300'
              }`}
            >
              {t.label}
              <span className={`ml-1.5 text-xs ${tab === t.id ? 'text-white/80' : 'text-gray-400'}`}>
                {counts[t.id] || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order #, customer, phone, email…"
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-rose-600" size={24} />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            <Filter size={20} className="mx-auto text-gray-300 mb-2" />
            No orders found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="p-3 text-left">Order #</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left hidden md:table-cell">Date</th>
                  <th className="p-3 text-left hidden lg:table-cell">Payment</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="font-mono text-xs font-semibold text-rose-600 hover:underline"
                      >
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="p-3">
                      <p className="font-medium truncate max-w-[180px]">{o.customerName}</p>
                      <p className="text-xs text-gray-500">{o.phone}</p>
                    </td>
                    <td className="p-3 hidden md:table-cell text-xs text-gray-500">
                      {formatDateTime(o.createdAt)}
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      <div className="flex flex-col gap-0.5 text-xs">
                        <span className="font-medium">{PAYMENT_METHOD_LABEL[o.paymentMethod]}</span>
                        <Badge
                          variant={o.paymentStatus === 'paid' ? 'success' : 'warning'}
                          className="text-[10px] w-fit"
                        >
                          {PAYMENT_STATUS_LABEL[o.paymentStatus]}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-3 font-semibold">{formatBDT(o.total)}</td>
                    <td className="p-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="inline-flex p-1.5 rounded hover:bg-gray-100 text-gray-600"
                        title="View"
                      >
                        <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
