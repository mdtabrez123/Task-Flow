import React, { useMemo, useState, useEffect } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  FolderKanban,
  LayoutGrid,
  Plus,
  ArrowUpRight,
  Flame,
  Inbox,
} from 'lucide-react';
import DashboardHeader from '../components/DashboardHeader.jsx';
import CreateTaskModal from '../components/CreateTaskModal.jsx';
import { Badge, PriorityDot } from '../components/ui/badge.jsx';
import Sidebar from '../components/Sidebar.jsx';
import TaskCard from '../components/TaskCard.jsx';
import { Button } from '../components/ui/button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate } from '../utils/formatDate.js';

const API_BASE_URL = 'https://task-flow-hq6t.vercel.app';



const STATUS_COLUMNS = ['Pending', 'Not Done', 'Done'];

const COLUMN_META = {
  'Pending': {
    dot: 'bg-stone-400',
    label: 'Pending',
    emptyIcon: Inbox,
    emptyText: 'Nothing queued up',
  },
  'Not Done': {
    dot: 'bg-[var(--accent)]',
    label: 'Not Done',
    emptyIcon: Flame,
    emptyText: 'Nothing in flight',
  },
  Done: {
    dot: 'bg-emerald-500',
    label: 'Done',
    emptyIcon: CheckCircle2,
    emptyText: 'No completed tasks yet',
  },
};

const FILTERS = [
  { label: 'All tasks',     value: 'All' },
  { label: '🔥 High priority', value: 'Priority' },
  { label: '📅 Due this week', value: 'Due this week' },
  { label: '⛔ Blocked',   value: 'Blocked' },
];

const NOW = new Date('2026-04-27T00:00:00');

/* ─── Stat card ─────────────────────────────────────────────────── */
const StatCard = ({ label, value, icon: Icon, accent, delta }) => (
  <div className="stat-card card-solid flex items-center gap-4 rounded-2xl p-4 cursor-default">
    <div
      className={[
        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
        accent
          ? 'bg-[var(--accent)] text-white shadow-[0_4px_12px_rgba(235,94,40,0.30)]'
          : 'bg-stone-100 text-[var(--text-secondary)]',
      ].join(' ')}
    >
      <Icon className="h-4.5 w-4.5" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">{value}</p>
      <p className="text-[11.5px] font-medium text-[var(--text-muted)] mt-0.5">{label}</p>
    </div>
    {delta !== undefined && (
      <span className="flex items-center gap-0.5 rounded-lg bg-emerald-50 px-1.5 py-0.5 text-[10.5px] font-bold text-emerald-600">
        <ArrowUpRight className="h-3 w-3" />
        {delta}
      </span>
    )}
  </div>
);

