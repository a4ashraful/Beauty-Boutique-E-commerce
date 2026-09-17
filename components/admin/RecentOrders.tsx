'use client';
import Link from 'next/link';
import { formatBDT, formatDate, ORDER_STATUS_LABEL } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types';

export function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <div className="rounded-xl border bg-white">
      <div className="flex items-center justify-between p-5 border-b">
        <h3 className="font-semibold">Recent Orders</h3>
        <Link href="/admin/orders" className="text-xs font-medium text-rose-600 hover:text-rose-700">
          View all →
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="p-8 text-sm text-gray-500 text-center">No orders yet.</p>
      ) : (
        <div className="divide-y">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}`}
              className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{o.customerName}</p>
                <p className="text-xs text-gray-500 font-mono">{o.orderNumber}</p>
              </div>
              <div className="hidden sm:block text-xs text-gray-500">
                {formatDate(o.createdAt)}
              </div>
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
              <p className="text-sm font-semibold text-rose-600">{formatBDT(o.total)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}