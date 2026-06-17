import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium border transition-colors',
  {
    variants: {
      variant: {
        healthy: 'bg-green-500/10 text-green-400 border-green-500/30',
        degraded: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        down: 'bg-red-500/10 text-red-400 border-red-500/30',
        default: 'bg-bg-hover text-text-secondary border-border-subtle',
        cost: 'bg-green-500/10 text-green-400 border-green-500/30 font-mono',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
