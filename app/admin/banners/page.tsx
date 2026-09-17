'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Plus, Edit, Trash2, Loader2, Image as ImageIcon, Eye, EyeOff,
} from 'lucide-react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  orderBy, query, serverTimestamp,
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
import { ImageUploader } from '@/components/admin/ImageUploader';
import { toast } from 'sonner';
import type { Banner, ProductImage } from '@/types';

const POSITIONS = [
  { id: 'hero', label: 'Hero Slider (top of homepage)' },
  { id: 'promo', label: 'Promo Banner (below hero)' },
  { id: 'sidebar', label: 'Sidebar Banner' },
];

export default function AdminBannersPage() {
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [form, setForm] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    order: 0,
    isActive: true,
    position: 'hero',
  });
  const [imageList, setImageList] = useState<ProductImage[]>([]);

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(
      query(collection(db, 'banners'), orderBy('order', 'asc'))
    );
    setBanners(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const reset = () => {
    setEditing(null);
    setForm({
      title: '', subtitle: '', image: '', buttonText: '', buttonLink: '',
      order: 0, isActive: true, position: 'hero',
    });
    setImageList([]);
  };

  const openEdit = (b: Banner) => {
    setEditing(b);
    setForm(b);
    setImageList(b.image ? [{ url: b.image, isMain: true }] : []);
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const imageUrl = imageList[0]?.url || form.image;
    if (!imageUrl) { toast.error('Banner image is required'); return; }

    const payload: any = {
      title: form.title || '',
      subtitle: form.subtitle || '',
      image: imageUrl,
      buttonText: form.buttonText || '',
      buttonLink: form.buttonLink || '',
      order: form.order ?? 0,
      position: form.position || 'hero',
      isActive: form.isActive ?? true,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editing) {
        await updateDoc(doc(db, 'banners', editing.id), payload);
        toast.success('Banner updated');
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'banners'), payload);
        toast.success('Banner created');
      }
      setOpen(false);
      reset();
      await load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await deleteDoc(doc(db, 'banners', id));
      toast.success('Deleted');
      await load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const toggleActive = async (b: Banner) => {
    try {
      await updateDoc(doc(db, 'banners', b.id), { isActive: !b.isActive, updatedAt: serverTimestamp() });
      setBanners((prev) => prev.map((x) => x.id === b.id ? { ...x, isActive: !b.isActive } : x));
      toast.success(b.isActive ? 'Hidden' : 'Visible');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const grouped: Record<string, Banner[]> = { hero: [], promo: [], sidebar: [] };
  banners.forEach((b) => {
    const p = b.position || 'hero';
    if (!grouped[p]) grouped[p] = [];
    grouped[p].push(b);
  });

  return (
    <div>
      <AdminPageHeader
        title="Homepage Banners"
        subtitle="Manage hero sliders and promotional banners"
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
            <DialogTrigger asChild>
              <Button><Plus size={14} /> Add Banner</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Banner' : 'New Banner'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={save} className="space-y-4">
                <div>
                  <Label className="text-xs">Position *</Label>
                  <select
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value as any })}
                    className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
                  >
                    {POSITIONS.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-xs">Banner Image *</Label>
                  <div className="mt-1">
                    <ImageUploader images={imageList} onChange={(imgs) => setImageList(imgs.slice(0, 1))} />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Recommended: 1920×800 for hero, 800×400 for promo.
                  </p>
                </div>

                <div>
                  <Label className="text-xs">Title</Label>
                  <Input
                    value={form.title || ''}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Summer Glow Sale"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-xs">Subtitle</Label>
                  <Input
                    value={form.subtitle || ''}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="Optional short text below title"
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Button Text</Label>
                    <Input
                      value={form.buttonText || ''}
                      onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                      placeholder="e.g. Shop Now"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Button Link</Label>
                    <Input
                      value={form.buttonLink || ''}
                      onChange={(e) => setForm({ ...form, buttonLink: e.target.value })}
                      placeholder="/shop"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Display Order</Label>
                    <Input
                      type="number"
                      value={form.order ?? 0}
                      onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  <label className="flex items-end gap-2 pb-2 text-sm">
                    <Checkbox
                      checked={form.isActive ?? true}
                      onCheckedChange={(v) => setForm({ ...form, isActive: !!v })}
                    />
                    Active
                  </label>
                </div>

                <Button type="submit" className="w-full">Save Banner</Button>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-rose-600" size={24} />
        </div>
      ) : banners.length === 0 ? (
        <div className="rounded-xl border bg-white p-16 text-center text-sm text-gray-500">
          <ImageIcon size={24} className="mx-auto text-gray-300 mb-2" />
          No banners yet. Add your first to make the homepage pop.
        </div>
      ) : (
        <div className="space-y-8">
          {POSITIONS.map((pos) => {
            const list = grouped[pos.id] || [];
            return (
              <div key={pos.id}>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  {pos.label} <span className="text-gray-400 font-normal">({list.length})</span>
                </h2>
                {list.length === 0 ? (
                  <p className="text-xs text-gray-400 italic mb-2">No banners in this position.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.map((b) => (
                      <div key={b.id} className="rounded-xl border bg-white overflow-hidden">
                        <div className="relative aspect-[16/8] bg-gray-100">
                          <Image src={b.image} alt={b.title || ''} fill sizes="400px" className="object-cover" />
                          <div className="absolute top-2 right-2 flex gap-1">
                            {b.isActive ? (
                              <Badge variant="success" className="text-[10px]">Active</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-[10px]">Hidden</Badge>
                            )}
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="font-medium text-sm truncate">{b.title || '(no title)'}</p>
                          {b.subtitle && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">{b.subtitle}</p>
                          )}
                          {b.buttonText && (
                            <p className="text-[11px] text-rose-600 mt-1">
                              Button: {b.buttonText} → {b.buttonLink}
                            </p>
                          )}
                          <div className="mt-3 pt-3 border-t flex items-center gap-1">
                            <button
                              onClick={() => toggleActive(b)}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                              title={b.isActive ? 'Hide' : 'Show'}
                            >
                              {b.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button
                              onClick={() => openEdit(b)}
                              className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => remove(b.id)}
                              className="p-1.5 rounded hover:bg-rose-50 text-rose-600 ml-auto"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
