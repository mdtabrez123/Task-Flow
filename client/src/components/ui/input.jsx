import React from 'react';
import { cn } from '../../lib/utils.js';

const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-xl',
        'border border-[var(--border)] bg-white/70',
        'px-4 py-2 text-[13.5px] text-[var(--text-primary)]',
        'placeholder:text-[var(--text-muted)]',
        'outline-none',
        'transition-all duration-150',
        'hover:border-[var(--border-strong)] hover:bg-white/90',
        'focus:bg-white focus:border-[var(--accent-subtle-border)] focus:ring-2 focus:ring-[var(--accent-subtle)] focus:ring-offset-0',
        'shadow-[inset_0_1px_2px_rgba(28,25,23,0.04)]',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
