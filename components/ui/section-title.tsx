import { cn } from '@/lib/utils';

export function SectionTitle({
  title,
  subtitle,
  action,
  center = false,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-6 flex items-end justify-between gap-4',
        center && 'flex-col items-center text-center',
        className
      )}
    >
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        <div className={cn('mt-3 h-1 w-16 rounded-full bg-rose-500', center && 'mx-auto')} />
      </div>
      {action}
    </div>
  );
}