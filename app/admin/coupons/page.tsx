'use client';
import { useEffect, useState } from 'react';
import {
  Plus, Edit, Trash2, Loader2, Ticket, Copy,
} from 'lucide-react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  orderBy, query, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { formatBDT, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { Coupon } from '@/types';

const empty: Partial<Coupon> = {
  code: '',
  type: 'percent',
  value: 10,
  minOrder: 0,
  maxDiscount: 0,
  usageLimit: 0,
  usedCount: 0,
  isActive: true,
};

export default function AdminCouponsPage() {
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<Partial<Coupon>>(empty);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'coupons'), orderBy('code', 'asc')));
    setCoupons(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const reset = () => {
    setEditing(null);
    setForm(empty);
    setStart('');
    setEnd('');
  };

  const toInputDate = (ts: any) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts.seconds * 1000);
    return d.toISOString().slice(0, 10);
  };

  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm(c);
    setStart(toInputDate(c.startDate));
    setEnd(toInputDate(c.endDate));
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code?.trim()) { toast.error('Code is required'); return; }
    if (!form.value || form.value <= 0) { toast.error('Value must be > 0'); return; }

    const payload: any = {
      code: form.code.trim().toUpperCase(),
      type: form.type,
      value: form.value,
      minOrder: form.minOrder || 0,
      maxDiscount: form.maxDiscount || 0,
      usageLimit: form.usageLimit || 0,
      usedCount: editing?.usedCount || 0,
      isActive: form.isActive ?? true,
      startDate: start ? Timestamp.fromDate(new Date(start)) : null,
      endDate: end ? Timestamp.fromDate(new Date(end)) : null,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editing) {
        await updateDoc(doc(db, 'coupons', editing.id), payload);
        toast.success('Coupon updated');
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'coupons'), payload);
        toast.success('Coupon created');
      }
      setOpen(false);
      reset();
      await load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    try {
      await deleteDoc(doc(db, 'coupons', id));
      await load();
      toast.success('Deleted');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied');
  };

  return (
    <div>
      <AdminPageHeader
        title="Coupons & Discounts"
        subtitle={`${coupons.length} coupon(s)`}
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
            <DialogTrigger asChild>
              <Button><Plus size={14} /> Add Coupon</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Coupon' : 'New Coupon'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={save} className="space-y-4">
                <div>
                  <Label className="text-xs">Code *</Label>
                  <Input
                    value={form.code || ''}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. WELCOME10"
                    className="mt-1 font-mono uppercase"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Type *</Label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                      className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed (৳)</option>
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs">
                      Value * {form.type === 'percent' ? '(%)' : '(৳)'}
                    </Label>
                    <Input
                      type="number"
                      value={form.value || ''}
                      onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Min Order (৳)</Label>
                    <Input
                      type="number"
                      value={form.minOrder || ''}
                      onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })}
                      placeholder="0 = no minimum"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Max Discount (৳)</Label>
                    <Input
                      type="number"
                      value={form.maxDiscount || ''}
                      onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                      placeholder="0 = no cap"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Start Date</Label>
                    <Input
                      type="date"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">End Date</Label>
                    <Input
                      type="date"
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Usage Limit</Label>
                  <Input
                    type="number"
                    value={form.usageLimit || ''}
                    onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                    placeholder="0 = unlimited"
                    className="mt-1"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.isActive ?? true}
                    onCheckedChange={(v) => setForm({ ...form, isActive: !!v })}
                  />
                  Active
                </label>

                <Button type="submit" className="w-full">Save Coupon</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="rounded-xl border bg-white overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-rose-600" size={24} />
          </div>
        ) : coupons.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            <Ticket size={20} className="mx-auto text-gray-300 mb-2" />
            No coupons yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-left">Discount</th>
                  <th className="p-3 text-left hidden md:table-cell">Min Order</th>
                  <th className="p-3 text-left hidden lg:table-cell">Validity</th>
                  <th className="p-3 text-left">Used</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {coupons.map((c) => {
                  const expired = c.endDate && (c.endDate.toMillis?.() ?? 0) < Date.now();
                  return (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{c.code}</span>
                          <button
                            onClick={() => copyCode(c.code)}
                            className="text-gray-400 hover:text-rose-600"
                            title="Copy code"
                          >
                            <Copy size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-rose-600">
                          {c.type === 'percent' ? `${c.value}%` : formatBDT(c.value)}
                        </span>
                        {c.maxDiscount ? (
                          <span className="text-xs text-gray-500 ml-1">
                            (max {formatBDT(c.maxDiscount)})
                          </span>
                        ) : null}
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        {c.minOrder ? formatBDT(c.minOrder) : '—'}
                      </td>
                      <td className="p-3 hidden lg:table-cell text-xs text-gray-500">
                        {c.startDate ? formatDate(c.startDate) : '—'} → {c.endDate ? formatDate(c.endDate) : '∞'}
                      </td>
                      <td className="p-3">
                        {c.usedCount || 0}
                        {c.usageLimit ? ` / ${c.usageLimit}` : ''}
                      </td>
                      <td className="p-3">
                        {!c.isActive ? (
                          <Badge variant="secondary">Inactive</Badge>
                        ) : expired ? (
                          <Badge variant="danger">Expired</Badge>
                        ) : (
                          <Badge variant="success">Active</Badge>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => openEdit(c)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => remove(c.id)} className="p-1.5 rounded hover:bg-rose-50 text-rose-600">
                            <Trash2 size={14} />
                          </button>
                        </div>
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
