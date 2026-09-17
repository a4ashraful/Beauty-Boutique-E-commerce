'use client';
import { useEffect, useState } from 'react';
import {
  Plus, Edit, Trash2, Loader2, FolderTree,
} from 'lucide-react';
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  orderBy, query, serverTimestamp,
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
import type { Category, ProductImage } from '@/types';

export default function AdminCategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Partial<Category>>({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: null,
    order: 0,
    isActive: true,
  });
  const [imageList, setImageList] = useState<ProductImage[]>([]);

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'categories'), orderBy('order', 'asc')));
    setCategories(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const reset = () => {
    setEditing(null);
    setForm({ name: '', slug: '', description: '', image: '', parentId: null, order: 0, isActive: true });
    setImageList([]);
  };

  const openEdit = (c: Category) => {
    setEditing(c);
    setForm(c);
    setImageList(c.image ? [{ url: c.image, isMain: true }] : []);
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) return;

    const payload: any = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || '',
      image: imageList[0]?.url || form.image || '',
      parentId: form.parentId || null,
      order: form.order ?? 0,
      isActive: form.isActive ?? true,
      updatedAt: serverTimestamp(),
    };

    try {
      if (editing) {
        await updateDoc(doc(db, 'categories', editing.id), payload);
        toast.success('Category updated');
      } else {
        payload.createdAt = serverTimestamp();
        await addDoc(collection(db, 'categories'), payload);
        toast.success('Category created');
      }
      setOpen(false);
      reset();
      await load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteDoc(doc(db, 'categories', id));
      toast.success('Category deleted');
      await load();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const roots = categories.filter((c) => !c.parentId);

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        subtitle="Organize your products by category"
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
            <DialogTrigger asChild>
              <Button><Plus size={14} /> Add Category</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing ? 'Edit Category' : 'New Category'}</DialogTitle>
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
                  <Label className="text-xs">Parent (for subcategory)</Label>
                  <select
                    value={form.parentId || ''}
                    onChange={(e) => setForm({ ...form, parentId: e.target.value || null })}
                    className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
                  >
                    <option value="">— Root category —</option>
                    {roots.filter((c) => c.id !== editing?.id).map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
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
                  <Label className="text-xs">Image</Label>
                  <div className="mt-1">
                    <ImageUploader
                      images={imageList}
                      onChange={(imgs) => setImageList(imgs.slice(0, 1))}
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
                <Button type="submit" className="w-full">Save Category</Button>
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
        ) : categories.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            No categories yet. Add your first category.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left hidden md:table-cell">Slug</th>
                <th className="p-3 text-left hidden lg:table-cell">Type</th>
                <th className="p-3 text-left">Order</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((c) => {
                const parent = categories.find((p) => p.id === c.parentId);
                return (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                          <FolderTree size={14} />
                        </div>
                        <div>
                          <p className="font-medium">
                            {parent && <span className="text-gray-400 mr-1">↳</span>}
                            {c.name}
                          </p>
                          {parent && (
                            <p className="text-[11px] text-gray-500">in {parent.name}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell text-gray-500 font-mono text-xs">
                      /{c.slug}
                    </td>
                    <td className="p-3 hidden lg:table-cell">
                      {c.parentId ? <Badge variant="secondary">Sub</Badge> : <Badge>Root</Badge>}
                    </td>
                    <td className="p-3">{c.order ?? 0}</td>
                    <td className="p-3">
                      {c.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="secondary">Hidden</Badge>}
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
        )}
      </div>
    </div>
  );
}
