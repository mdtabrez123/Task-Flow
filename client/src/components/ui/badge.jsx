import React from 'react';
import { cn } from '../../lib/utils.js';

const priorityConfig = {
  High:   { dot: 'bg-red-500',    badge: 'bg-red-50 text-red-600 border-red-200',       ring: 'ring-red-200' },
  Medium: { dot: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-700 border-amber-200', ring: 'ring-amber-200' },
  Low:    { dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', ring: 'ring-emerald-200' },
};

const statusConfig = {
  'To Do':       { badge: 'bg-stone-100 text-stone-600 border-stone-200' },
  'In Progress': { badge: 'bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent-subtle-border)]' },
  'Done':        { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

export function Badge({ className, children, variant, priority, status }) {
  let base = 'bg-stone-100 text-stone-600 border-stone-200';

  if (priority && priorityConfig[priority]) {
    base = priorityConfig[priority].badge;
  } else if (status && statusConfig[status]) {
    base = statusConfig[status].badge;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-2 py-0.5',
        'text-[10.5px] font-semibold uppercase tracking-[0.09em]',
        'font-[\'Plus_Jakarta_Sans\',sans-serif]',
        base,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PriorityDot({ priority, className }) {
  const config = priorityConfig[priority] || priorityConfig.Low;
  return (
    <span
      className={cn('inline-block h-2 w-2 rounded-full shrink-0', config.dot, className)}
    />
  );
}
