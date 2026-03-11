'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Loader2, CheckCircle, XCircle, Brain, Code2, FileText, Shield } from 'lucide-react';

interface Props { jobId: string; onComplete?: () => void; }

interface LayerState {
  status: 'pending' | 'running' | 'patching' | 'complete' | 'error';
  message?: string;
  success?: boolean;
}

interface StreamState {
  status: 'connecting' | 'running' | 'complete' | 'error';
  step: string;
  progress: number;
  currentLayer: number;
  layers: Record<number, LayerState>;
  error?: string;
  compileSuccess?: boolean;
}

const LAYER_INFO = [
  { num: 1, label: 'Intent Extraction', icon: Brain, description: 'AI parses your description into structured intent' },
  { num: 2, label: 'Code Assembly', icon: Code2, description: 'Templates + libraries produce compilable code' },
  { num: 3, label: 'Compile Verification', icon: Shield, description: 'PlatformIO verifies the code builds' },
  { num: 4, label: 'AI Enrichment', icon: FileText, description: 'AI writes docs, BOM, and README' },
];

export default function GenerationStream({ jobId, onComplete }: Props) {
  const [state, setState] = useState<StreamState>({
    status: 'connecting', step: 'Connecting...', progress: 0, currentLayer: 0,
    layers: { 1: { status: 'pending' }, 2: { status: 'pending' }, 3: { status: 'pending' }, 4: { status: 'pending' } },
  });

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

                // Layer event
                if (data.layer !== undefined && data.status) {
                  setState(s => ({
                    ...s,
                    status: 'running',
                    currentLayer: data.layer,
                    layers: {
                      ...s.layers,
                      [data.layer]: {
                        status: data.status,
                        message: data.message,
                        success: data.success,
                      },
                    },
                  }));
                }

                // Progress event
                if (data.step) {
                  setState(s => ({
                    ...s,
                    status: 'running',
                    step: data.step,
                    progress: data.progress || s.progress,
                    currentLayer: data.layer || s.currentLayer,
                  }));
                }

                // Complete
                if (data.artifactKeys) {
                  setState(s => ({
                    ...s,
                    status: 'complete',
                    step: 'Complete!',
                    progress: 100,
                    compileSuccess: data.compileSuccess,
                    layers: { 1: { status: 'complete' }, 2: { status: 'complete' }, 3: { status: 'complete' }, 4: { status: 'complete' } },
                  }));
                  onComplete?.();
                }

                // Error
                if (data.message && !data.step && !data.layer && !data.artifactKeys) {
                  setState(s => ({ ...s, status: 'error', error: data.message }));
                }
              } catch {}
            }
          }
        }
      } catch {
        try {
          const jobRes = await api.generation.getJob(jobId);
          const job = jobRes.data;
          if (job.status === 'COMPLETED') {
            setState({ status: 'complete', step: 'Complete!', progress: 100, currentLayer: 4, compileSuccess: job.compileSuccess ?? undefined,
              layers: { 1: { status: 'complete' }, 2: { status: 'complete' }, 3: { status: 'complete' }, 4: { status: 'complete' } } });
            onComplete?.();
          } else if (job.status === 'FAILED') {
            setState(s => ({ ...s, status: 'error', step: 'Failed', progress: 0, error: job.errorMessage || 'Unknown error',
              layers: s.layers }));
          } else {
            setState(s => ({ ...s, status: 'running', step: job.currentStep || 'Processing...', progress: job.progress,
              currentLayer: job.currentLayer, layers: s.layers }));
          }
        } catch {}
      }
    };
    fetchStream();
  }, [jobId, onComplete]);

  const getLayerIcon = (layerNum: number) => {
    const layerState = state.layers[layerNum];
    if (!layerState) return <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700" />;

    if (layerState.status === 'complete') return <CheckCircle className="w-6 h-6 text-green-400" />;
    if (layerState.status === 'error') return <XCircle className="w-6 h-6 text-red-400" />;
    if (layerState.status === 'running' || layerState.status === 'patching') return <Loader2 className="w-6 h-6 animate-spin text-blue-400" />;
    return <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700" />;
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      {/* Layer progress */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {LAYER_INFO.map(layer => {
          const ls = state.layers[layer.num];
          const isActive = state.currentLayer === layer.num;
          return (
            <div key={layer.num} className={`p-3 rounded-lg border transition-colors ${
              ls?.status === 'complete' ? 'border-green-800 bg-green-900/10' :
              isActive ? 'border-blue-700 bg-blue-900/10' :
              'border-gray-800 bg-gray-900/50'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                {getLayerIcon(layer.num)}
                <span className="text-xs font-medium text-gray-300">L{layer.num}</span>
              </div>
              <div className="text-sm font-medium text-white">{layer.label}</div>
              <div className="text-xs text-gray-500 mt-1">{ls?.message || layer.description}</div>
              {ls?.status === 'patching' && <div className="text-xs text-yellow-400 mt-1">Patching errors...</div>}
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3 mb-3">
        {(state.status === 'connecting' || state.status === 'running') && <Loader2 className="w-4 h-4 animate-spin text-blue-400 flex-shrink-0" />}
        {state.status === 'complete' && <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />}
        {state.status === 'error' && <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />}
        <span className="text-sm text-white">{state.step}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
        <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${state.progress}%` }} />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-500">{state.progress}% complete</p>
        {state.compileSuccess !== undefined && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${state.compileSuccess ? 'bg-green-600/10 text-green-400' : 'bg-yellow-600/10 text-yellow-400'}`}>
            {state.compileSuccess ? 'Build verified' : 'Build skipped'}
          </span>
        )}
      </div>
      {state.error && <p className="text-sm text-red-400 mt-3">{state.error}</p>}
    </div>
  );
}
