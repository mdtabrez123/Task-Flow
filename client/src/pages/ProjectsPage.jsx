import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import DashboardHeader from '../components/DashboardHeader.jsx';
import { FolderKanban, Plus } from 'lucide-react';
import { Button } from '../components/ui/button.jsx';

const API_BASE_URL = 'http://localhost:5000';

const ProjectsPage = () => {
  const { token } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error('Failed to fetch projects', err);
      }
    };
    if (token) fetchProjects();
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
                  <FolderKanban className="h-4 w-4 text-[var(--accent)]" />
                  Workspace
                </p>
                <h2 className="mt-1 text-[28px] font-normal tracking-tight text-[var(--text-primary)]">
                  Your <em className="not-italic text-[var(--accent)]">Projects</em>
                </h2>
                <p className="mt-1 text-[13.5px] text-[var(--text-secondary)]">
                  Manage your active projects and initiatives.
                </p>
              </div>
              <Button type="button" variant="default" size="lg" className="mt-3 gap-1.5 self-start sm:mt-0">
                <Plus className="h-4 w-4" />
                New project
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.length === 0 ? (
                <div className="col-span-full py-12 text-center text-[var(--text-muted)] border border-dashed border-[var(--border)] rounded-2xl bg-white/40">
                  <FolderKanban className="mx-auto h-8 w-8 opacity-40 mb-3" />
                  <p className="text-sm font-medium">No projects created yet.</p>
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project._id} className="card-solid rounded-2xl p-5 hover:border-[var(--accent-subtle)] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className={`h-4 w-4 rounded-full ${project.color}`} />
                      <h3 className="text-[15px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{project.name}</h3>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
