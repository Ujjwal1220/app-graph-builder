import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-accent-purple text-white hover:bg-purple-600',
        outline: 'border border-border-subtle bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary',
        ghost: 'bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary',
        destructive: 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20',
        secondary: 'bg-bg-hover text-text-secondary hover:bg-bg-card hover:text-text-primary border border-border-subtle',
      },
      size: {
        default: 'h-7 px-3 py-1.5',
        sm: 'h-6 px-2 py-1',
        lg: 'h-9 px-4 py-2 text-sm',
        icon: 'h-7 w-7',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
);
Button.displayName = 'Button';

// eslint-disable-next-line react-refresh/only-export-components
export { buttonVariants };