/* ─── HomePage ──────────────────────────────────────────────────── */
const HomePage = () => {
  const { token, logout } = useAuth();
  const [tasks, setTasks]               = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [searchValue, setSearchValue]   = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        } else if (res.status === 401) {
          logout();
        }
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) fetchTasks();
  }, [token, logout]);

  /* Filtered tasks */
  const filteredTasks = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    let visible = tasks;

    if (activeFilter === 'Priority') {
      visible = tasks.filter((t) => t.priority === 'High');
    } else if (activeFilter === 'Due this week') {
      visible = tasks.filter((t) => {
        const diff = (new Date(t.date) - NOW) / 864e5;
        return diff >= 0 && diff <= 7;
      });
    } else if (activeFilter === 'Blocked') {
      visible = tasks.filter((t) => t.status === 'Pending' && t.priority === 'High');
    }

    if (!query) return visible;

    return visible.filter((t) =>
      [t.name, t.description, t.priority, t.status]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(query)),
    );
  }, [searchValue, tasks, activeFilter]);

  /* Kanban columns */
  const columnTasks = useMemo(
    () => STATUS_COLUMNS.map((status) => ({
      status,
      tasks: filteredTasks.filter((t) => t.status === status),
    })),
    [filteredTasks],
  );

  /* Stats */
  const stats = useMemo(() => {
    const dueSoon = tasks.filter((t) => {
      const diff = (new Date(t.date) - NOW) / 864e5;
      return diff >= 0 && diff <= 7;
    }).length;

    return [
      { label: 'Open tasks',    value: tasks.filter((t) => t.status !== 'Done').length, icon: LayoutGrid,    accent: true,  delta: '+2' },
      { label: 'Due soon',      value: dueSoon,                                          icon: Clock3,         accent: false },
      { label: 'Completed',     value: tasks.filter((t) => t.status === 'Done').length,  icon: CheckCircle2,   accent: false },
    ];
  }, [tasks]);

  /* Upcoming */
  const upcomingItems = useMemo(
    () =>
      tasks
        .filter((t) => t.status !== 'Done')
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5),
    [tasks],
  );

  /* Handlers */
  const handleCreateTask = async (taskData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      });
      if (res.ok) {
        const newTask = await res.json();
        setTasks((p) => [newTask, ...p]);
      }
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const handleUpdateTaskStatus = async (id, s) => {
    setTasks((p) => p.map((t) => (t.id === id || t._id === id ? { ...t, status: s } : t)));
    try {
      await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: s })
      });
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDeleteTask = async (id) => {
    setTasks((p) => p.filter((t) => t.id !== id && t._id !== id));
    try {
      await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  return (
    <div className="app-bg dot-grid relative min-h-screen">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1680px]">
        <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onMenuClick={() => setMobileNavOpen(true)}
            onCreateTask={() => setTaskModalOpen(true)}
          />

          <main className="flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-8">

            {/* ── Page heading ── */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                {/* Eyebrow */}
                <p className="eyebrow flex items-center gap-1.5">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  Mon, 27 April 2026
                </p>
                {/* Title — uses DM Serif Display */}
                <h2 className="mt-1 text-[28px] font-normal tracking-tight text-[var(--text-primary)]">
                  Today's <em className="not-italic text-[var(--accent)]">focus</em>
                </h2>
                <p className="mt-1 text-[13.5px] text-[var(--text-secondary)]">
                  {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
                  {activeFilter !== 'All' && (
                    <span className="ml-2 rounded-md bg-[var(--accent-subtle)] px-1.5 py-0.5 text-[11px] font-semibold text-[var(--accent)]">
                      {FILTERS.find((f) => f.value === activeFilter)?.label}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* ── Stats row ── */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => <StatCard key={s.label} {...s} />)}
            </div>

            {/* ── Filter pills ── */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {FILTERS.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveFilter(value)}
                  className={[
                    'rounded-xl border px-4 py-2 text-[12.5px] font-semibold transition-all duration-150 active:scale-95',
                    activeFilter === value
                      ? 'filter-pill-active border-[var(--accent-subtle-border)] bg-[var(--accent-subtle)] text-[var(--accent)]'
                      : 'border-[var(--border)] bg-white/70 text-[var(--text-secondary)] hover:bg-white hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]',
                  ].join(' ')}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── Board + aside ── */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_280px]">

              {/* ── Kanban ── */}
              <div className="grid gap-4 sm:grid-cols-3">
                {columnTasks.map((col) => {
                  const meta = COLUMN_META[col.status];
                  const EmptyIcon = meta.emptyIcon;

                  return (
                    <div
                      key={col.status}
                      className="kanban-col flex flex-col rounded-2xl border border-[var(--border)] bg-white/40 backdrop-blur-sm overflow-hidden"
                    >
                      {/* Column header */}
                      <div className="kanban-col-header flex items-center gap-2.5 border-b border-[var(--border)] px-4 py-3">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${meta.dot}`} />
                        <h4 className="flex-1 text-[13.5px] font-semibold text-[var(--text-primary)]">
                          {meta.label}
                        </h4>
                        <span className="rounded-lg border border-[var(--border)] bg-white/80 px-2 py-0.5 text-[11px] font-bold text-[var(--text-muted)]">
                          {col.tasks.length}
                        </span>
                      </div>

                      {/* Column body */}
                      <div className="flex flex-col gap-2.5 p-3 flex-1">
                        {col.tasks.length > 0 ? (
                          col.tasks.map((task, i) => (
                            <div
                              key={task.id || task._id}
                              className="stagger-reveal"
                              style={{ animationDelay: `${i * 40}ms` }}
                            >
                              <TaskCard
                                task={task}
                                onUpdateStatus={handleUpdateTaskStatus}
                                onDelete={handleDeleteTask}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-white/30 py-10 text-center">
                            <EmptyIcon className="h-5 w-5 text-[var(--text-muted)]" />
                            <p className="text-[12px] font-medium text-[var(--text-muted)]">
                              {meta.emptyText}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Right aside ── */}
              <aside className="flex flex-col gap-4">

                {/* Upcoming */}
                <div className="card-solid animate-fade-in rounded-2xl overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--accent-subtle)]">
                        <Clock3 className="h-3.5 w-3.5 text-[var(--accent)]" />
                      </div>
                      <h3 className="text-[13.5px] font-semibold text-[var(--text-primary)]">Upcoming</h3>
                    </div>
                    <span className="rounded-lg bg-stone-100 px-2 py-0.5 text-[10.5px] font-bold text-[var(--text-muted)]">
                      {upcomingItems.length}
                    </span>
                  </div>
                  <div className="divide-y divide-[var(--border)]">
                    {upcomingItems.map((task, i) => (
                      <div
                        key={task.id}
                        className="stagger-reveal group flex items-start gap-3 px-4 py-3 transition-colors duration-150 hover:bg-stone-50/60"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <PriorityDot priority={task.priority} className="mt-1.5" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">
                            {task.name}
                          </p>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                            <CalendarDays className="h-3 w-3 shrink-0" />
                            <span>{formatDate(task.date)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>


              </aside>
            </div>
          </main>
        </div>
      </div>

      <CreateTaskModal
        open={taskModalOpen}
        onOpenChange={setTaskModalOpen}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};

export default HomePage;
