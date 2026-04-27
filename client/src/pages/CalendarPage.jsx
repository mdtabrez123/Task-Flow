import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import { CalendarDays } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000';

const CalendarPage = () => {
  const { token } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      }
    };
    if (token) fetchTasks();
  }, [token]);

  return (
    <div className="app-bg dot-grid relative min-h-screen">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1680px]">
        <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onMenuClick={() => setMobileNavOpen(true)}
            onCreateTask={() => {}}
          />

          <main className="flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-[var(--accent)]" />
                  Workspace
                </p>
                <h2 className="mt-1 text-[28px] font-normal tracking-tight text-[var(--text-primary)]">
                  Your <em className="not-italic text-[var(--accent)]">Calendar</em>
                </h2>
                <p className="mt-1 text-[13.5px] text-[var(--text-secondary)]">
                  View your upcoming tasks by date.
                </p>
              </div>
            </div>

            <div className="mt-8 border border-[var(--border)] rounded-2xl bg-white/60 p-6 backdrop-blur-sm min-h-[500px]">
              {tasks.length === 0 ? (
                 <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] py-12">
                   <CalendarDays className="h-12 w-12 opacity-20 mb-4" />
                   <p className="font-medium">No tasks scheduled yet.</p>
                 </div>
              ) : (
                <div className="space-y-4">
                   {tasks.map(t => (
                     <div key={t._id} className="flex items-center justify-between p-3 border-b border-[var(--border)]">
                        <div>
                          <p className="font-medium text-sm text-[var(--text-primary)]">{t.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{t.status}</p>
                        </div>
                        <span className="text-sm font-semibold bg-stone-100 px-3 py-1 rounded-full text-[var(--text-secondary)]">
                          {new Date(t.date).toLocaleDateString()}
                        </span>
                     </div>
                   ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
