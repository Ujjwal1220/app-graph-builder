import { Badge } from './badge';
import type { NodeStatus } from '../../types';

interface StatusBadgeProps {
  status: NodeStatus;
  className?: string;
}

const statusMap: Record<NodeStatus, { variant: 'healthy' | 'degraded' | 'down'; label: string }> = {
  Healthy: { variant: 'healthy', label: '● Healthy' },
  Degraded: { variant: 'degraded', label: '⚠ Degraded' },
  Down: { variant: 'down', label: '✕ Down' },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { variant, label } = statusMap[status];
  return <Badge variant={variant} className={className}>{label}</Badge>;
}
