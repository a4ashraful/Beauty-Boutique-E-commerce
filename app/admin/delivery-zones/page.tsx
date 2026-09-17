'use client';
import { useEffect, useState } from 'react';
import {
  Plus, Edit, Trash2, Loader2, MapPin,
} from 'lucide-react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
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
import { BD_DIVISIONS, BD_DISTRICTS, formatBDT } from '@/lib/utils';
import { toast } from 'sonner';
import type { DeliveryZone } from '@/types';

export default function AdminDeliveryZonesPage() {
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DeliveryZone | null>(null);
  const [form, setForm] = useState<Partial<DeliveryZone>>({
    name: '',
    divisions: [],
    districts: [],
    charge: 60,
    isActive: true,
  });

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, 'deliveryZones'));
    setZones(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const reset = () => {
    setEditing(null);
    setForm({ name: '', divisions: [], districts: [], charge: 60, isActive: true });
  };

  const openEdit = (z: DeliveryZone) => {
    setEditing(z);
    setForm(z);
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) { toast.error('Name is required'); return; }

    const payload: any = {
      name: form.name.trim(),
      divisions: form.divisions || [],
      districts: form.districts || [],
      charge: form.charge ?? 0,
      isActive: form.isActive ?? true,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editing) {
        await updateDoc(doc(db, 'deliveryZones', editing.id), payload);
        toast.success('Zone updated');
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'deliveryZones'), payload);
        toast.success('Zone created');
      }
      setOpen(false);
      reset();
      await load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this delivery zone?')) return;
    try {
      await deleteDoc(doc(db, 'deliveryZones', id));
      toast.success('Deleted');
      await load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const toggleDivision = (div: string) => {
    const current = form.divisions || [];
    setForm({
      ...form,
      divisions: current.includes(div) ? current.filter((d) => d !== div) : [...current, div],
    });
  };

  const toggleDistrict = (dist: string) => {
    const current = form.districts || [];
    setForm({
      ...form,
      districts: current.includes(dist) ? current.filter((d) => d !== dist) : [...current, dist],
    });
  };

  const allDistricts = Object.values(BD_DISTRICTS).flat();

  return (
    <div>
      <AdminPageHeader
        title="Delivery Zones"
        subtitle="Configure delivery charges by area"
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
            <DialogTrigger asChild>
              <Button><Plus size={14} /> Add Zone</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Zone' : 'New Zone'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={save} className="space-y-4">
                <div>
                  <Label className="text-xs">Zone Name *</Label>
                  <Input
                    value={form.name || ''}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Inside Dhaka"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label className="text-xs">Delivery Charge (৳) *</Label>
                  <Input
                    type="number"
                    value={form.charge ?? 0}
                    onChange={(e) => setForm({ ...form, charge: Number(e.target.value) })}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Match Divisions (optional)</Label>
                  <div className="flex flex-wrap gap-2">
                    {BD_DIVISIONS.map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => toggleDivision(d)}
                        className={`text-xs px-3 py-1.5 rounded-full border ${
                          form.divisions?.includes(d)
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'border-gray-300 hover:border-rose-400'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xs mb-2 block">Match Districts (optional)</Label>
                  <p className="text-[11px] text-gray-500 mb-2">
                    Priority: District match beats Division match.
                  </p>
                  <div className="max-h-40 overflow-y-auto border rounded-lg p-2 flex flex-wrap gap-1.5">
                    {allDistricts.map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => toggleDistrict(d)}
                        className={`text-[11px] px-2 py-1 rounded border ${
                          form.districts?.includes(d)
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'border-gray-300 hover:border-rose-400'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.isActive ?? true}
                    onCheckedChange={(v) => setForm({ ...form, isActive: !!v })}
                  />
                  Active
                </label>

                <Button type="submit" className="w-full">Save Zone</Button>
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
        ) : zones.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            <MapPin size={20} className="mx-auto text-gray-300 mb-2" />
            No delivery zones configured. Add at least one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="p-3 text-left">Zone</th>
                  <th className="p-3 text-left">Charge</th>
                  <th className="p-3 text-left hidden md:table-cell">Divisions</th>
                  <th className="p-3 text-left hidden md:table-cell">Districts</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {zones.map((z) => (
                  <tr key={z.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">{z.name}</td>
                    <td className="p-3 font-semibold text-rose-600">{formatBDT(z.charge)}</td>
                    <td className="p-3 hidden md:table-cell text-xs text-gray-600">
                      {z.divisions?.length ? z.divisions.join(', ') : '—'}
                    </td>
                    <td className="p-3 hidden md:table-cell text-xs text-gray-600">
                      {z.districts?.length
                        ? `${z.districts.length} districts`
                        : '—'}
                    </td>
                    <td className="p-3">
                      {z.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Hidden</Badge>}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => openEdit(z)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => remove(z.id)} className="p-1.5 rounded hover:bg-rose-50 text-rose-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
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
