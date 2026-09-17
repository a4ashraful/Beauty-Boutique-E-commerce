'use client';
import { useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { Rating } from '@/components/ui/rating';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import { reviewsCol } from '@/lib/firebase/collections';
import { auth } from '@/lib/firebase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import type { Review } from '@/types';

export function ReviewsSection({
  productId,
  initialReviews,
}: {
  productId: string;
  initialReviews: Review[];
}) {
  const { user, profile } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [form, setForm] = useState({ rating: 5, comment: '', name: '' });
  const [submitting, setSubmitting] = useState(false);

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.comment.trim() || form.comment.trim().length < 3) {
      toast.error('Please write a review');
      return;
    }
    setSubmitting(true);
    try {
      const name = form.name || profile?.name || 'Anonymous';
      await addDoc(reviewsCol, {
        productId,
        customerId: user?.uid || null,
        customerName: name,
        rating: form.rating,
        comment: form.comment.trim(),
        isApproved: false, // admin approves
        isFeatured: false,
        createdAt: serverTimestamp(),
      });
      toast.success('Thank you! Your review is awaiting approval.');
      setForm({ rating: 5, comment: '', name: '' });
    } catch (e: any) {
      toast.error(e.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-bold mb-6">Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Summary */}
        <div className="rounded-xl border p-5 bg-rose-50/40 h-fit">
          <p className="text-4xl font-bold text-rose-600">{avg.toFixed(1)}</p>
          <Rating value={avg} size={16} />
          <p className="text-xs text-gray-500 mt-1">
            Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </p>

          <div className="mt-4 space-y-1">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => Math.round(r.rating) === star).length;
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3">{star}</span>
                  <Star size={11} className="fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-yellow-400" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-gray-500 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* List + form */}
        <div className="space-y-5">
          {reviews.length === 0 && (
            <div className="rounded-xl border p-8 text-center text-gray-500 text-sm">
              <MessageCircle size={28} className="mx-auto text-rose-300 mb-2" />
              No reviews yet. Be the first!
            </div>
          )}

          {reviews.map((r) => (
            <div key={r.id} className="rounded-xl border p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-semibold text-sm shrink-0">
                  {r.customerName?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{r.customerName || 'Anonymous'}</p>
                    <Rating value={r.rating} size={11} />
                    <span className="text-xs text-gray-400">
                      {formatDate(r.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">{r.comment}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Review form */}
          <div className="rounded-xl border p-5 bg-gray-50">
            <h3 className="text-sm font-semibold mb-3">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label className="text-xs">Rating</Label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, rating: s }))}
                    >
                      <Star
                        size={20}
                        className={
                          s <= form.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {!user && (
                <div>
                  <Label className="text-xs">Your Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label className="text-xs">Your Review</Label>
                <Textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  placeholder="Share your experience…"
                  rows={4}
                  className="mt-1"
                />
              </div>

              <Button type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Review'}
              </Button>
              <p className="text-[11px] text-gray-500">
                Reviews are published after approval.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}