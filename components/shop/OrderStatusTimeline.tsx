import { Check, Clock, Package, Truck, Home, XCircle, PackageX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const ICONS: Record<string, any> = {
  pending: Clock,
  confirmed: Check,
  processing: Package,
  shipped: Truck,
  out_for_delivery: Truck,
  delivered: Home,
  cancelled: XCircle,
  returned: PackageX,
};

export function OrderStatusTimeline({ status }: { status: OrderStatus }) {
  // Cancelled/returned: show separate view
  if (status === 'cancelled' || status === 'returned') {
    const Icon = ICONS[status];
    return (
      <div className={cn(
        'rounded-xl border p-5 flex items-center gap-3',
        status === 'cancelled' ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-200'
      )}>
        <Icon className={status === 'cancelled' ? 'text-red-600' : 'text-orange-600'} size={28} />
        <div>
          <p className="font-semibold">{ORDER_STATUS_LABEL[status]}</p>
          <p className="text-xs text-gray-600 mt-0.5">
            {status === 'cancelled'
              ? 'This order has been cancelled.'
              : 'This order was returned/refunded.'}
          </p>
        </div>
      </div>
    );
  }

  const currentIdx = ORDER_STATUS_FLOW.indexOf(status);
  const progress = currentIdx >= 0 ? ((currentIdx + 1) / ORDER_STATUS_FLOW.length) * 100 : 0;

  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Order Progress</span>
          <span className="font-medium text-rose-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-rose-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Desktop timeline */}
      <ol className="hidden md:flex justify-between gap-2">
        {ORDER_STATUS_FLOW.map((s, idx) => {
          const Icon = ICONS[s];
          const done = idx <= currentIdx;
          const current = idx === currentIdx;
          return (
            <li key={s} className="flex flex-col items-center flex-1 text-center relative">
              <div
                className={cn(
                  'h-10 w-10 rounded-full flex items-center justify-center border-2 transition',
                  done
                    ? 'bg-rose-600 border-rose-600 text-white'
                    : 'bg-white border-gray-200 text-gray-400',
                  current && 'ring-4 ring-rose-100'
                )}
              >
                <Icon size={16} />
              </div>
              <p
                className={cn(
                  'mt-2 text-[11px] font-medium',
                  done ? 'text-gray-900' : 'text-gray-400'
                )}
              >
                {ORDER_STATUS_LABEL[s]}
              </p>
            </li>
          );
        })}
      </ol>

      {/* Mobile timeline */}
      <ol className="md:hidden space-y-3">
        {ORDER_STATUS_FLOW.map((s, idx) => {
          const Icon = ICONS[s];
          const done = idx <= currentIdx;
          return (
            <li key={s} className="flex items-center gap-3">
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                  done ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-400'
                )}
              >
                <Icon size={14} />
              </div>
              <span
                className={cn(
                  'text-sm',
                  done ? 'font-medium text-gray-900' : 'text-gray-400'
                )}
              >
                {ORDER_STATUS_LABEL[s]}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}