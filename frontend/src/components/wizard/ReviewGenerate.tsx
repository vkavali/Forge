'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '../../stores/projectStore';
import { api } from '../../lib/api';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Loader2, Rocket } from 'lucide-react';

export default function ReviewGenerate() {
  const { wizardData, setWizardStep, resetWizard } = useProjectStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const projectRes = await api.projects.create({
        name: wizardData.name || 'Untitled Project', description: wizardData.description || '',
        category: wizardData.category || '', boardId: wizardData.boardId || '',
        connectionsConfig: wizardData.connectionsConfig || {}, behaviorSpec: wizardData.behaviorSpec || '', extraConfig: wizardData.extraConfig || {},
      });
      const jobRes = await api.generation.start(projectRes.data.id);
      resetWizard();
      router.push(`/dashboard/projects/${projectRes.data.id}?jobId=${jobRes.data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate project');
    } finally { setLoading(false); }
  };

  const items = [{ label: 'Category', value: wizardData.category }, { label: 'Board', value: wizardData.boardId }, { label: 'Project Name', value: wizardData.name }, { label: 'Description', value: wizardData.description }];

  return (
    <div>
      <Button variant="ghost" onClick={() => setWizardStep('behavior')} className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
      <h2 className="text-2xl font-bold text-white mb-2">Review & Generate</h2>
      <p className="text-gray-400 mb-6">Review your project configuration and generate all artifacts.</p>
      <Card className="max-w-2xl mb-6"><CardHeader><CardTitle className="text-lg">Project Summary</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => (<div key={item.label} className="flex justify-between"><span className="text-sm text-gray-400">{item.label}</span><span className="text-sm text-white font-medium">{item.value || '\u2014'}</span></div>))}
          {wizardData.behaviorSpec && (<div><span className="text-sm text-gray-400">Behavior</span><p className="text-sm text-gray-300 mt-1 whitespace-pre-line">{wizardData.behaviorSpec}</p></div>)}
        </CardContent>
      </Card>
      {error && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-400">{error}</div>
      )}
      <Button onClick={handleGenerate} disabled={loading} size="lg">
        {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...</> : <><Rocket className="w-5 h-5 mr-2" /> Generate Project</>}
      </Button>
    </div>
  );
}
