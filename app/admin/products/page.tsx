'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus, Search, Edit, Trash2, Copy, Eye, EyeOff, Loader2,
  Star, ShoppingBag, CheckSquare, Square,
} from 'lucide-react';
import {
  collection, getDocs, orderBy, query, doc, updateDoc, deleteDoc,
  addDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { formatBDT, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { Product } from '@/types';

export default function AdminProductsPage() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc')));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const t = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(t) ||
        p.sku?.toLowerCase().includes(t) ||
        p.brandName?.toLowerCase().includes(t)
    );
  }, [products, search]);

  const toggleSelect = (id: string) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelected(s);
  };

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((p) => p.filter((x) => x.id !== id));
      toast.success('Product deleted');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await updateDoc(doc(db, 'products', id), { isActive: !isActive, updatedAt: serverTimestamp() });
      setProducts((p) => p.map((x) => x.id === id ? { ...x, isActive: !isActive } : x));
      toast.success(isActive ? 'Unpublished' : 'Published');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleDuplicate = async (p: Product) => {
    try {
      const { id, createdAt, updatedAt, ...rest } = p as any;
      await addDoc(collection(db, 'products'), {
        ...rest,
        name: `${p.name} (Copy)`,
        slug: `${p.slug}-copy-${Date.now()}`,
        isActive: false,
        soldCount: 0,
        viewCount: 0,
        reviewCount: 0,
        rating: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await load();
      toast.success('Product duplicated');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const bulkToggle = async (isActive: boolean) => {
    if (!selected.size) return;
    try {
      await Promise.all(
        Array.from(selected).map((id) =>
          updateDoc(doc(db, 'products', id), { isActive, updatedAt: serverTimestamp() })
        )
      );
      await load();
      setSelected(new Set());
      toast.success(`Bulk updated`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const bulkDelete = async () => {
    if (!selected.size || !confirm(`Delete ${selected.size} products?`)) return;
    try {
      await Promise.all(Array.from(selected).map((id) => deleteDoc(doc(db, 'products', id))));
      await load();
      setSelected(new Set());
      toast.success('Deleted');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Products"
        subtitle={`${products.length} product(s) total`}
        action={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus size={14} /> Add Product
            </Link>
          </Button>
        }
      />

      {/* Search + bulk actions */}
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU or brand…"
            className="pl-9"
          />
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">{selected.size} selected</span>
            <Button size="sm" variant="outline" onClick={() => bulkToggle(true)}>
              Publish
            </Button>
            <Button size="sm" variant="outline" onClick={() => bulkToggle(false)}>
              Unpublish
            </Button>
            <Button size="sm" variant="destructive" onClick={bulkDelete}>
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-rose-600" size={24} />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-gray-500">
            No products found.{' '}
            <Link href="/admin/products/new" className="text-rose-600 font-medium">
              Add your first product →
            </Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="w-10 p-3 text-left">
                    <button onClick={toggleAll} className="flex items-center">
                      {selected.size === filtered.length ? (
                        <CheckSquare size={16} className="text-rose-600" />
                      ) : (
                        <Square size={16} />
                      )}
                    </button>
                  </th>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3 text-left hidden md:table-cell">Category</th>
                  <th className="p-3 text-left hidden lg:table-cell">Price</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left hidden lg:table-cell">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((p) => {
                  const img = p.images?.find((i) => i.isMain)?.url || p.images?.[0]?.url;
                  const price = p.salePrice ?? p.regularPrice;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="p-3">
                        <button onClick={() => toggleSelect(p.id)} className="flex items-center">
                          {selected.has(p.id) ? (
                            <CheckSquare size={16} className="text-rose-600" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded-md overflow-hidden bg-gray-100 shrink-0">
                            {img && <Image src={img} alt={p.name} fill sizes="40px" className="object-cover" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[240px]">{p.name}</p>
                            <p className="text-xs text-gray-500">
                              {p.brandName || '—'} {p.sku && `· ${p.sku}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell text-gray-600">
                        {p.categoryName || '—'}
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <span className="font-medium">{formatBDT(price)}</span>
                        {p.salePrice && (
                          <span className="text-xs text-gray-400 line-through ml-1">
                            {formatBDT(p.regularPrice)}
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={
                            (p.stock ?? 0) === 0
                              ? 'text-red-600 font-semibold'
                              : (p.stock ?? 0) <= 5
                              ? 'text-orange-600 font-semibold'
                              : 'text-gray-700'
                          }
                        >
                          {p.stock ?? 0}
                        </span>
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {p.isActive ? (
                            <Badge variant="success">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                          {p.isFeatured && <Badge variant="warning">Featured</Badge>}
                          {p.isBestSeller && <Badge variant="info">Best</Badge>}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 justify-end">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                            title="View"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => handleToggleActive(p.id, p.isActive)}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                            title={p.isActive ? 'Unpublish' : 'Publish'}
                          >
                            {p.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                            title="Duplicate"
                          >
                            <Copy size={14} />
                          </button>
                          <Link
                            href={`/admin/products/${p.id}/edit`}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1.5 rounded hover:bg-rose-50 text-rose-600"
                            title="Delete"
                          >
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
