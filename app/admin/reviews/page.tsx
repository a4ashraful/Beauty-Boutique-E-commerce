'use client';
import { useEffect, useMemo, useState } from 'react';
import {
  Loader2, Star, Check, EyeOff, Trash2, Sparkles, Search,
} from 'lucide-react';
import {
  collection, getDocs, updateDoc, deleteDoc, doc, orderBy, query, where, serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';
import type { Review } from '@/types';

const TABS = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'featured', label: 'Featured' },
  { id: 'all', label: 'All' },
];

export default function AdminReviewsPage() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const snap = await getDocs(query(collection(db, 'reviews'), orderBy('createdAt', 'desc')));
    setReviews(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    let list = reviews;
    if (tab === 'pending') list = list.filter((r) => !r.isApproved);
    else if (tab === 'approved') list = list.filter((r) => r.isApproved);
    else if (tab === 'featured') list = list.filter((r) => r.isFeatured);
    if (search.trim()) {
      const t = search.toLowerCase();
      list = list.filter(
        (r) => r.comment.toLowerCase().includes(t) || r.customerName?.toLowerCase().includes(t)
      );
    }
    return list;
  }, [reviews, tab, search]);

  const counts = useMemo(() => ({
    pending: reviews.filter((r) => !r.isApproved).length,
    approved: reviews.filter((r) => r.isApproved).length,
    featured: reviews.filter((r) => r.isFeatured).length,
    all: reviews.length,
  }), [reviews]);

  const setApproved = async (id: string, isApproved: boolean) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { isApproved, updatedAt: serverTimestamp() });
      setReviews((r) => r.map((x) => (x.id === id ? { ...x, isApproved } : x)));
      toast.success(isApproved ? 'Review approved' : 'Review hidden');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const setFeatured = async (id: string, isFeatured: boolean) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { isFeatured, updatedAt: serverTimestamp() });
      setReviews((r) => r.map((x) => (x.id === id ? { ...x, isFeatured } : x)));
      toast.success(isFeatured ? 'Marked as featured' : 'Removed from featured');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await deleteDoc(doc(db, 'reviews', id));
      setReviews((r) => r.filter((x) => x.id !== id));
      toast.success('Deleted');
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <AdminPageHeader
        title="Reviews"
        subtitle={`${counts.pending} pending · ${counts.approved} approved`}
      />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 h-9 rounded-full text-sm font-medium whitespace-nowrap ${
              tab === t.id ? 'bg-rose-600 text-white' : 'bg-white border text-gray-700'
            }`}
          >
            {t.label}
            <span className={`ml-1.5 text-xs ${tab === t.id ? 'text-white/80' : 'text-gray-400'}`}>
              {(counts as any)[t.id] || 0}
            </span>
          </button>
        ))}
      </div>

      <div className="relative max-w-md mb-4">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reviews…"
          className="pl-9"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-rose-600" size={24} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border bg-white p-16 text-center text-sm text-gray-500">
          <Star size={24} className="mx-auto text-gray-300 mb-2" />
          No reviews in this view.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-semibold text-sm shrink-0">
                  {r.customerName?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{r.customerName || 'Anonymous'}</p>
                    <Rating value={r.rating} size={12} />
                    {r.isApproved ? (
                      <Badge variant="success" className="text-[10px]">Approved</Badge>
                    ) : (
                      <Badge variant="warning" className="text-[10px]">Pending</Badge>
                    )}
                    {r.isFeatured && (
                      <Badge variant="info" className="text-[10px]">Featured</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {formatDateTime(r.createdAt)} · Product: {r.productId.slice(0, 8)}…
                  </p>
                  <p className="text-sm text-gray-700 mt-2 leading-relaxed">{r.comment}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t flex items-center gap-2 flex-wrap">
                {!r.isApproved ? (
                  <Button size="sm" onClick={() => setApproved(r.id, true)}>
                    <Check size={12} /> Approve
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setApproved(r.id, false)}
                  >
                    <EyeOff size={12} /> Hide
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setFeatured(r.id, !r.isFeatured)}
                >
                  <Sparkles size={12} /> {r.isFeatured ? 'Unfeature' : 'Feature'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => remove(r.id)}
                  className="text-rose-600 ml-auto"
                >
                  <Trash2 size={12} /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
