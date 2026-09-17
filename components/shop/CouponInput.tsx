'use client';
import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { validateCoupon } from '@/lib/firestore/coupons';
import { useCart } from '@/hooks/useCart';
import { formatBDT } from '@/lib/utils';
import { toast } from 'sonner';

export function CouponInput({ subtotal }: { subtotal: number }) {
  const { coupon, setCoupon } = useCart();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const apply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    const r = await validateCoupon(code.trim(), subtotal);
    setLoading(false);

    if (!r.ok) {
      toast.error(r.error);
      return;
    }
    setCoupon(r.coupon);
    toast.success(`Coupon applied: −৳${r.discount}`);
    setCode('');
  };

  if (coupon) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 p-3">
        <div className="flex items-center gap-2 text-sm text-green-800">
          <Tag size={14} />
          <span className="font-medium">{coupon.code}</span>
          <span className="text-xs text-green-700">
            {coupon.type === 'percent' ? `${coupon.value}% off` : `৳${coupon.value} off`}
          </span>
        </div>
        <button
          onClick={() => setCoupon(null)}
          className="text-green-700 hover:text-green-900"
          aria-label="Remove coupon"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <Input
        value={code}
        onChange={(e) => setCode(e.target.value.toUpperCase())}
        placeholder="Coupon code"
        className="flex-1"
      />
      <Button type="button" onClick={apply} disabled={loading}>
        {loading ? '…' : 'Apply'}
      </Button>
    </div>
  );
}