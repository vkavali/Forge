'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { ProjectTemplate } from '../../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { GraduationCap, Clock, BookOpen, Loader2 } from 'lucide-react';

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: 'bg-green-600/10 text-green-400',
  INTERMEDIATE: 'bg-yellow-600/10 text-yellow-400',
  ADVANCED: 'bg-red-600/10 text-red-400',
};

export default function LearnPage() {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.templates.list(categoryFilter || undefined, difficultyFilter || undefined);
        setTemplates(res.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally { setLoading(false); }
    };
    setLoading(true);
    load();
  }, [categoryFilter, difficultyFilter]);

  const categories = Array.from(new Set(templates.map(t => t.category)));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-blue-500" /> Learn
        </h1>
        <p className="text-gray-400 mt-2">Browse guided project templates to learn embedded systems step by step.</p>
      </div>

      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
        >
          <option value="">All Levels</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-400">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /> Loading templates...</div>
      ) : templates.length === 0 ? (
        <p className="text-gray-500">No templates found. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <Link key={template.id} href={`/dashboard/learn/${template.id}`}>
              <Card className="hover:border-blue-700 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{template.name}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${DIFFICULTY_COLORS[template.difficultyLevel] || 'bg-gray-800 text-gray-400'}`}>
                      {template.difficultyLevel}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-blue-600/10 text-blue-400 text-xs rounded-full">{template.category}</span>
                    <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full">{template.boardId}</span>
                    {template.subjectArea && (
                      <span className="px-2 py-0.5 bg-purple-600/10 text-purple-400 text-xs rounded-full">{template.subjectArea}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {template.estimatedMinutes} min</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {(template.learningObjectives ?? []).length} objectives</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
