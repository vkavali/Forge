'use client';

import { useState, useEffect } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { api } from '../../lib/api';
import { BoardDefinition } from '../../lib/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowLeft, Plus, Trash2, Workflow, Grid3x3, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const HardwareDesigner = dynamic(
  () => import('../designer/HardwareDesigner'),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-[calc(100vh-10rem)] text-gray-400"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading designer...</div> }
);

interface PinMapping { pin: string; component: string; description: string; }

type DesignerMode = 'visual' | 'manual';

export default function ConnectionsConfig() {
  const { wizardData, updateWizardData, setWizardStep } = useProjectStore();
  const [mode, setMode] = useState<DesignerMode>('visual');
  const [board, setBoard] = useState<BoardDefinition | null>(null);
  const [boardLoading, setBoardLoading] = useState(true);

  // Manual table state
  const [mappings, setMappings] = useState<PinMapping[]>(
    (wizardData.connectionsConfig?.pins as PinMapping[]) || [{ pin: '', component: '', description: '' }]
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  // Fetch board details for the visual designer
  useEffect(() => {
    if (wizardData.category) {
      setBoardLoading(true);
      api.boards.list(wizardData.category)
        .then((res) => {
          const found = res.data.find((b) => b.id === wizardData.boardId);
          if (found) setBoard(found);
        })
        .finally(() => setBoardLoading(false));
    }
  }, [wizardData.category, wizardData.boardId]);

  // Manual table handlers
  const addRow = () => setMappings([...mappings, { pin: '', component: '', description: '' }]);
  const removeRow = (i: number) => setMappings(mappings.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof PinMapping, value: string) => {
    const updated = [...mappings]; updated[i] = { ...updated[i], [field]: value }; setMappings(updated);
    setValidationError(null);
  };

  const nextTable = () => {
    const incomplete = mappings.filter((m) => (m.pin && !m.component) || (!m.pin && m.component));
    if (incomplete.length > 0) {
      setValidationError('Each mapping must have both a pin and a component. Remove empty rows or complete them.');
      return;
    }
    updateWizardData({ connectionsConfig: { pins: mappings.filter((m) => m.pin && m.component) } });
    setWizardStep('behavior');
  };

  const handleDesignerComplete = (config: { pins: PinMapping[] }) => {
    updateWizardData({ connectionsConfig: config });
    setWizardStep('behavior');
  };

  return (
    <div>
      <Button variant="ghost" onClick={() => setWizardStep('board')} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Configure Connections</h2>
          <p className="text-gray-400 text-sm">Define your pin mappings and component connections.</p>
        </div>

        {/* Mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('visual')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
                        border transition-all
                        ${mode === 'visual'
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}
          >
            <Workflow className="w-4 h-4" />
            Visual Designer
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
                        border transition-all
                        ${mode === 'manual'
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                          : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:border-zinc-600'}`}
          >
            <Grid3x3 className="w-4 h-4" />
            Manual Table
          </button>
        </div>
      </div>

      {mode === 'visual' ? (
        boardLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-10rem)] text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading board...
          </div>
        ) : board ? (
          <HardwareDesigner
            boardId={board.id}
            boardName={board.name}
            processor={board.processor}
            interfaces={board.interfaces}
            onComplete={handleDesignerComplete}
          />
        ) : (
          <div className="text-gray-400 text-center py-12">Board not found. Please go back and select a board.</div>
        )
      ) : (
        <>
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2 text-xs text-gray-500 px-1">
              <span>Pin</span><span>Component</span><span>Description</span><span></span>
            </div>
            {mappings.map((m, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2">
                <Input placeholder="GPIO2" value={m.pin} onChange={(e) => updateRow(i, 'pin', e.target.value)} />
                <Input placeholder="DHT22" value={m.component} onChange={(e) => updateRow(i, 'component', e.target.value)} />
                <Input placeholder="Temperature sensor data pin" value={m.description} onChange={(e) => updateRow(i, 'description', e.target.value)} />
                <Button variant="ghost" size="icon" onClick={() => removeRow(i)} className="text-red-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addRow}>
              <Plus className="w-4 h-4 mr-1" /> Add Pin
            </Button>
          </div>
          {validationError && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-800 rounded-lg text-sm text-red-400">
              {validationError}
            </div>
          )}
          <div className="mt-8 flex justify-end">
            <Button onClick={nextTable}>Continue</Button>
          </div>
        </>
      )}
    </div>
  );
}
