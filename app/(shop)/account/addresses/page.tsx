'use client';
import { useEffect, useState } from 'react';
import { MapPin, Plus, Trash2, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { setUserAddresses } from '@/lib/firestore/users';
import { BD_DIVISIONS, BD_DISTRICTS } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from 'sonner';
import type { Address } from '@/types';

export default function AddressesPage() {
  const { user, profile } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Omit<Address, 'id'>>({
    fullName: '',
    phone: '',
    division: 'Dhaka',
    district: 'Dhaka',
    area: '',
    address: '',
    isDefault: false,
  });

  useEffect(() => {
    if (profile) setAddresses(profile.addresses || []);
  }, [profile]);

  const save = async (list: Address[]) => {
    if (!user) return;
    try {
      await setUserAddresses(user.uid, list);
      setAddresses(list);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: Address = {
      id: `a_${Date.now()}`,
      ...form,
    };
    const updated = form.isDefault
      ? [...addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
      : [...addresses, newAddr];
    await save(updated);
    setForm({
      fullName: '', phone: '', division: 'Dhaka', district: 'Dhaka',
      area: '', address: '', isDefault: false,
    });
    setOpen(false);
    toast.success('Address added');
  };

  const remove = async (id: string) => {
    await save(addresses.filter((a) => a.id !== id));
    toast.success('Address removed');
  };

  const setDefault = async (id: string) => {
    await save(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const districts = BD_DISTRICTS[form.division] || [];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">My Addresses</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={14} /> Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Address</DialogTitle>
            </DialogHeader>
            <form onSubmit={add} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Full Name *</Label>
                  <Input
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
                <div>
                  <Label className="text-xs">Division</Label>
                  <select
                    value={form.division}
                    onChange={(e) => {
                      const div = e.target.value;
                      setForm({ ...form, division: div, district: BD_DISTRICTS[div]?.[0] || '' });
                    }}
                    className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
                  >
                    {BD_DIVISIONS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-xs">District</Label>
                  <select
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
                  >
                    {districts.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Area *</Label>
                  <Input
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Full Address *</Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={3}
                    className="mt-1"
                    required
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.isDefault}
                  onCheckedChange={(v) => setForm({ ...form, isDefault: !!v })}
                />
                Set as default
              </label>
              <Button type="submit" className="w-full">Save Address</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No addresses saved"
          description="Add a delivery address to check out faster."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-xl border bg-white p-4 relative">
              {a.isDefault && (
                <Badge className="absolute top-3 right-3" variant="success">
                  Default
                </Badge>
              )}
              <p className="font-semibold">{a.fullName}</p>
              <p className="text-sm text-gray-500 mt-0.5">{a.phone}</p>
              <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                {a.area}, {a.district}, {a.division}
                <br />
                {a.address}
              </p>
              <div className="mt-4 flex items-center gap-2">
                {!a.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDefault(a.id)}
                  >
                    <Check size={12} /> Set Default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(a.id)}
                  className="text-rose-600 hover:text-rose-700"
                >
                  <Trash2 size={12} /> Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
