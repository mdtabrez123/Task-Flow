import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils.js';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold',
    'transition-all duration-150 ease-out',
    'disabled:pointer-events-none disabled:opacity-40',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
    'active:scale-[0.97]',
    'font-[\'Plus_Jakarta_Sans\',sans-serif]',
  ].join(' '),
  {
    variants: {
      variant: {
        default: [
          'bg-[var(--accent)] text-white',
          'shadow-[0_2px_8px_rgba(235,94,40,0.25)]',
          'hover:bg-[var(--accent-dark)] hover:shadow-[0_4px_16px_rgba(235,94,40,0.35)]',
          'hover:-translate-y-px',
        ].join(' '),

        ghost: [
          'bg-transparent text-[var(--text-secondary)]',
          'hover:bg-white/70 hover:text-[var(--text-primary)]',
        ].join(' '),

        subtle: [
          'bg-white/80 text-[var(--text-primary)]',
          'border border-[var(--border)]',
          'hover:bg-white hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)]',
        ].join(' '),

        outline: [
          'border border-[var(--accent)] text-[var(--accent)]',
          'hover:bg-[var(--accent-subtle)]',
        ].join(' '),

        destructive: [
          'bg-red-500 text-white',
          'hover:bg-red-600 hover:shadow-[0_4px_12px_rgba(239,68,68,0.3)]',
        ].join(' '),
      },
      size: {
        default: 'h-9 px-4 py-2 text-[13.5px] rounded-xl',
        sm:      'h-7 px-3 text-xs rounded-lg',
        lg:      'h-11 px-6 text-sm rounded-xl',
        icon:    'h-8 w-8 rounded-lg',
        'icon-sm': 'h-7 w-7 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

export { Button, buttonVariants };
