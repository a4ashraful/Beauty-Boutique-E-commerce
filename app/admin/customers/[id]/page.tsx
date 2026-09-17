'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, ShoppingBag, MapPin } from 'lucide-react';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { updateUserProfile } from '@/lib/firestore/users';
import { formatBDT, formatDate, formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';
import type { Order, UserProfile } from '@/types';

export default function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [cSnap, oSnap] = await Promise.all([
          getDoc(doc(db, 'users', id)),
          getDocs(query(collection(db, 'orders'), where('customerId', '==', id))),
        ]);
        if (cSnap.exists()) setCustomer({ uid: cSnap.id, ...(cSnap.data() as any) });
        const list = oSnap.docs
          .map((d) => ({ id: d.id, ...(d.data() as any) }))
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setOrders(list);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const toggleDisable = async () => {
    if (!customer) return;
    try {
      await updateUserProfile(customer.uid, { disabled: !customer.disabled });
      setCustomer({ ...customer, disabled: !customer.disabled });
      toast.success(customer.disabled ? 'Account enabled' : 'Account disabled');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-rose-600" size={24} />
      </div>
    );
  }

  if (!customer) {
    return <p className="py-20 text-center text-gray-500">Customer not found.</p>;
  }

  const total = orders.reduce((s, o) => s + o.total, 0);
  const delivered = orders.filter((o) => o.status === 'delivered').length;

  return (
    <div>
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-rose-600 mb-3"
      >
        <ArrowLeft size={12} /> Back to Customers
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        {/* LEFT */}
        <div className="space-y-5">
          <section className="rounded-xl border bg-white p-5">
            <div className="flex items-start gap-4">
              <span className="h-14 w-14 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xl font-semibold shrink-0">
                {customer.name?.[0]?.toUpperCase() || '?'}
              </span>
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-xl font-bold">{customer.name}</h1>
                <p className="text-sm text-gray-500">{customer.email}</p>
                {customer.phone && (
                  <p className="text-sm text-gray-700 mt-1">{customer.phone}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  Joined {formatDate(customer.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {customer.role === 'admin' && <Badge variant="info">Admin</Badge>}
                {customer.disabled ? (
                  <Badge variant="danger">Disabled</Badge>
                ) : (
                  <Badge variant="success">Active</Badge>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <ShoppingBag size={14} /> Order History ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No orders yet.</p>
            ) : (
              <div className="divide-y">
                {orders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/admin/orders/${o.id}`}
                    className="flex items-center gap-3 py-3 hover:bg-gray-50 -mx-2 px-2 rounded"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs font-semibold text-rose-600">
                        {o.orderNumber}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDateTime(o.createdAt)} · {o.items.length} item{o.items.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <OrderStatusBadge status={o.status} />
                    <span className="text-sm font-semibold">{formatBDT(o.total)}</span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {customer.addresses && customer.addresses.length > 0 && (
            <section className="rounded-xl border bg-white p-5">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin size={14} /> Saved Addresses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {customer.addresses.map((a) => (
                  <div key={a.id} className="rounded-lg border p-3 text-sm">
                    {a.isDefault && <Badge variant="success" className="text-[10px] mb-1">Default</Badge>}
                    <p className="font-medium">{a.fullName}</p>
                    <p className="text-xs text-gray-500">{a.phone}</p>
                    <p className="text-xs text-gray-700 mt-1">{a.area}, {a.district}</p>
                    <p className="text-xs text-gray-500">{a.address}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT */}
        <aside className="space-y-5">
          <section className="rounded-xl border bg-white p-5">
            <h3 className="font-semibold mb-3 text-sm">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Total orders</span>
                <span className="font-semibold">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivered</span>
                <span className="font-semibold">{delivered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total spent</span>
                <span className="font-semibold text-rose-600">{formatBDT(total)}</span>
              </div>
              {orders.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Avg. order</span>
                  <span className="font-semibold">{formatBDT(total / orders.length)}</span>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border bg-white p-5">
            <h3 className="font-semibold mb-3 text-sm">Actions</h3>
            <Button
              variant={customer.disabled ? 'default' : 'destructive'}
              className="w-full"
              onClick={toggleDisable}
            >
              {customer.disabled ? 'Enable Account' : 'Disable Account'}
            </Button>
            <p className="text-[11px] text-gray-500 mt-2">
              {customer.disabled
                ? 'Disabled accounts cannot place new orders.'
                : 'Disabling prevents new orders and logins.'}
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
