'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { api } from '../../../../lib/api';
import { Project, GenerationJob, IntentModel } from '../../../../lib/types';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import GenerationStream from '../../../../components/project/GenerationStream';
import { Loader2, FileCode, FileText, ShoppingCart, Rocket, Download, Brain, Shield, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Tab = 'overview' | 'code' | 'docs' | 'bom' | 'deploy';

export default function ProjectDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const activeJobId = searchParams.get('jobId');

  const [project, setProject] = useState<Project | null>(null);
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [tab, setTab] = useState<Tab>('overview');
  const [artifacts, setArtifacts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(!!activeJobId);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  const loadProject = useCallback(async () => {
    try {
      const [projRes, jobsRes] = await Promise.all([api.projects.get(projectId), api.generation.getJobs(projectId)]);
      setProject(projRes.data); setJobs(jobsRes.data);
      const latestJob = jobsRes.data[0];
      if (latestJob?.status === 'COMPLETED' && latestJob.artifactKeys?.length > 0) {
        const artifactMap: Record<string, string> = {};
        for (const key of latestJob.artifactKeys) { try { const res = await api.generation.getArtifact(latestJob.id, key); artifactMap[key] = res.data; } catch {} }
        setArtifacts(artifactMap);
      }
    } catch {} finally { setLoading(false); }
  }, [projectId]);

  useEffect(() => { loadProject(); }, [loadProject]);

  const handleGenComplete = useCallback(() => { setGenerating(false); loadProject(); }, [loadProject]);

  const handleRegenerate = async () => {
    setGenError(null);
    try { const res = await api.generation.start(projectId); setGenerating(true); window.history.replaceState(null, '', `?jobId=${res.data.id}`); }
    catch (err: unknown) { setGenError(err instanceof Error ? err.message : 'Failed to start generation'); }
  };

  const getArtifact = (suffix: string) => Object.entries(artifacts).find(([key]) => key.endsWith(suffix))?.[1] || '';
  const getCodeFiles = () => Object.entries(artifacts).filter(([key]) =>
    !key.endsWith('/docs.md') && !key.endsWith('/bom.csv') && !key.endsWith('/README.md') &&
    !key.endsWith('/concept-guide.md') && !key.endsWith('/build-guide.md')
  );

  const handleDownloadAll = async () => {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    for (const [key, content] of Object.entries(artifacts)) { zip.file(key.split('/').pop() || key, content); }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${project?.name || 'project'}.zip`; a.click(); URL.revokeObjectURL(url);
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (!project) return <div className="text-red-400">Project not found</div>;

  const latestJob = jobs[0];
  const showStream = generating && (activeJobId || latestJob?.id);
  const tabs: { key: Tab; label: string; icon: React.ComponentType<{className?: string}> }[] = [
    { key: 'overview', label: 'Overview', icon: FileText }, { key: 'code', label: 'Code', icon: FileCode },
    { key: 'docs', label: 'Docs', icon: FileText }, { key: 'bom', label: 'BOM', icon: ShoppingCart }, { key: 'deploy', label: 'Deploy', icon: Rocket },
  ];

  const intentModel = project.intentModel as IntentModel | null;
  const codeFiles = getCodeFiles();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{project.name}</h1>
          <p className="text-gray-400 mt-1">{project.description}</p>
          <div className="flex gap-2 mt-2">
            <span className="px-2 py-0.5 bg-blue-600/10 text-blue-400 text-xs rounded-full">{project.category}</span>
            <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full">{project.boardId}</span>
            {project.educationMode && <span className="px-2 py-0.5 bg-purple-600/10 text-purple-400 text-xs rounded-full">Education</span>}
            {latestJob?.compileSuccess !== null && latestJob?.compileSuccess !== undefined && (
              <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${latestJob.compileSuccess ? 'bg-green-600/10 text-green-400' : 'bg-yellow-600/10 text-yellow-400'}`}>
                {latestJob.compileSuccess ? <CheckCircle className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                {latestJob.compileSuccess ? 'Build verified' : 'Build skipped'}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {Object.keys(artifacts).length > 0 && <Button variant="outline" onClick={handleDownloadAll}><Download className="w-4 h-4 mr-2" /> Download ZIP</Button>}
          <Button onClick={handleRegenerate} disabled={generating}>{generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Rocket className="w-4 h-4 mr-2" />}{generating ? 'Generating...' : 'Generate'}</Button>
        </div>
      </div>

      {genError && (
        <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-400">{genError}</div>
      )}

      {showStream && <div className="mb-6"><GenerationStream jobId={(activeJobId || latestJob?.id)!} onComplete={handleGenComplete} /></div>}

      <div className="flex gap-1 border-b border-gray-800 mb-6">
        {tabs.map((t) => (<button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}><t.icon className="w-4 h-4" />{t.label}</button>))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card><CardHeader><CardTitle className="text-lg">Project Config</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Category</span><span className="text-white">{project.category}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Board</span><span className="text-white">{project.boardId}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="text-white">{project.status}</span></div>
            {project.educationMode && <>
              <div className="flex justify-between"><span className="text-gray-400">Education Level</span><span className="text-white">{project.educationLevel}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Subject</span><span className="text-white">{project.subjectArea}</span></div>
            </>}
          </CardContent></Card>

          <Card><CardHeader><CardTitle className="text-lg">Generation History</CardTitle></CardHeader><CardContent>
            {jobs.length === 0 ? <p className="text-gray-500 text-sm">No generations yet</p> : <div className="space-y-2">{jobs.map((job) => (<div key={job.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs ${job.status === 'COMPLETED' ? 'bg-green-600/10 text-green-400' : job.status === 'FAILED' ? 'bg-red-600/10 text-red-400' : 'bg-yellow-600/10 text-yellow-400'}`}>{job.status}</span>
                {job.compileSuccess !== null && <span className="text-xs text-gray-500">{job.compileSuccess ? 'Build OK' : 'Build skipped'}</span>}
              </div>
              <span className="text-gray-500">{new Date(job.createdAt).toLocaleString()}</span>
            </div>))}</div>}
          </CardContent></Card>

          {/* Intent Model viewer */}
          {intentModel && (
            <Card className="md:col-span-2"><CardHeader><CardTitle className="text-lg flex items-center gap-2"><Brain className="w-5 h-5 text-blue-400" /> Intent Model</CardTitle></CardHeader><CardContent>
              <p className="text-sm text-gray-400 mb-4">{intentModel.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {intentModel.sensors?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-white mb-2">Sensors ({intentModel.sensors.length})</h4>
                    <div className="space-y-1">{intentModel.sensors.map((s, i) => (
                      <div key={i} className="text-gray-400 bg-gray-800 px-2 py-1 rounded text-xs">{s.type} — pin {s.pin} ({s.protocol})</div>
                    ))}</div>
                  </div>
                )}
                {intentModel.actuators?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-white mb-2">Actuators ({intentModel.actuators.length})</h4>
                    <div className="space-y-1">{intentModel.actuators.map((a, i) => (
                      <div key={i} className="text-gray-400 bg-gray-800 px-2 py-1 rounded text-xs">{a.type} — pin {a.pin}</div>
                    ))}</div>
                  </div>
                )}
                {intentModel.logicRules?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-white mb-2">Logic Rules ({intentModel.logicRules.length})</h4>
                    <div className="space-y-1">{intentModel.logicRules.map((r, i) => (
                      <div key={i} className="text-gray-400 bg-gray-800 px-2 py-1 rounded text-xs">{r.description}</div>
                    ))}</div>
                  </div>
                )}
              </div>
              {intentModel.requiredLibraries?.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-white mb-2 text-sm">Libraries</h4>
                  <div className="flex flex-wrap gap-1">{intentModel.requiredLibraries.map((lib, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-600/10 text-blue-400 text-xs rounded-full">{lib}</span>
                  ))}</div>
                </div>
              )}
            </CardContent></Card>
          )}
        </div>
      )}

      {tab === 'code' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* File tree */}
          <Card className="md:col-span-1">
            <CardHeader><CardTitle className="text-sm">Files</CardTitle></CardHeader>
            <CardContent className="p-2">
              {codeFiles.length === 0 ? <p className="text-gray-500 text-sm p-2">No code generated yet.</p> :
                <div className="space-y-0.5">{codeFiles.map(([key]) => {
                  const filename = key.split('/').pop() || key;
                  return (
                    <button key={key} onClick={() => setSelectedFile(key)} className={`w-full text-left px-3 py-1.5 rounded text-xs font-mono transition-colors ${selectedFile === key ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800'}`}>
                      <FileCode className="w-3 h-3 inline mr-2" />{filename}
                    </button>
                  );
                })}</div>}
            </CardContent>
          </Card>
          {/* Code viewer */}
          <Card className="md:col-span-3">
            <CardHeader><CardTitle className="text-sm font-mono">{selectedFile ? selectedFile.split('/').pop() : 'Select a file'}</CardTitle></CardHeader>
            <CardContent>
              {selectedFile && artifacts[selectedFile] ? (
                <pre className="bg-gray-950 border border-gray-800 rounded-lg p-4 overflow-x-auto text-sm text-gray-300 whitespace-pre-wrap font-mono max-h-[600px] overflow-y-auto">{artifacts[selectedFile]}</pre>
              ) : codeFiles.length > 0 ? (
                <p className="text-gray-500 text-sm">Select a file from the list to view its contents.</p>
              ) : (
                <p className="text-gray-500 text-sm">No code generated yet. Click Generate to start.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {tab === 'docs' && (
        <Card><CardHeader><CardTitle className="text-lg">Documentation</CardTitle></CardHeader><CardContent>
          {getArtifact('/docs.md') ? <div className="prose prose-invert max-w-none"><ReactMarkdown>{getArtifact('/docs.md')}</ReactMarkdown></div> : <p className="text-gray-500">No documentation generated yet.</p>}
          {getArtifact('/concept-guide.md') && <>
            <hr className="border-gray-800 my-8" />
            <h3 className="text-lg font-semibold text-white mb-4">Concept Guide</h3>
            <div className="prose prose-invert max-w-none"><ReactMarkdown>{getArtifact('/concept-guide.md')}</ReactMarkdown></div>
          </>}
          {getArtifact('/build-guide.md') && <>
            <hr className="border-gray-800 my-8" />
            <h3 className="text-lg font-semibold text-white mb-4">Build Guide</h3>
            <div className="prose prose-invert max-w-none"><ReactMarkdown>{getArtifact('/build-guide.md')}</ReactMarkdown></div>
          </>}
        </CardContent></Card>
      )}

      {tab === 'bom' && (
        <Card><CardHeader><CardTitle className="text-lg">Bill of Materials</CardTitle></CardHeader><CardContent>
          {getArtifact('/bom.csv') ? (() => {
            const lines = getArtifact('/bom.csv').trim().split('\n');
            const headers = lines[0]?.split(',').map(h => h.replace(/"/g, '').trim()) || [];
            const rows = lines.slice(1).map(line => {
              const cells: string[] = [];
              let current = '';
              let inQuotes = false;
              for (const ch of line) {
                if (ch === '"') { inQuotes = !inQuotes; }
                else if (ch === ',' && !inQuotes) { cells.push(current.trim()); current = ''; }
                else { current += ch; }
              }
              cells.push(current.trim());
              return cells;
            });
            return (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead><tr className="border-b border-gray-800">{headers.map((h, i) => <th key={i} className="py-2 px-3 text-gray-400 font-medium">{h}</th>)}</tr></thead>
                  <tbody>{rows.map((row, i) => <tr key={i} className="border-b border-gray-800/50">{row.map((cell, j) => <td key={j} className="py-2 px-3 text-gray-300">{cell}</td>)}</tr>)}</tbody>
                </table>
              </div>
            );
          })() : <p className="text-gray-500">No BOM generated yet.</p>}
        </CardContent></Card>
      )}

      {tab === 'deploy' && (
        <Card><CardHeader><CardTitle className="text-lg">Deploy & README</CardTitle></CardHeader><CardContent>
          {getArtifact('/README.md') ? <div className="prose prose-invert max-w-none"><ReactMarkdown>{getArtifact('/README.md')}</ReactMarkdown></div> : <p className="text-gray-500">No README generated yet.</p>}
        </CardContent></Card>
      )}
    </div>
  );
}
