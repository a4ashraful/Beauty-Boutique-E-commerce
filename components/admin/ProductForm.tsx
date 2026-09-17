'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  addDoc, collection, doc, getDocs, serverTimestamp, updateDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUploader } from './ImageUploader';
import { VariantEditor } from './VariantEditor';
import { AdminPageHeader } from './AdminPageHeader';
import { calcDiscount, slugify, SKIN_TYPES, SKIN_CONCERNS } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import type { Brand, Category, Product, ProductImage, ProductVariant } from '@/types';

interface Props {
  initial?: Product;
  mode: 'new' | 'edit';
}

const empty: Partial<Product> = {
  name: '',
  slug: '',
  brandId: '',
  brandName: '',
  categoryId: '',
  categoryName: '',
  subcategoryId: '',
  subcategoryName: '',
  sku: '',
  shortDescription: '',
  description: '',
  regularPrice: 0,
  salePrice: 0,
  stock: 0,
  images: [],
  variants: [],
  size: '',
  ingredients: '',
  benefits: '',
  howToUse: '',
  skinTypes: [],
  skinConcerns: [],
  countryOfOrigin: '',
  expiryInfo: '',
  seoTitle: '',
  metaDescription: '',
  isFeatured: false,
  isBestSeller: false,
  isNewArrival: true,
  isActive: true,
};

