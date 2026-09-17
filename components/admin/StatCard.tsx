import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatCard({
  label, value, icon: Icon, color = 'rose', hint, trend,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'rose' | 'blue' | 'green' | 'yellow' | 'purple' | 'gray' | 'orange' | 'pink' | 'teal' | 'indigo';
  hint?: string;
  trend?: { value: number; up: boolean };
}) {
  const colors: Record<string, string> = {
    rose: 'bg-rose-100 text-rose-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    purple: 'bg-purple-100 text-purple-700',
    gray: 'bg-gray-100 text-gray-700',
    orange: 'bg-orange-100 text-orange-700',
    pink: 'bg-pink-100 text-pink-700',
    teal: 'bg-teal-100 text-teal-700',
    indigo: 'bg-indigo-100 text-indigo-700',
  };

  return (
    <div className="rounded-xl border bg-white p-4 hover:shadow-sm transition">
      <div className="flex items-start justify-between">
        <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', colors[color])}>
          <Icon size={18} />
        </div>
        {trend && (
          <span className={cn(
            'inline-flex items-center gap-1 text-xs font-medium',
            trend.up ? 'text-green-600' : 'text-red-600'
          )}>
            {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}