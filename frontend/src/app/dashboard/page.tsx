'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { Project } from '../../lib/types';
import { Button } from '../../components/ui/button';
import { FolderPlus, ArrowRight, Cpu, Loader2, Clock, CircuitBoard, Zap } from 'lucide-react';

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  GENERATED:  { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  GENERATING: { bg: 'bg-amber-500/10',   text: 'text-amber-400',   dot: 'bg-amber-400' },
  CREATED:    { bg: 'bg-blue-500/10',    text: 'text-blue-400',    dot: 'bg-blue-400' },
  FAILED:     { bg: 'bg-red-500/10',     text: 'text-red-400',     dot: 'bg-red-400' },
};

function getStatusStyle(status: string) {
  return STATUS_STYLES[status] || { bg: 'bg-zinc-500/10', text: 'text-zinc-400', dot: 'bg-zinc-400' };
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.projects.list()
      .then((res) => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Projects</h1>
          <p className="text-zinc-500 mt-1 text-sm">Your hardware project workspace</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="gap-2">
            <FolderPlus className="w-4 h-4" /> New Project
          </Button>
        </Link>
      </div>

      {/* Stats bar */}
      {!loading && projects.length > 0 && (
        <div className="flex items-center gap-6 mb-6 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
          <div className="flex items-center gap-2 text-sm">
            <CircuitBoard className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-400"><span className="text-white font-semibold">{projects.length}</span> projects</span>
          </div>
          <div className="w-px h-4 bg-zinc-800" />
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="text-zinc-400"><span className="text-white font-semibold">{projects.filter(p => p.status === 'GENERATED').length}</span> generated</span>
          </div>
          <div className="w-px h-4 bg-zinc-800" />
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span className="text-zinc-400">
              Latest: <span className="text-zinc-300">{projects[0] ? new Date(projects[0].createdAt).toLocaleDateString() : '—'}</span>
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-amber-500" />
          <p className="text-sm">Loading your projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 rounded-2xl border border-zinc-800/50 border-dashed bg-zinc-900/20">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6">
            <Cpu className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-zinc-500 mb-6 text-sm max-w-md text-center">
            Create your first hardware project. Choose a board, wire up components visually, describe the behavior, and get production-ready firmware.
          </p>
          <Link href="/dashboard/projects/new">
            <Button className="gap-2">
              <FolderPlus className="w-4 h-4" /> Create Your First Project
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const statusStyle = getStatusStyle(project.status);
            return (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <div className="group relative rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-5 hover:border-zinc-700 hover:bg-zinc-900/60 transition-all cursor-pointer h-full flex flex-col">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-amber-300 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-zinc-500 mt-1 line-clamp-2">
                        {project.description || 'No description'}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-700 group-hover:text-amber-400 shrink-0 mt-1 transition-colors" />
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mt-auto pt-3 border-t border-zinc-800/50">
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[11px] font-medium rounded-md">
                      {project.category}
                    </span>
                    <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[11px] font-medium rounded-md">
                      {project.boardId}
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md ${statusStyle.bg} ${statusStyle.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      {project.status}
                    </span>
                  </div>

                  {/* Date */}
                  <p className="text-[11px] text-zinc-600 mt-2.5">
                    {new Date(project.createdAt).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
