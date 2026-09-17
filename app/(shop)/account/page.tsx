'use client';
import { useEffect, useState } from 'react';
import { User, Save } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile } from '@/lib/firestore/users';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AccountPage() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setForm({ name: profile.name || '', phone: profile.phone || '' });
  }, [profile]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, { name: form.name.trim(), phone: form.phone.trim() });
      toast.success('Profile updated');
    } catch (e: any) {
      toast.error(e.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xl font-semibold">
            {profile.name?.[0]?.toUpperCase() || 'A'}
          </div>
          <div>
            <h1 className="text-lg font-semibold">Hello, {profile.name}</h1>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>
      </div>

      <form onSubmit={save} className="rounded-xl border bg-white p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <User size={16} /> Profile Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">Full Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label className="text-xs">Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="01XXXXXXXXX"
              className="mt-1"
            />
          </div>
          <div className="sm:col-span-2">
            <Label className="text-xs">Email (read-only)</Label>
            <Input value={profile.email} readOnly className="mt-1 bg-gray-50" />
          </div>
        </div>

        <Button type="submit" disabled={saving}>
          <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}