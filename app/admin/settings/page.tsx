'use client';
import { useEffect, useState } from 'react';
import { Loader2, Save, Store, Phone, Share2 } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { getSiteSettings, saveSiteSettings, SiteSettings } from '@/lib/firestore/settings';
import { toast } from 'sonner';

export default function AdminSettingsPage() {
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
      toast.success('Settings saved');
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
        title="Store Settings"
        subtitle="Store information, contact details, social links and features"
      />

      <form onSubmit={save} className="max-w-2xl space-y-5">
        {/* Store Info */}
        <section className="rounded-xl border bg-white p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Store size={16} /> Store Information
          </h2>
          <div>
            <Label className="text-xs">Store Name</Label>
            <Input
              value={s.storeName || ''}
              onChange={(e) => setS({ ...s, storeName: e.target.value })}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Support Address</Label>
            <Input
              value={s.supportAddress || ''}
              onChange={(e) => setS({ ...s, supportAddress: e.target.value })}
              className="mt-1"
            />
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-xl border bg-white p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Phone size={16} /> Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Support Phone</Label>
              <Input
                value={s.supportPhone || ''}
                onChange={(e) => setS({ ...s, supportPhone: e.target.value })}
                placeholder="01XXXXXXXXX"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Support Email</Label>
              <Input
                type="email"
                value={s.supportEmail || ''}
                onChange={(e) => setS({ ...s, supportEmail: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </section>

        {/* Social */}
        <section className="rounded-xl border bg-white p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Share2 size={16} /> Social Media
          </h2>
          <div>
            <Label className="text-xs">Facebook Page URL</Label>
            <Input
              value={s.facebookUrl || ''}
              onChange={(e) => setS({ ...s, facebookUrl: e.target.value })}
              placeholder="https://facebook.com/…"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Instagram URL</Label>
            <Input
              value={s.instagramUrl || ''}
              onChange={(e) => setS({ ...s, instagramUrl: e.target.value })}
              placeholder="https://instagram.com/…"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">WhatsApp Number</Label>
            <Input
              value={s.whatsappNumber || ''}
              onChange={(e) => setS({ ...s, whatsappNumber: e.target.value })}
              placeholder="8801XXXXXXXXX"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">YouTube URL (optional)</Label>
            <Input
              value={s.youtubeUrl || ''}
              onChange={(e) => setS({ ...s, youtubeUrl: e.target.value })}
              className="mt-1"
            />
          </div>
        </section>

        {/* Features */}
        <section className="rounded-xl border bg-white p-5 space-y-3">
          <h2 className="font-semibold">Features</h2>
          <label className="flex items-center gap-3">
            <Checkbox
              checked={!!s.reviewsRequireApproval}
              onCheckedChange={(v) => setS({ ...s, reviewsRequireApproval: !!v })}
            />
            <div>
              <p className="text-sm font-medium">Require review approval</p>
              <p className="text-xs text-gray-500">
                New customer reviews must be approved by admin before appearing publicly.
              </p>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <Checkbox
              checked={!!s.newsletterEnabled}
              onCheckedChange={(v) => setS({ ...s, newsletterEnabled: !!v })}
            />
            <div>
              <p className="text-sm font-medium">Show newsletter signup</p>
              <p className="text-xs text-gray-500">
                Display the newsletter form in the footer.
              </p>
            </div>
          </label>
        </section>

        <Button type="submit" disabled={saving}>
          <Save size={14} /> {saving ? 'Saving…' : 'Save Settings'}
        </Button>
      </form>
    </div>
  );
}
