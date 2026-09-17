'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Plus, Edit, Trash2, Loader2, Award } from 'lucide-react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { slugify } from '@/lib/utils';
import { toast } from 'sonner';
import type { Brand, ProductImage } from '@/types';

export default function AdminBrandsPage() {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Brand | null>(null);
  const [form, setForm] = useState<Partial<Brand>>({
    name: '', slug: '', logo: '', description: '', isActive: true,
  });
  const [logoList, setLogoList] = useState<ProductImage[]>([]);

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'brands'), orderBy('name', 'asc')));
    setBrands(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const reset = () => {
    setEditing(null);
    setForm({ name: '', slug: '', logo: '', description: '', isActive: true });
    setLogoList([]);
  };

  const openEdit = (b: Brand) => {
    setEditing(b);
    setForm(b);
    setLogoList(b.logo ? [{ url: b.logo, isMain: true }] : []);
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) return;

    const payload: any = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      logo: logoList[0]?.url || form.logo || '',
      description: form.description || '',
      isActive: form.isActive ?? true,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editing) {
        await updateDoc(doc(db, 'brands', editing.id), payload);
        toast.success('Brand updated');
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'brands'), payload);
        toast.success('Brand created');
      }
      setOpen(false);
      reset();
      await load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this brand?')) return;
    try {
      await deleteDoc(doc(db, 'brands', id));
      toast.success('Brand deleted');
      await load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Brands"
        subtitle="Manage the brands you sell"
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
            <DialogTrigger asChild>
              <Button><Plus size={14} /> Add Brand</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Brand' : 'New Brand'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={save} className="space-y-4">
                <div>
                  <Label className="text-xs">Name *</Label>
                  <Input
                    value={form.name || ''}
                    onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs">Slug</Label>
                  <Input
                    value={form.slug || ''}
                    onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                    className="mt-1 font-mono text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Description</Label>
                  <Textarea
                    value={form.description || ''}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Logo</Label>
                  <div className="mt-1">
                    <ImageUploader
                      images={logoList}
                      onChange={(imgs) => setLogoList(imgs.slice(0, 1))}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={form.isActive ?? true}
                    onCheckedChange={(v) => setForm({ ...form, isActive: !!v })}
                  />
                  Active
                </label>
                <Button type="submit" className="w-full">Save Brand</Button>
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
        ) : brands.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">No brands yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left hidden md:table-cell">Slug</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-md bg-gray-50 border overflow-hidden flex items-center justify-center shrink-0">
                        {b.logo ? (
                          <Image src={b.logo} alt={b.name} width={36} height={36} className="object-contain" />
                        ) : (
                          <Award size={14} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{b.name}</p>
                        {b.description && (
                          <p className="text-xs text-gray-500 line-clamp-1">{b.description}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell text-gray-500 font-mono text-xs">
                    /{b.slug}
                  </td>
                  <td className="p-3">
                    {b.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Hidden</Badge>}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(b)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => remove(b.id)} className="p-1.5 rounded hover:bg-rose-50 text-rose-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
