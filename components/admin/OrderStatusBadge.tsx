import { Badge } from '@/components/ui/badge';
import { ORDER_STATUS_LABEL } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const variantFor: Record<
  OrderStatus,
  'success' | 'warning' | 'danger' | 'secondary' | 'info' | 'default'
> = {
  pending: 'warning',
  confirmed: 'info',
  processing: 'info',
  shipped: 'default',
  out_for_delivery: 'default',
  delivered: 'success',
  cancelled: 'danger',
  returned: 'danger',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={variantFor[status] as any}>{ORDER_STATUS_LABEL[status]}</Badge>
  );
}