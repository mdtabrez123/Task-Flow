import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog.jsx';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { Sparkles, Tag, Calendar, AlignLeft, Layers, Flag } from 'lucide-react';

const defaultFormState = {
  name: '',
  description: '',
  priority: 'Medium',
  date: '',
  status: 'Pending',
};

const PRIORITIES = [
  { value: 'Low',    color: 'bg-emerald-500', label: 'Low' },
  { value: 'Medium', color: 'bg-amber-400',   label: 'Medium' },
  { value: 'High',   color: 'bg-red-500',     label: 'High' },
];

const STATUSES = ['Pending', 'Not Done', 'Done'];

const fieldLabel = 'flex items-center gap-1.5 mb-2 text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-[0.08em]';

const selectCls = [
  'flex h-10 w-full rounded-xl',
  'border border-[var(--border)] bg-white/70',
  'px-3.5 py-2 text-[13.5px] text-[var(--text-primary)]',
  'outline-none transition-all duration-150 cursor-pointer',
  'hover:border-[var(--border-strong)] hover:bg-white/90',
  'focus:bg-white focus:border-[var(--accent-subtle-border)] focus:ring-2 focus:ring-[var(--accent-subtle)]',
].join(' ');

const CreateTaskModal = ({ open, onOpenChange, onCreateTask }) => {
  const [formState, setFormState] = useState(defaultFormState);
  const [focused, setFocused] = useState('');

  useEffect(() => {
    if (!open) setFormState(defaultFormState);
  }, [open]);

  const updateField = (field) => (e) =>
    setFormState((cur) => ({ ...cur, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateTask({
      id: crypto.randomUUID(),
      name: formState.name.trim(),
      description: formState.description.trim(),
      priority: formState.priority,
      date: formState.date,
      status: formState.status,
    });
    onOpenChange(false);
  };

  const canSubmit = formState.name.trim().length > 0 && formState.date;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(94vw,40rem)] p-0 overflow-hidden">
        {/* Header */}
        <div className="relative border-b border-white/40 bg-gradient-to-br from-[var(--accent)] to-[#f97316] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-white">Create new task</DialogTitle>
              <DialogDescription className="text-white/70 text-xs mt-0.5">
                Add a focused task with a clear due date and ownership.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="bg-[rgba(243,239,232,0.6)] px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className={fieldLabel}>
              <Tag className="h-3 w-3" />
              Title
            </label>
            <Input
              value={formState.name}
              onChange={updateField('name')}
              placeholder="e.g. Finalize the onboarding checklist"
              autoFocus
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused('')}
              className={focused === 'name' ? 'shadow-[0_0_0_4px_rgba(235,94,40,0.08)]' : ''}
            />
          </div>

          {/* Description */}
          <div>
            <label className={fieldLabel}>
              <AlignLeft className="h-3 w-3" />
              Description
            </label>
            <textarea
              value={formState.description}
              onChange={updateField('description')}
              placeholder="Add context, links, or notes…"
              rows={3}
              onFocus={() => setFocused('desc')}
              onBlur={() => setFocused('')}
              className={[
                'flex w-full rounded-xl border border-[var(--border)] bg-white/70',
                'px-3.5 py-2.5 text-[13.5px] text-[var(--text-primary)]',
                'placeholder:text-[var(--text-muted)]',
                'outline-none resize-none transition-all duration-150',
                'hover:border-[var(--border-strong)] hover:bg-white/90',
                'focus:bg-white focus:border-[var(--accent-subtle-border)] focus:ring-2 focus:ring-[var(--accent-subtle)]',
                focused === 'desc' ? 'shadow-[0_0_0_4px_rgba(235,94,40,0.08)]' : '',
              ].join(' ')}
            />
          </div>

          {/* Priority — pill selector */}
          <div>
            <label className={fieldLabel}>
              <Flag className="h-3 w-3" />
              Priority
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map(({ value, color, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormState((c) => ({ ...c, priority: value }))}
                  className={[
                    'flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2.5 text-[12.5px] font-semibold transition-all duration-150 active:scale-95',
                    formState.priority === value
                      ? 'border-[var(--accent-subtle-border)] bg-[var(--accent-subtle)] text-[var(--accent)] shadow-[0_0_0_3px_rgba(235,94,40,0.10)]'
                      : 'border-[var(--border)] bg-white/70 text-[var(--text-secondary)] hover:bg-white hover:border-[var(--border-strong)]',
                  ].join(' ')}
                >
                  <span className={`h-2 w-2 rounded-full ${color}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Due date */}
            <div>
              <label className={fieldLabel}>
                <Calendar className="h-3 w-3" />
                Due date
              </label>
              <Input
                type="date"
                value={formState.date}
                onChange={updateField('date')}
                onFocus={() => setFocused('date')}
                onBlur={() => setFocused('')}
                className={focused === 'date' ? 'shadow-[0_0_0_4px_rgba(235,94,40,0.08)]' : ''}
              />
            </div>

            {/* Column */}
            <div>
              <label className={fieldLabel}>
                <Layers className="h-3 w-3" />
                Column
              </label>
              <select
                value={formState.status}
                onChange={updateField('status')}
                className={selectCls}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>



          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-[var(--border)] pt-4">
            <Button
              type="button"
              variant="subtle"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!canSubmit}
              className="gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Create task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;