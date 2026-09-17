'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { ArrowLeft, Printer, Loader2, Truck, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { OrderStatusTimeline } from '@/components/shop/OrderStatusTimeline';
import { PaymentInstructions } from '@/components/shop/PaymentInstructions';
import {
  updateStatus, updatePaymentStatus, updateCourierInfo, updateAdminNotes,
} from '@/lib/firestore/adminOrders';
import {
  formatBDT, formatDateTime, ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL, ORDER_STATUS_FLOW,
} from '@/lib/utils';
import { toast } from 'sonner';
import type { Order, OrderStatus, PaymentStatus } from '@/types';

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);
  const [courier, setCourier] = useState('');
  const [tracking, setTracking] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, 'orders', id));
      if (snap.exists()) {
        const o = { id: snap.id, ...(snap.data() as any) } as Order;
        setOrder(o);
        setCourier(o.courier || '');
        setTracking(o.trackingNumber || '');
        setNotes(o.adminNotes || '');
      }
      setLoading(false);
    })();
  }, [id]);

  const reload = async () => {
    const snap = await getDoc(doc(db, 'orders', id));
    if (snap.exists()) setOrder({ id: snap.id, ...(snap.data() as any) });
  };

  const changeStatus = async (status: OrderStatus) => {
    setBusy(true);
    try {
      await updateStatus(id, status);
      await reload();
      toast.success(`Marked as ${ORDER_STATUS_LABEL[status]}`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const changePayment = async (paymentStatus: PaymentStatus) => {
    setBusy(true);
    try {
      await updatePaymentStatus(id, paymentStatus);
      await reload();
      toast.success(`Payment ${PAYMENT_STATUS_LABEL[paymentStatus]}`);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const saveCourier = async () => {
    if (!courier.trim() || !tracking.trim()) {
      toast.error('Enter courier and tracking number');
      return;
    }
    setBusy(true);
    try {
      await updateCourierInfo(id, courier.trim(), tracking.trim());
      await reload();
      toast.success('Courier info saved');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const saveNotes = async () => {
    setBusy(true);
    try {
      await updateAdminNotes(id, notes.trim());
      await reload();
      toast.success('Notes saved');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-rose-600" size={24} />
      </div>
    );
  }

  if (!order) {
    return <p className="py-20 text-center text-gray-500">Order not found.</p>;
  }

  const nextStatuses: OrderStatus[] = ORDER_STATUS_FLOW.filter(
    (s) => ORDER_STATUS_FLOW.indexOf(s) > ORDER_STATUS_FLOW.indexOf(order.status)
  );

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-rose-600 mb-2"
        >
          <ArrowLeft size={12} /> Back to Orders
        </Link>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-gray-900 font-mono">
              {order.orderNumber}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Placed {formatDateTime(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={order.status} />
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer size={14} /> Print Invoice
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
        {/* LEFT */}
        <div className="space-y-5">
          {/* Timeline */}
          <OrderStatusTimeline status={order.status} />

          {/* Status update buttons */}
          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold mb-3">Update Status</h2>
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant="outline"
                  onClick={() => changeStatus(s)}
                  disabled={busy}
                >
                  Mark as {ORDER_STATUS_LABEL[s]}
                </Button>
              ))}
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => changeStatus('cancelled')}
                  disabled={busy}
                >
                  Cancel Order
                </Button>
              )}
              {order.status === 'delivered' && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => changeStatus('returned')}
                  disabled={busy}
                >
                  Mark Returned
                </Button>
              )}
            </div>
          </section>

          {/* Items */}
          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold mb-3">Items ({order.items.length})</h2>
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
                    {it.variantName && <p className="text-xs text-gray-500">{it.variantName}</p>}
                    <p className="text-xs text-gray-500 mt-0.5">
                      Qty {it.qty} × {formatBDT(it.price)}
                    </p>
                    {it.sku && <p className="text-[11px] text-gray-400">SKU: {it.sku}</p>}
                  </div>
                  <span className="text-sm font-semibold">{formatBDT(it.price * it.qty)}</span>
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
          </section>

          {/* Customer */}
          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold mb-3">Customer & Delivery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Customer</p>
                <p className="font-medium mt-1">{order.customerName}</p>
                <p className="text-gray-600">{order.phone}</p>
                {order.email && <p className="text-gray-600">{order.email}</p>}
                {order.customerId ? (
                  <Link
                    href={`/admin/customers/${order.customerId}`}
                    className="text-xs text-rose-600 hover:underline mt-1 inline-block"
                  >
                    View customer profile →
                  </Link>
                ) : (
                  <Badge variant="secondary" className="mt-1 text-[10px]">Guest</Badge>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Delivery Address</p>
                <p className="mt-1 text-gray-700">{order.area}, {order.district}</p>
                <p className="text-gray-700">{order.division}</p>
                <p className="text-gray-600 mt-1">{order.address}</p>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold mb-3">Payment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1.5">
                <Row label="Method" value={PAYMENT_METHOD_LABEL[order.paymentMethod]} />
                <Row
                  label="Status"
                  value={PAYMENT_STATUS_LABEL[order.paymentStatus]}
                  valueClass={
                    order.paymentStatus === 'paid'
                      ? 'text-green-600'
                      : order.paymentStatus === 'failed'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }
                />
                {order.paymentReference && (
                  <Row label="Reference" value={order.paymentReference} mono />
                )}
                {order.paymentNote && (
                  <Row label="Note" value={order.paymentNote} />
                )}
              </div>

              {(order.paymentMethod === 'bkash' ||
                order.paymentMethod === 'nagad' ||
                order.paymentMethod === 'bank') && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                    Verify Payment
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => changePayment('paid')}
                      disabled={busy || order.paymentStatus === 'paid'}
                    >
                      Mark as Paid
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => changePayment('failed')}
                      disabled={busy || order.paymentStatus === 'failed'}
                    >
                      Mark Failed
                    </Button>
                    {order.paymentStatus === 'paid' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => changePayment('refunded')}
                        disabled={busy}
                      >
                        Mark Refunded
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Courier */}
          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Truck size={14} /> Courier Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Courier Name</Label>
                <Input
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  placeholder="e.g. Pathao, Steadfast"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Tracking Number</Label>
                <Input
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                  placeholder="e.g. PHT-12345678"
                  className="mt-1"
                />
              </div>
            </div>
            <Button size="sm" className="mt-3" onClick={saveCourier} disabled={busy}>
              <Save size={12} /> Save Courier Info
            </Button>
          </section>

          {/* Admin notes */}
          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold mb-3">Admin Notes (private)</h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Internal notes about this order…"
            />
            <Button size="sm" className="mt-3" onClick={saveNotes} disabled={busy}>
              <Save size={12} /> Save Notes
            </Button>
          </section>
        </div>

        {/* RIGHT */}
        <aside className="space-y-5">
          <section className="rounded-xl border bg-white p-5">
            <h3 className="font-semibold mb-3">Quick Facts</h3>
            <div className="space-y-2 text-sm">
              <Row label="Items" value={String(order.items.length)} />
              <Row
                label="Total Qty"
                value={String(order.items.reduce((s, i) => s + i.qty, 0))}
              />
              <Row label="Delivery charge" value={formatBDT(order.deliveryCharge)} />
              <Row label="Order total" value={formatBDT(order.total)} />
            </div>
          </section>

          {(order.paymentMethod === 'bkash' ||
            order.paymentMethod === 'nagad' ||
            order.paymentMethod === 'bank') && order.paymentStatus === 'pending' && (
            <section className="rounded-xl border bg-yellow-50 border-yellow-200 p-5">
              <h3 className="font-semibold text-yellow-800 mb-2 text-sm">
                ⚠️ Payment Pending
              </h3>
              <p className="text-xs text-yellow-700 mb-3">
                Customer claims to have paid via{' '}
                {PAYMENT_METHOD_LABEL[order.paymentMethod]}. Verify the TrxID in your
                app before confirming.
              </p>
              <PaymentInstructions
                method={order.paymentMethod as any}
                total={order.total}
              />
            </section>
          )}

          <section className="rounded-xl border bg-white p-5">
            <h3 className="font-semibold mb-3 text-sm">Order Timeline</h3>
            <div className="text-xs space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Placed</span>
                <span>{formatDateTime(order.createdAt)}</span>
              </div>
              {order.updatedAt && (
                <div className="flex justify-between">
                  <span>Last update</span>
                  <span>{formatDateTime(order.updatedAt)}</span>
                </div>
              )}
            </div>
          </section>
        </aside>
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
