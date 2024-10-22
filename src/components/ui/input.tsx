import * as React from 'react';

import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const inputVariants = cva(
  'flex h-9 w-full rounded-md bg-transparent px-3 py-1 text-sm transition-colors file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border border-input file:border-0 focus-visible:ring-1 focus-visible:ring-ring shadow-sm',
        // destructive:
        //   'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        // outline:
        //   'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        // secondary:
        //   'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
