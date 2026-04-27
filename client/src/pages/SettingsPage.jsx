import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import { Settings } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';

const SettingsPage = () => {
  const { currentUser } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

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
                  <Settings className="h-4 w-4 text-[var(--accent)]" />
                  System
                </p>
                <h2 className="mt-1 text-[28px] font-normal tracking-tight text-[var(--text-primary)]">
                  Account <em className="not-italic text-[var(--accent)]">Settings</em>
                </h2>
                <p className="mt-1 text-[13.5px] text-[var(--text-secondary)]">
                  Manage your preferences and personal information.
                </p>
              </div>
            </div>

            <div className="mt-8 max-w-2xl bg-white/70 backdrop-blur-xl border border-[var(--border)] rounded-2xl p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Profile Information</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Name</label>
                  <p className="text-[15px] font-medium px-4 py-2.5 bg-stone-100 rounded-xl text-[var(--text-primary)]">
                    {currentUser?.name}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">Email</label>
                  <p className="text-[15px] font-medium px-4 py-2.5 bg-stone-100 rounded-xl text-[var(--text-primary)]">
                    {currentUser?.email}
                  </p>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-[var(--border)]">
                 <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Preferences</h3>
                 <p className="text-sm text-[var(--text-muted)] mb-4">Update your theme and notifications. (Coming soon)</p>
                 <Button disabled variant="outline">Save Preferences</Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
