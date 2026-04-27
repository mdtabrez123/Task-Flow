import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutGrid,
  ListTodo,
  X,
  ChevronRight,
  Sparkles,
  TrendingUp,
  LogOut,
  FolderKanban,
  CalendarDays,
  Settings,
} from 'lucide-react';

const NAV_SECTIONS = [
  {
    title: 'Workspace',
    items: [
      { label: 'Dashboard', icon: LayoutGrid,   path: '/', count: null },
      { label: 'Projects',  icon: FolderKanban,  path: '/projects', count: null },
      { label: 'Calendar',  icon: CalendarDays,  path: '/calendar', count: null },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', icon: Settings, path: '/settings', count: null },
    ],
  },
];



const Sidebar = ({ mobileOpen, onClose }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const initials = currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-stone-950/25 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-label="Close navigation"
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex w-[268px] flex-col',
          'sidebar-glass',
          'px-3 py-4',
          'transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'lg:sticky lg:top-0 lg:z-0 lg:h-screen lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* ── Logo ── */}
        <div className="flex items-center justify-between px-2 pb-3">
          <div className="flex items-center gap-2.5">
            {/* Animated logo mark */}
            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent)] shadow-[0_4px_10px_rgba(235,94,40,0.35)]">
              <Sparkles className="h-4 w-4 text-white" />
              {/* Live indicator */}
              <span className="live-dot absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[var(--bg)]" />
            </div>
            <div>
              <span className="block text-[15px] font-bold tracking-tight text-[var(--text-primary)]">
                TaskFlow
              </span>
              <span className="block text-[10px] font-medium text-[var(--text-muted)]">Pro workspace</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--text-muted)] transition-all duration-150 hover:bg-white/80 hover:text-[var(--text-primary)] active:scale-95 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Sprint progress ── */}
        <div className="mx-1 mt-1 mb-3 rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[#f97316] p-4 text-white shadow-[0_8px_24px_rgba(235,94,40,0.28)]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/70">
                Current sprint
              </p>
              <p className="mt-0.5 text-[14px] font-bold">Release v1.8</p>
            </div>
            <span className="flex items-center gap-1 rounded-lg bg-white/20 px-2 py-1 text-[11px] font-bold">
              <TrendingUp className="h-3 w-3" />
              68%
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/25">
            <div
              className="h-full rounded-full bg-white transition-all duration-700"
              style={{ width: '68%' }}
            />
          </div>
          <p className="mt-2 text-[10.5px] text-white/60">24 items · 8 remaining</p>
        </div>

        {/* ── Nav sections ── */}
        <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-1">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="eyebrow mb-1.5 px-2">{section.title}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.path;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onMouseEnter={() => setHoveredItem(item.label)}
                      onMouseLeave={() => setHoveredItem(null)}
                      onClick={onClose}
                      className={[
                        'nav-item group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13.5px] font-medium',
                        active
                          ? 'nav-item-active bg-white text-[var(--text-primary)] shadow-[var(--shadow-sm)]'
                          : 'text-[var(--text-secondary)] hover:bg-white/70 hover:text-[var(--text-primary)]',
                      ].join(' ')}
                    >
                      <span
                        className={[
                          'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-150',
                          active
                            ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                            : 'bg-stone-100/80 text-[var(--text-muted)] group-hover:bg-stone-200/60',
                        ].join(' ')}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <span className="flex-1">{item.label}</span>
                      {item.count ? (
                        <span
                          className={[
                            'rounded-md px-1.5 py-0.5 text-[10.5px] font-bold transition-colors duration-150',
                            active
                              ? 'bg-[var(--accent-subtle)] text-[var(--accent)]'
                              : 'bg-stone-100 text-[var(--text-muted)]',
                          ].join(' ')}
                        >
                          {item.count}
                        </span>
                      ) : null}
                      {hoveredItem === item.label && !active && (
                        <ChevronRight className="h-3 w-3 text-[var(--text-muted)] opacity-50" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}


        </nav>

        {/* ── User footer ── */}
        <div className="mt-auto border-t border-[var(--border)] pt-3 px-1">
          <button
            type="button"
            onClick={logout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 hover:bg-white/80 hover:text-red-600 active:scale-[0.98]"
          >
            {/* Avatar with orange ring */}
            <div className="relative shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[#f97316] text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(235,94,40,0.3)]">
                {initials}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[var(--bg)]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-[var(--text-primary)] group-hover:text-red-600">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-[10.5px] text-[var(--text-muted)] group-hover:text-red-500">Log out</p>
            </div>
            <LogOut className="h-4 w-4 shrink-0 text-[var(--text-muted)] group-hover:text-red-500" />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;