export function ProductForm({ initial, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Product>>(initial || empty);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const [cSnap, bSnap] = await Promise.all([
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'brands')),
      ]);
      setCategories(cSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      setBrands(bSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    })();
  }, []);

  const update = (patch: Partial<Product>) => setForm((f) => ({ ...f, ...patch }));

  const setImages = (images: ProductImage[]) => update({ images });

  const setVariants = (variants: ProductVariant[]) => {
    const totalStock = variants.reduce((s, v) => s + (v.stock || 0), 0);
    update({ variants, stock: totalStock || form.stock });
  };

  const toggleArray = (key: 'skinTypes' | 'skinConcerns', value: string) => {
    const arr = form[key] || [];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    update({ [key]: next } as any);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name?.trim()) { toast.error('Name is required'); return; }
    if (!form.regularPrice || form.regularPrice <= 0) { toast.error('Regular price is required'); return; }
    if (!form.images?.length) { toast.error('Add at least one product image'); return; }

    setSaving(true);
    try {
      const cat = categories.find((c) => c.id === form.categoryId);
      const brand = brands.find((b) => b.id === form.brandId);
      const discount = calcDiscount(form.regularPrice || 0, form.salePrice || 0);

      const payload: any = {
        ...form,
        slug: form.slug?.trim() || slugify(form.name!),
        categoryName: cat?.name || '',
        brandName: brand?.name || '',
        discountPercent: discount,
        updatedAt: serverTimestamp(),
      };

      if (mode === 'new') {
        payload.createdAt = serverTimestamp();
        payload.rating = 0;
        payload.reviewCount = 0;
        payload.soldCount = 0;
        payload.viewCount = 0;
        await addDoc(collection(db, 'products'), payload);
        toast.success('Product published');
      } else {
        await updateDoc(doc(db, 'products', initial!.id), payload);
        toast.success('Product updated');
      }
      router.push('/admin/products');
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const subcats = categories.filter((c) => c.parentId === form.categoryId);

  return (
    <form onSubmit={save}>
      <AdminPageHeader
        title={mode === 'new' ? 'Add Product' : 'Edit Product'}
        subtitle={mode === 'new' ? 'Create a new listing' : form.name}
        backHref="/admin/products"
        action={
          <Button type="submit" disabled={saving}>
            {saving ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : mode === 'new' ? 'Publish Product' : 'Save Changes'}
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
        {/* LEFT */}
        <div className="space-y-5">
          {/* Basic */}
          <section className="rounded-xl border bg-white p-5 space-y-4">
            <h2 className="font-semibold">Basic Information</h2>
            <div>
              <Label className="text-xs">Product Name *</Label>
              <Input
                value={form.name || ''}
                onChange={(e) => update({ name: e.target.value, slug: slugify(e.target.value) })}
                placeholder="e.g. Hydrating Face Serum"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label className="text-xs">Slug (URL)</Label>
              <Input
                value={form.slug || ''}
                onChange={(e) => update({ slug: slugify(e.target.value) })}
                className="mt-1 font-mono text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Short Description</Label>
              <Textarea
                value={form.shortDescription || ''}
                onChange={(e) => update({ shortDescription: e.target.value })}
                rows={2}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Full Description</Label>
              <Textarea
                value={form.description || ''}
                onChange={(e) => update({ description: e.target.value })}
                rows={5}
                className="mt-1"
              />
            </div>
          </section>

          {/* Images */}
          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold mb-3">Product Images</h2>
            <ImageUploader images={form.images || []} onChange={setImages} />
          </section>

          {/* Pricing */}
          <section className="rounded-xl border bg-white p-5 space-y-4">
            <h2 className="font-semibold">Pricing & Stock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Regular Price (৳) *</Label>
                <Input
                  type="number"
                  value={form.regularPrice || ''}
                  onChange={(e) => update({ regularPrice: Number(e.target.value) })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label className="text-xs">Sale Price (৳)</Label>
                <Input
                  type="number"
                  value={form.salePrice || ''}
                  onChange={(e) => update({ salePrice: Number(e.target.value) })}
                  className="mt-1"
                />
                {form.regularPrice && form.salePrice ? (
                  <p className="text-xs text-green-600 mt-1">
                    −{calcDiscount(form.regularPrice, form.salePrice)}% discount
                  </p>
                ) : null}
              </div>
              <div>
                <Label className="text-xs">Stock *</Label>
                <Input
                  type="number"
                  value={form.stock ?? ''}
                  onChange={(e) => update({ stock: Number(e.target.value) })}
                  className="mt-1"
                  disabled={!!form.variants?.length}
                />
                {form.variants?.length ? (
                  <p className="text-xs text-gray-500 mt-1">Auto from variants</p>
                ) : null}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">SKU</Label>
                <Input
                  value={form.sku || ''}
                  onChange={(e) => update({ sku: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Size / Volume</Label>
                <Input
                  value={form.size || ''}
                  onChange={(e) => update({ size: e.target.value })}
                  placeholder="e.g. 30ml"
                  className="mt-1"
                />
              </div>
            </div>
          </section>

          {/* Variants */}
          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold mb-3">Variants (shades, sizes)</h2>
            <VariantEditor
              variants={form.variants || []}
              onChange={setVariants}
              basePrice={form.salePrice || form.regularPrice || 0}
            />
          </section>

          {/* Details */}
          <section className="rounded-xl border bg-white p-5 space-y-4">
            <h2 className="font-semibold">Product Details</h2>
            <div>
              <Label className="text-xs">Ingredients</Label>
              <Textarea
                value={form.ingredients || ''}
                onChange={(e) => update({ ingredients: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Benefits</Label>
              <Textarea
                value={form.benefits || ''}
                onChange={(e) => update({ benefits: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">How to Use</Label>
              <Textarea
                value={form.howToUse || ''}
                onChange={(e) => update({ howToUse: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs mb-2 block">Suitable Skin Types</Label>
              <div className="flex flex-wrap gap-2">
                {SKIN_TYPES.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleArray('skinTypes', s)}
                    className={`text-xs px-3 py-1.5 rounded-full border ${
                      form.skinTypes?.includes(s)
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'border-gray-300 hover:border-rose-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-xs mb-2 block">Skin Concerns</Label>
              <div className="flex flex-wrap gap-2">
                {SKIN_CONCERNS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => toggleArray('skinConcerns', s)}
                    className={`text-xs px-3 py-1.5 rounded-full border ${
                      form.skinConcerns?.includes(s)
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'border-gray-300 hover:border-rose-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Country of Origin</Label>
                <Input
                  value={form.countryOfOrigin || ''}
                  onChange={(e) => update({ countryOfOrigin: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Expiry / Batch Info</Label>
                <Input
                  value={form.expiryInfo || ''}
                  onChange={(e) => update({ expiryInfo: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </section>

          {/* SEO */}
          <section className="rounded-xl border bg-white p-5 space-y-4">
            <h2 className="font-semibold">SEO</h2>
            <div>
              <Label className="text-xs">SEO Title</Label>
              <Input
                value={form.seoTitle || ''}
                onChange={(e) => update({ seoTitle: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Meta Description</Label>
              <Textarea
                value={form.metaDescription || ''}
                onChange={(e) => update({ metaDescription: e.target.value })}
                rows={2}
                className="mt-1"
              />
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <aside className="space-y-5">
          <section className="rounded-xl border bg-white p-5 space-y-4">
            <h2 className="font-semibold">Organization</h2>
            <div>
              <Label className="text-xs">Category</Label>
              <select
                value={form.categoryId || ''}
                onChange={(e) => update({ categoryId: e.target.value, subcategoryId: '' })}
                className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
              >
                <option value="">— None —</option>
                {categories.filter((c) => !c.parentId).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            {subcats.length > 0 && (
              <div>
                <Label className="text-xs">Subcategory</Label>
                <select
                  value={form.subcategoryId || ''}
                  onChange={(e) => {
                    const sc = subcats.find((s) => s.id === e.target.value);
                    update({ subcategoryId: sc?.id || '', subcategoryName: sc?.name || '' });
                  }}
                  className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
                >
                  <option value="">— None —</option>
                  {subcats.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <Label className="text-xs">Brand</Label>
              <select
                value={form.brandId || ''}
                onChange={(e) => update({ brandId: e.target.value })}
                className="mt-1 flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm"
              >
                <option value="">— None —</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </section>

          <section className="rounded-xl border bg-white p-5 space-y-3">
            <h2 className="font-semibold">Flags</h2>
            <FlagRow
              label="Active (visible on site)"
              checked={!!form.isActive}
              onChange={(v) => update({ isActive: v })}
            />
            <FlagRow
              label="Featured product"
              checked={!!form.isFeatured}
              onChange={(v) => update({ isFeatured: v })}
            />
            <FlagRow
              label="Best seller"
              checked={!!form.isBestSeller}
              onChange={(v) => update({ isBestSeller: v })}
            />
            <FlagRow
              label="New arrival"
              checked={!!form.isNewArrival}
              onChange={(v) => update({ isNewArrival: v })}
            />
          </section>
        </aside>
      </div>
    </form>
  );
}

function FlagRow({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm cursor-pointer">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} />
      {label}
    </label>
  );
}