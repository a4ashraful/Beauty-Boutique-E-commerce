'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getUserOrders } from '@/lib/firestore/orders';
import {
  formatBDT, formatDate, ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL,
} from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import type { Order } from '@/types';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const list = await getUserOrders(user.uid);
        setOrders(list);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-rose-600" size={24} />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="When you place your first order it will appear here."
        actionText="Start Shopping"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">My Orders</h1>

      {orders.map((o) => (
        <Link
          key={o.id}
          href={`/account/orders/${o.id}`}
          className="block rounded-xl border bg-white p-4 hover:border-rose-300 transition"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-mono text-sm font-semibold text-rose-600">
                {o.orderNumber}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(o.createdAt)} · {o.items.length} item{o.items.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  o.status === 'delivered'
                    ? 'success'
                    : o.status === 'cancelled'
                    ? 'danger'
                    : 'warning'
                }
              >
                {ORDER_STATUS_LABEL[o.status]}
              </Badge>
              <Badge variant={o.paymentStatus === 'paid' ? 'success' : 'secondary'}>
                {PAYMENT_STATUS_LABEL[o.paymentStatus]}
              </Badge>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Deliver to: {o.area}, {o.district}
            </p>
            <p className="font-semibold text-sm">{formatBDT(o.total)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
