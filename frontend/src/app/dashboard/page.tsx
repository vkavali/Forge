'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../lib/api';
import { Project } from '../../lib/types';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { FolderPlus, ArrowRight, Cpu } from 'lucide-react';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.projects.list().then((res) => setProjects(res.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-white">Projects</h1><p className="text-gray-400 mt-1">Your hardware project workspace</p></div>
        <Link href="/dashboard/projects/new"><Button><FolderPlus className="w-4 h-4 mr-2" /> New Project</Button></Link>
      </div>
      {loading ? <div className="text-gray-400">Loading projects...</div> : projects.length === 0 ? (
        <Card className="p-12 text-center"><Cpu className="w-12 h-12 text-gray-600 mx-auto mb-4" /><h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3><p className="text-gray-400 mb-6">Create your first hardware project to get started.</p><Link href="/dashboard/projects/new"><Button><FolderPlus className="w-4 h-4 mr-2" /> Create Project</Button></Link></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <Card className="p-5 hover:border-gray-700 transition-colors cursor-pointer h-full"><CardContent className="p-0">
                <div className="flex items-start justify-between"><div><h3 className="font-semibold text-white">{project.name}</h3><p className="text-sm text-gray-500 mt-1">{project.description}</p></div><ArrowRight className="w-4 h-4 text-gray-600 flex-shrink-0" /></div>
                <div className="flex items-center gap-2 mt-4"><span className="px-2 py-0.5 bg-blue-600/10 text-blue-400 text-xs rounded-full">{project.category}</span><span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full">{project.boardId}</span><span className={`px-2 py-0.5 text-xs rounded-full ${project.status === 'GENERATED' ? 'bg-green-600/10 text-green-400' : 'bg-yellow-600/10 text-yellow-400'}`}>{project.status}</span></div>
                <p className="text-xs text-gray-600 mt-3">{new Date(project.createdAt).toLocaleDateString()}</p>
              </CardContent></Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
