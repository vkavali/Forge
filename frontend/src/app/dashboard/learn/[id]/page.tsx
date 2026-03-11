'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { ProjectTemplate } from '../../../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { GraduationCap, Clock, BookOpen, CheckCircle, Rocket, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const DIFFICULTY_COLORS: Record<string, string> = {
  BEGINNER: 'bg-green-600/10 text-green-400',
  INTERMEDIATE: 'bg-yellow-600/10 text-yellow-400',
  ADVANCED: 'bg-red-600/10 text-red-400',
};

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<ProjectTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.templates.get(templateId);
        setTemplate(res.data);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, [templateId]);

  const handleStartProject = async () => {
    if (!template) return;
    setStarting(true);
    try {
      const projectRes = await api.projects.create({
        name: template.name,
        description: template.description,
        category: template.category,
        boardId: template.boardId,
        connectionsConfig: template.connectionsConfig,
        behaviorSpec: template.behaviorSpec,
        extraConfig: {},
        educationMode: true,
        educationLevel: template.difficultyLevel,
        subjectArea: template.subjectArea,
      });
      const genRes = await api.generation.start(projectRes.data.id);
      router.push(`/dashboard/projects/${projectRes.data.id}?jobId=${genRes.data.id}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to start project');
      setStarting(false);
    }
  };

  if (loading) return <div className="text-gray-400 flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;
  if (!template) return <div className="text-red-400">Template not found</div>;

  return (
    <div>
      <Link href="/dashboard/learn" className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Learn
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-500" /> {template.name}
          </h1>
          <p className="text-gray-400 mt-2 max-w-2xl">{template.description}</p>
          <div className="flex gap-2 mt-3">
            <span className={`px-2 py-0.5 text-xs rounded-full ${DIFFICULTY_COLORS[template.difficultyLevel] || 'bg-gray-800 text-gray-400'}`}>
              {template.difficultyLevel}
            </span>
            <span className="px-2 py-0.5 bg-blue-600/10 text-blue-400 text-xs rounded-full">{template.category}</span>
            <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full">{template.boardId}</span>
            {template.subjectArea && (
              <span className="px-2 py-0.5 bg-purple-600/10 text-purple-400 text-xs rounded-full">{template.subjectArea}</span>
            )}
          </div>
        </div>
        <Button onClick={handleStartProject} disabled={starting} size="lg">
          {starting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Rocket className="w-4 h-4 mr-2" />}
          {starting ? 'Starting...' : 'Start Project'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Learning Objectives</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {template.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                  {obj}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Details</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400 flex items-center gap-2"><Clock className="w-4 h-4" /> Estimated Time</span>
              <span className="text-white">{template.estimatedMinutes} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Subject Area</span>
              <span className="text-white">{template.subjectArea || 'General'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Board</span>
              <span className="text-white">{template.boardId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Category</span>
              <span className="text-white">{template.category}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader><CardTitle className="text-lg">Project Description</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-300 whitespace-pre-wrap">{template.behaviorSpec}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
