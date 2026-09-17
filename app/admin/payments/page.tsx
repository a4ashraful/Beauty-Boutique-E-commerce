'use client';
import { useEffect, useState } from 'react';
import { Loader2, CreditCard, Save } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { getSiteSettings, saveSiteSettings, SiteSettings } from '@/lib/firestore/settings';
import { toast } from 'sonner';

export default function AdminPaymentsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [s, setS] = useState<SiteSettings>({});

  useEffect(() => {
    getSiteSettings()
      .then(setS)
      .finally(() => setLoading(false));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSiteSettings(s);
      toast.success('Payment settings saved');
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-rose-600" size={24} />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="Payment Settings"
        subtitle="Enable/disable payment methods and enter manual payment details"
      />

      <form onSubmit={save} className="max-w-2xl space-y-5">
        <div className="rounded-xl border bg-white p-5 flex items-start gap-3">
          <span className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <CreditCard size={18} />
          </span>
          <div>
            <p className="font-medium text-sm">Manual Payment Mode</p>
            <p className="text-xs text-gray-500 mt-0.5">
              All payments are verified manually by an admin. When a customer
              places an order with bKash/Nagad/Bank, they must submit a
              Transaction ID which you verify in the Orders page.
            </p>
          </div>
        </div>

        {/* COD */}
        <section className="rounded-xl border bg-white p-5 space-y-3">
          <label className="flex items-center gap-3">
            <Checkbox
              checked={!!s.codEnabled}
              onCheckedChange={(v) => setS({ ...s, codEnabled: !!v })}
            />
            <div>
              <p className="font-medium text-sm">Cash on Delivery</p>
              <p className="text-xs text-gray-500">
                Customer pays when the order is delivered.
              </p>
            </div>
          </label>
        </section>

        {/* bKash */}
        <section className="rounded-xl border bg-white p-5 space-y-3">
          <label className="flex items-center gap-3">
            <Checkbox
              checked={!!s.bkashEnabled}
              onCheckedChange={(v) => setS({ ...s, bkashEnabled: !!v })}
            />
            <div>
              <p className="font-medium text-sm">bKash (Manual)</p>
              <p className="text-xs text-gray-500">
                Customer sends money, submits TrxID. You verify manually.
              </p>
            </div>
          </label>
          <div>
            <Label className="text-xs">bKash Number (Personal)</Label>
            <Input
              value={s.bkashNumber || ''}
              onChange={(e) => setS({ ...s, bkashNumber: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="mt-1"
              disabled={!s.bkashEnabled}
            />
          </div>
        </section>

        {/* Nagad */}
        <section className="rounded-xl border bg-white p-5 space-y-3">
          <label className="flex items-center gap-3">
            <Checkbox
              checked={!!s.nagadEnabled}
              onCheckedChange={(v) => setS({ ...s, nagadEnabled: !!v })}
            />
            <div>
              <p className="font-medium text-sm">Nagad (Manual)</p>
              <p className="text-xs text-gray-500">
                Customer sends money, submits TrxID. You verify manually.
              </p>
            </div>
          </label>
          <div>
            <Label className="text-xs">Nagad Number</Label>
            <Input
              value={s.nagadNumber || ''}
              onChange={(e) => setS({ ...s, nagadNumber: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="mt-1"
              disabled={!s.nagadEnabled}
            />
          </div>
        </section>

        {/* Bank */}
        <section className="rounded-xl border bg-white p-5 space-y-3">
          <label className="flex items-center gap-3">
            <Checkbox
              checked={!!s.bankEnabled}
              onCheckedChange={(v) => setS({ ...s, bankEnabled: !!v })}
            />
            <div>
              <p className="font-medium text-sm">Bank Transfer</p>
              <p className="text-xs text-gray-500">
                Customer transfers and submits reference.
              </p>
            </div>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Bank Name</Label>
              <Input
                value={s.bankName || ''}
                onChange={(e) => setS({ ...s, bankName: e.target.value })}
                className="mt-1"
                disabled={!s.bankEnabled}
              />
            </div>
            <div>
              <Label className="text-xs">Account Number</Label>
              <Input
                value={s.bankAccount || ''}
                onChange={(e) => setS({ ...s, bankAccount: e.target.value })}
                className="mt-1"
                disabled={!s.bankEnabled}
              />
            </div>
            <div>
              <Label className="text-xs">Branch</Label>
              <Input
                value={s.bankBranch || ''}
                onChange={(e) => setS({ ...s, bankBranch: e.target.value })}
                className="mt-1"
                disabled={!s.bankEnabled}
              />
            </div>
          </div>
        </section>

        <Button type="submit" disabled={saving}>
          <Save size={14} /> {saving ? 'Saving…' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}
