'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, Package, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OrderStatusTimeline } from '@/components/shop/OrderStatusTimeline';
import { getOrderByNumberOrPhone } from '@/lib/firestore/orders';
import {
  formatBDT, formatDateTime, ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
} from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Order } from '@/types';

export function TrackOrderClient() {
  const params = useSearchParams();
  const router = useRouter();

  const [orderNumber, setOrderNumber] = useState(params.get('order') || '');
  const [phone, setPhone] = useState(params.get('phone') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lookup = async (num: string, ph: string) => {
    if (!num || !ph) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const o = await getOrderByNumberOrPhone(num.trim(), ph.trim());
      if (!o) {
        setError('No order found with that number and phone.');
      } else {
        setOrder(o);
      }
    } catch (e: any) {
      setError(e.message || 'Lookup failed');
    } finally {
      setLoading(false);
    }
  };

  // Auto lookup if URL params present
  useEffect(() => {
    const num = params.get('order');
    const ph = params.get('phone');
    if (num && ph) {
      setOrderNumber(num);
      setPhone(ph);
      lookup(num, ph);
    }
  }, []); // eslint-disable-line

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace(`/track-order?order=${orderNumber}&phone=${phone}`);
    lookup(orderNumber, phone);
  };

  return (
    <div className="container-shop py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
            <Package size={26} />
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold">Track Your Order</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your order number and phone to check the status.
          </p>
        </div>

        <form onSubmit={submit} className="rounded-xl border bg-white p-5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Order Number *</label>
              <Input
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                placeholder="BBT-XXXXXX-XXXX"
                required
                className="mt-1 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Phone *</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                required
                className="mt-1"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Searching…
              </>
            ) : (
              <>
                <Search size={16} /> Track Order
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-sm text-red-800">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {order && (
          <div className="mt-6 space-y-5">
            {/* Header */}
            <div className="rounded-xl border bg-white p-5">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest">
                    Order Number
                  </p>
                  <p className="font-mono text-lg font-bold text-rose-600">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed on {formatDateTime(order.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
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
                  <Badge
                    variant={order.paymentStatus === 'paid' ? 'success' : 'secondary'}
                  >
                    {PAYMENT_STATUS_LABEL[order.paymentStatus]}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <OrderStatusTimeline status={order.status} />

            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-xl border bg-white p-5">
                <h3 className="font-semibold text-sm mb-3">Delivery Address</h3>
                <div className="text-sm space-y-1 text-gray-700">
                  <p className="font-medium">{order.customerName}</p>
                  <p>{order.phone}</p>
                  <p>{order.area}, {order.district}</p>
                  <p>{order.division}</p>
                  <p className="text-gray-600">{order.address}</p>
                </div>
              </div>

              <div className="rounded-xl border bg-white p-5">
                <h3 className="font-semibold text-sm mb-3">Payment</h3>
                <div className="text-sm space-y-1.5 text-gray-700">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Method</span>
                    <span className="font-medium">
                      {PAYMENT_METHOD_LABEL[order.paymentMethod]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium">
                      {PAYMENT_STATUS_LABEL[order.paymentStatus]}
                    </span>
                  </div>
                  {order.paymentReference && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Reference</span>
                      <span className="font-mono text-xs">{order.paymentReference}</span>
                    </div>
                  )}
                  {order.courier && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Courier</span>
                      <span className="font-medium">{order.courier}</span>
                    </div>
                  )}
                  {order.trackingNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tracking</span>
                      <span className="font-mono text-xs">{order.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="rounded-xl border bg-white p-5">
              <h3 className="font-semibold text-sm mb-3">
                Items ({order.items.length})
              </h3>
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
                        Qty: {it.qty} × {formatBDT(it.price)}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {formatBDT(it.price * it.qty)}
                    </span>
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
                <div className="flex justify-between pt-2 border-t text-base font-bold">
                  <span>Total</span>
                  <span className="text-rose-600">{formatBDT(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass = '',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}