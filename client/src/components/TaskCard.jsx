import React, { useState } from 'react';
import { CalendarDays, Trash2, MoreHorizontal, ArrowRight } from 'lucide-react';
import { formatDate } from '../utils/formatDate.js';
import { Badge, PriorityDot } from './ui/badge.jsx';
import { Button } from './ui/button.jsx';

const STATUS_NEXT = {
  'Pending':  'Not Done',
  'Not Done': 'Done',
  'Done':     'Pending',
};

const STATUS_ARROW_LABEL = {
  'Pending':  'Start',
  'Not Done': 'Complete',
  'Done':     'Reopen',
};

const TaskCard = ({ task, onUpdateStatus, onDelete, onDragStart, isDragging }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const taskId = task.id || task._id;

  const handleQuickAdvance = (e) => {
    e.stopPropagation();
    onUpdateStatus(taskId, STATUS_NEXT[task.status]);
  };

  return (
    <article
      draggable
      onDragStart={() => onDragStart?.(taskId)}
      className={[
        'task-card group',
        'flex flex-col gap-3',
        'rounded-2xl border border-[var(--border)]',
        'bg-white/90 p-4',
        'shadow-[var(--shadow-sm)]',
        isDragging ? 'opacity-40 rotate-1 scale-95' : '',
      ].join(' ')}
    >
      {/* ── Top row: priority dot + badges + menu ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <PriorityDot priority={task.priority} />
          <Badge priority={task.priority}>{task.priority}</Badge>
          <Badge status={task.status}>{task.status}</Badge>
        </div>

        <div className="relative flex shrink-0 items-center gap-1">
          {/* Quick delete — appears on hover */}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete(taskId)}
            className="opacity-0 text-stone-400 transition-all duration-150 hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
            aria-label="Delete task"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>

          {/* Status select (accessible, shown on hover) */}
          <div className="relative opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="More options"
            >
              <MoreHorizontal className="h-3.5 w-3.5 text-stone-400" />
            </Button>

            {menuOpen && (
              <div
                className="absolute right-0 top-8 z-10 w-36 animate-scale-in overflow-hidden rounded-xl border border-[var(--border)] bg-white/95 shadow-[var(--shadow-lg)] backdrop-blur-sm"
                onMouseLeave={() => setMenuOpen(false)}
              >
                {['Pending', 'Not Done', 'Done'].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { onUpdateStatus(taskId, s); setMenuOpen(false); }}
                    className={[
                      'flex w-full items-center gap-2 px-3 py-2 text-[12.5px] font-medium transition-colors duration-100',
                      task.status === s
                        ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                        : 'text-[var(--text-secondary)] hover:bg-stone-50',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'h-1.5 w-1.5 rounded-full',
                        s === 'Done' ? 'bg-emerald-500' : s === 'Not Done' ? 'bg-[var(--accent)]' : 'bg-stone-300',
                      ].join(' ')}
                    />
                    {s}
                    {task.status === s && <span className="ml-auto text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1">
        <h3 className="text-[17px] font-normal leading-snug tracking-tight text-[var(--text-primary)] break-words">
          {task.name}
        </h3>
        {task.description && (
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--text-secondary)] line-clamp-2">
            {task.description}
          </p>
        )}
      </div>



      {/* ── Footer ── */}
      <div className="flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
        {/* Date */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1 text-[11.5px] text-[var(--text-muted)]">
            <CalendarDays className="h-3 w-3 shrink-0" />
            <span className="font-medium">{formatDate(task.date)}</span>
          </div>
        </div>

        {/* Quick-advance button */}
        <button
          type="button"
          onClick={handleQuickAdvance}
          className={[
            'flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold',
            'transition-all duration-150 active:scale-95',
            task.status === 'Done'
              ? 'text-emerald-600 hover:bg-emerald-50'
              : 'text-[var(--accent)] hover:bg-[var(--accent-subtle)]',
          ].join(' ')}
          title={`Move to ${STATUS_NEXT[task.status]}`}
        >
          {STATUS_ARROW_LABEL[task.status]}
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </article>
  );
};

export default TaskCard;
