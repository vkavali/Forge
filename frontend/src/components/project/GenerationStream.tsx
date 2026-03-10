'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

interface Props { jobId: string; onComplete?: () => void; }
interface StreamState { status: 'connecting' | 'running' | 'complete' | 'error'; step: string; progress: number; error?: string; }

export default function GenerationStream({ jobId, onComplete }: Props) {
  const [state, setState] = useState<StreamState>({ status: 'connecting', step: 'Connecting...', progress: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const url = api.generation.streamUrl(jobId);
    const fetchStream = async () => {
      try {
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok || !res.body) throw new Error('Stream failed');
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (line.startsWith('data:')) {
              try {
                const data = JSON.parse(line.slice(5));
                if (data.step) setState((s) => ({ ...s, status: 'running', step: data.step, progress: data.progress || s.progress }));
                if (data.artifactKeys) { setState((s) => ({ ...s, status: 'complete', step: 'Complete!', progress: 100 })); onComplete?.(); }
                if (data.message && !data.step) setState((s) => ({ ...s, status: 'error', error: data.message }));
              } catch {}
            }
          }
        }
      } catch {
        try {
          const jobRes = await api.generation.getJob(jobId);
          const job = jobRes.data;
          if (job.status === 'COMPLETED') { setState({ status: 'complete', step: 'Complete!', progress: 100 }); onComplete?.(); }
          else if (job.status === 'FAILED') setState({ status: 'error', step: 'Failed', progress: 0, error: job.errorMessage || 'Unknown error' });
          else setState((s) => ({ ...s, status: 'running', step: job.currentStep || 'Processing...', progress: job.progress }));
        } catch {}
      }
    };
    fetchStream();
  }, [jobId, onComplete]);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-lg">
      <div className="flex items-center gap-3 mb-4">
        {(state.status === 'connecting' || state.status === 'running') && <Loader2 className="w-5 h-5 animate-spin text-blue-400" />}
        {state.status === 'complete' && <CheckCircle className="w-5 h-5 text-green-400" />}
        {state.status === 'error' && <XCircle className="w-5 h-5 text-red-400" />}
        <span className="text-white font-medium">{state.step}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 mb-2"><div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${state.progress}%` }} /></div>
      <p className="text-xs text-gray-500">{state.progress}% complete</p>
      {state.error && <p className="text-sm text-red-400 mt-3">{state.error}</p>}
    </div>
  );
}
