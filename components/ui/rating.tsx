import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Rating({
  value = 0,
  size = 14,
  className,
  showValue = false,
  count,
}: {
  value?: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  count?: number;
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              size={size}
              className={cn(
                filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs text-gray-500">
          {value.toFixed(1)} {count !== undefined && `(${count})`}
        </span>
      )}
    </div>
  );
}