import React, { useState } from 'react';
import { Menu, Plus, Search, Command, X, Bell } from 'lucide-react';
import { Button } from './ui/button.jsx';
import { Input } from './ui/input.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const DashboardHeader = ({ searchValue, onSearchChange, onMenuClick, onCreateTask }) => {
  const { currentUser } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifHovered, setNotifHovered] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[rgba(243,239,232,0.85)] backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">

        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-white/80 text-[var(--text-secondary)] transition-all duration-150 hover:bg-white hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] active:scale-95 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Search bar */}
        <div
          className={[
            'relative flex-1 max-w-md transition-all duration-200',
            searchFocused ? 'max-w-lg' : '',
          ].join(' ')}
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)] transition-colors duration-150" />
          <input
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search tasks…"
            className={[
              'flex h-9 w-full rounded-xl pl-9 pr-10 text-[13.5px]',
              'border border-[var(--border)] bg-white/70 text-[var(--text-primary)]',
              'placeholder:text-[var(--text-muted)]',
              'outline-none transition-all duration-150',
              'hover:border-[var(--border-strong)] hover:bg-white/90',
              'focus:bg-white focus:border-[var(--accent-subtle-border)] focus:ring-2 focus:ring-[var(--accent-subtle)] focus:shadow-[0_0_0_4px_rgba(235,94,40,0.06)]',
              searchValue ? '' : '',
            ].join(' ')}
          />
          {/* Keyboard shortcut hint */}
          {!searchFocused && !searchValue && (
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
              <kbd className="rounded bg-stone-100 px-1 py-0.5 text-[9px] font-medium text-[var(--text-muted)]">⌘K</kbd>
            </div>
          )}
          {/* Clear button */}
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors duration-100"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* New task — primary CTA */}
          <Button
            type="button"
            variant="default"
            size="default"
            onClick={onCreateTask}
            className="flex gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            New task
          </Button>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              onMouseEnter={() => setNotifHovered(true)}
              onMouseLeave={() => setNotifHovered(false)}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-white/80 text-[var(--text-muted)] transition-all duration-150 hover:bg-white hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] active:scale-95"
              aria-label="Notifications"
            >
              <Bell className={`h-4 w-4 transition-transform duration-200 ${notifHovered ? 'rotate-12' : ''}`} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)] ring-1 ring-white" />
            </button>
            
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-[var(--border)] bg-white p-4 shadow-lg z-50">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Notifications</h4>
                <div className="text-sm text-[var(--text-muted)] text-center py-4 border border-dashed border-[var(--border)] rounded-lg">
                  No new notifications.
                </div>
              </div>
            )}
          </div>

          {/* User avatar */}
          <button
            type="button"
            className="hidden items-center gap-2.5 rounded-xl border border-[var(--border)] bg-white/80 pl-2 pr-3 py-1.5 text-left transition-all duration-150 hover:bg-white hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-sm)] active:scale-[0.98] sm:flex"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[#f97316] text-[9px] font-bold text-white shadow-[0_1px_4px_rgba(235,94,40,0.3)]">
              {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U'}
            </div>
            <span className="hidden text-[13px] font-semibold text-[var(--text-primary)] lg:block">
              {currentUser?.name || 'User'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;