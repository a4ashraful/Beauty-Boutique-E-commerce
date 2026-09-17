'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Loader2, Package, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getOrderById } from '@/lib/firestore/orders';
import { OrderStatusTimeline } from '@/components/shop/OrderStatusTimeline';
import {
  formatBDT, formatDateTime, ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
} from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Order } from '@/types';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    (async () => {
      try {
        const o = await getOrderById(id);
        if (!o) {
          router.replace('/account/orders');
          return;
        }
        // simple ownership guard (Firestore rules also enforce)
        if (o.customerId && user && o.customerId !== user.uid) {
          router.replace('/account/orders');
          return;
        }
        setOrder(o);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user, authLoading, router]);

  const printInvoice = () => window.print();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-rose-600" size={24} />
      </div>
    );
  }
  if (!order) return null;

  return (
    <div className="space-y-5">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-rose-600"
      >
        <ArrowLeft size={14} /> Back to Orders
      </Link>

      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500">Order</p>
            <p className="font-mono text-xl font-bold text-rose-600">
              {order.orderNumber}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Placed {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Badge
              variant={
                order.status === 'delivered'
                  ? 'success'
                  : order.status === 'cancelled'
                  ? 'danger'
                  : 'warning'
              }
            >
              {ORDER_STATUS_LABEL[order.status]}
            </Badge>
            <Button variant="outline" size="sm" onClick={printInvoice}>
              <Download size={14} /> Invoice
            </Button>
          </div>
        </div>
      </div>

      <OrderStatusTimeline status={order.status} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-xl border bg-white p-5">
          <h3 className="font-semibold text-sm mb-3">Delivery Address</h3>
          <div className="text-sm space-y-1 text-gray-700">
            <p className="font-medium">{order.customerName}</p>
            <p>{order.phone}</p>
            {order.email && <p className="text-gray-500">{order.email}</p>}
            <p className="mt-1">
              {order.area}, {order.district}, {order.division}
            </p>
            <p className="text-gray-600">{order.address}</p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h3 className="font-semibold text-sm mb-3">Payment</h3>
          <div className="text-sm space-y-1.5">
            <Row label="Method" value={PAYMENT_METHOD_LABEL[order.paymentMethod]} />
            <Row
              label="Status"
              value={PAYMENT_STATUS_LABEL[order.paymentStatus]}
              valueClass={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}
            />
            {order.paymentReference && (
              <Row label="Reference" value={order.paymentReference} mono />
            )}
            {order.courier && <Row label="Courier" value={order.courier} />}
            {order.trackingNumber && <Row label="Tracking" value={order.trackingNumber} mono />}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-5">
        <h3 className="font-semibold text-sm mb-3">Items ({order.items.length})</h3>
        <div className="divide-y">
          {order.items.map((it, i) => (
            <div key={i} className="flex gap-3 py-3">
              <div className="relative h-14 w-14 shrink-0 rounded-md overflow-hidden bg-gray-50">
                {it.image && (
                  <Image src={it.image} alt={it.name} fill sizes="56px" className="object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2">{it.name}</p>
                {it.variantName && (
                  <p className="text-xs text-gray-500">{it.variantName}</p>
                )}
                <p className="text-xs text-gray-500 mt-0.5">
                  Qty {it.qty} × {formatBDT(it.price)}
                </p>
              </div>
              <span className="text-sm font-medium">{formatBDT(it.price * it.qty)}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t space-y-1.5 text-sm">
          <Row label="Subtotal" value={formatBDT(order.subtotal)} />
          {order.discount > 0 && (
            <Row
              label={`Discount ${order.couponCode ? `(${order.couponCode})` : ''}`}
              value={`−${formatBDT(order.discount)}`}
              valueClass="text-green-600"
            />
          )}
          <Row label="Delivery" value={formatBDT(order.deliveryCharge)} />
          <div className="flex justify-between pt-2 border-t font-bold text-base">
            <span>Total</span>
            <span className="text-rose-600">{formatBDT(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 flex items-center gap-3 text-sm text-gray-500">
        <Package size={16} />
        <span>
          Need help with this order? Call us at{' '}
          <Link href="/pages/contact" className="text-rose-600 font-medium">
            Contact Support
          </Link>
        </span>
      </div>
    </div>
  );
}

function Row({
  label, value, valueClass = '', mono = false,
}: { label: string; value: string; valueClass?: string; mono?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${valueClass} ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </span>
    </div>
  );
}
