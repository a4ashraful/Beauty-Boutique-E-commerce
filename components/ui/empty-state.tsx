import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-rose-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>}
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="mt-6 inline-flex items-center rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-700"
        >
          {actionText}
        </Link>
      )}
    </div>
  );
}