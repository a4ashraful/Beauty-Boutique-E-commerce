'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { formatBDT, BD_DIVISIONS, BD_DISTRICTS } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CouponInput } from '@/components/shop/CouponInput';
import { PaymentInstructions } from '@/components/shop/PaymentInstructions';
import { getActiveDeliveryZones, findZoneForAddress } from '@/lib/firestore/deliveryZones';
import { auth } from '@/lib/firebase/client';
import { toast } from 'sonner';
import type { DeliveryZone, PaymentMethod } from '@/types';

export function CheckoutClient() {
  const router = useRouter();
  const { items, subtotal, discount, coupon, clear } = useCart();
  const { user, profile } = useAuth();

  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);

  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    division: 'Dhaka',
    district: 'Dhaka',
    area: '',
    address: '',
    paymentMethod: 'cod' as PaymentMethod,
    paymentReference: '',
    paymentNote: '',
    notes: '',
  });

  useEffect(() => {
    getActiveDeliveryZones().then(setZones).catch(() => []);
  }, []);

  // Autofill from profile
  useEffect(() => {
    if (profile && user) {
      setForm((f) => ({
        ...f,
        customerName: f.customerName || profile.name || '',
        phone: f.phone || profile.phone || '',
        email: f.email || profile.email || '',
      }));
    }
  }, [profile, user]);

  // Auto-select delivery zone based on district
  useEffect(() => {
    if (!zones.length) return;
    const z = findZoneForAddress(zones, form.division, form.district);
    setSelectedZone(z);
  }, [form.division, form.district, zones]);

  const sub = subtotal();
  const disc = discount();
  const ship = selectedZone?.charge || 0;
  const grand = Math.max(0, sub - disc + ship);

  const districts = BD_DISTRICTS[form.division] || [];

  const canSubmit =
    form.customerName.trim().length >= 2 &&
    /^01[3-9]\d{8}$/.test(form.phone) &&
    form.area.trim().length >= 2 &&
    form.address.trim().length >= 5 &&
    selectedZone &&
    items.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error('Please complete all required fields');
      return;
    }

    if (
      (form.paymentMethod === 'bkash' ||
        form.paymentMethod === 'nagad' ||
        form.paymentMethod === 'bank') &&
      !form.paymentReference.trim()
    ) {
      toast.error('Please enter your transaction ID / reference');
      return;
    }

    setSubmitting(true);
    try {
      const token = user ? await user.getIdToken() : null;

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          division: form.division,
          district: form.district,
          area: form.area.trim(),
          address: form.address.trim(),
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            name: i.name,
            variantName: i.variantName,
            image: i.image,
            price: i.price,
            qty: i.qty,
            sku: i.sku,
          })),
          couponCode: coupon?.code,
          paymentMethod: form.paymentMethod,
          paymentReference: form.paymentReference.trim() || undefined,
          paymentNote: form.paymentNote.trim() || undefined,
          deliveryZoneId: selectedZone!.id,
          deliveryCharge: ship,
          notes: form.notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to place order');

      clear();
      router.push(`/order-success?order=${data.orderNumber}`);
    } catch (e: any) {
      toast.error(e.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-shop py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <Link
          href="/shop"
          className="mt-4 inline-flex rounded-full bg-rose-600 px-6 py-3 text-white text-sm font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-shop py-6">
      <Link
        href="/cart"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-rose-600 mb-4"
      >
        <ArrowLeft size={14} /> Back to Cart
      </Link>

      <h1 className="font-display text-2xl sm:text-3xl font-bold mb-6">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6"
      >
        {/* LEFT: Form */}
        <div className="space-y-5">
          {/* Contact */}
          <section className="rounded-xl border bg-white p-5 space-y-4">
            <h2 className="font-semibold">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Full Name *</Label>
                <Input
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  placeholder="Your name"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Phone *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="01XXXXXXXXX"
                  className="mt-1"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Email (optional)</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  className="mt-1"
                />
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="rounded-xl border bg-white p-5 space-y-4">
            <h2 className="font-semibold">Delivery Address</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Division *</Label>
                <select
                  value={form.division}
                  onChange={(e) => {
                    const div = e.target.value;
                    const first = BD_DISTRICTS[div]?.[0] || '';
                    setForm({ ...form, division: div, district: first });
                  }}
                  className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {BD_DIVISIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-xs">District *</Label>
                <select
                  value={form.district}
                  onChange={(e) => setForm({ ...form, district: e.target.value })}
                  className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Area / Thana / Union *</Label>
                <Input
                  value={form.area}
                  onChange={(e) => setForm({ ...form, area: e.target.value })}
                  placeholder="e.g. Dhanmondi, Mirpur 10"
                  className="mt-1"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <Label className="text-xs">Full Address *</Label>
                <Textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="House / Road / Block details"
                  rows={3}
                  className="mt-1"
                  required
                />
              </div>
            </div>

            {selectedZone && (
              <p className="text-xs text-gray-500">
                📍 Delivery zone: <strong>{selectedZone.name}</strong> — {formatBDT(ship)}
              </p>
            )}
          </section>

          {/* Payment */}
          <section className="rounded-xl border bg-white p-5 space-y-4">
            <h2 className="font-semibold">Payment Method</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                { id: 'bkash', label: 'bKash (Manual)', desc: 'Send money & submit TrxID' },
                { id: 'nagad', label: 'Nagad (Manual)', desc: 'Send money & submit TrxID' },
                { id: 'bank', label: 'Bank Transfer', desc: 'Transfer & submit reference' },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition ${
                    form.paymentMethod === m.id
                      ? 'border-rose-600 bg-rose-50/40'
                      : 'border-gray-300 hover:border-rose-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m.id}
                    checked={form.paymentMethod === m.id}
                    onChange={() => setForm({ ...form, paymentMethod: m.id as PaymentMethod })}
                    className="mt-0.5 accent-rose-600"
                  />
                  <div>
                    <p className="text-sm font-medium">{m.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* Manual payment instructions + ref field */}
            {(form.paymentMethod === 'bkash' ||
              form.paymentMethod === 'nagad' ||
              form.paymentMethod === 'bank') && (
              <div className="space-y-3 pt-2">
                <PaymentInstructions
                  method={form.paymentMethod as any}
                  total={grand}
                />

                <div>
                  <Label className="text-xs">
                    Transaction ID / Reference *{' '}
                    <span className="text-gray-400">
                      (e.g. 8N7A2B9XYZ)
                    </span>
                  </Label>
                  <Input
                    value={form.paymentReference}
                    onChange={(e) => setForm({ ...form, paymentReference: e.target.value })}
                    placeholder="Enter TrxID or reference number"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label className="text-xs">Payment Note (optional)</Label>
                  <Input
                    value={form.paymentNote}
                    onChange={(e) => setForm({ ...form, paymentNote: e.target.value })}
                    placeholder="e.g. Paid from 017XXXXXXXX"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-800 flex gap-2">
              <ShieldCheck size={16} className="shrink-0 mt-0.5" />
              <span>
                Your payment is manually verified by our team. You'll receive a
                confirmation via SMS/phone before dispatch.
              </span>
            </div>
          </section>

          {/* Order notes */}
          <section className="rounded-xl border bg-white p-5">
            <Label className="text-xs">Order Notes (optional)</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Any special instructions?"
              rows={2}
              className="mt-1"
            />
          </section>
        </div>

        {/* RIGHT: Summary */}
        <aside className="lg:sticky lg:top-32 h-fit space-y-4">
          <div className="rounded-xl border bg-white p-5 space-y-4">
            <h2 className="font-semibold">Order Summary</h2>

            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {items.map((it) => (
                <div key={`${it.productId}:${it.variantId || ''}`} className="flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 rounded-md overflow-hidden bg-gray-50">
                    {it.image && (
                      <Image src={it.image} alt={it.name} fill sizes="56px" className="object-cover" />
                    )}
                    <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-medium">
                      {it.qty}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-2">{it.name}</p>
                    {it.variantName && (
                      <p className="text-[10px] text-gray-500">{it.variantName}</p>
                    )}
                  </div>
                  <span className="text-xs font-medium">{formatBDT(it.price * it.qty)}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t">
              <CouponInput subtotal={sub} />
            </div>

            <div className="space-y-2 text-sm pt-3 border-t">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatBDT(sub)}</span>
              </div>
              {disc > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount {coupon && `(${coupon.code})`}</span>
                  <span className="font-medium">−{formatBDT(disc)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery</span>
                <span className="font-medium">
                  {selectedZone ? formatBDT(ship) : '—'}
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t text-lg font-bold">
              <span>Total</span>
              <span className="text-rose-600">{formatBDT(grand)}</span>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-12"
              disabled={submitting || !canSubmit}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Placing Order…
                </>
              ) : (
                'Place Order'
              )}
            </Button>

            <p className="text-[11px] text-gray-500 text-center">
              By placing your order you agree to our Terms & Conditions.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
