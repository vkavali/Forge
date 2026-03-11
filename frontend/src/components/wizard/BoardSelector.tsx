'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { BoardDefinition } from '../../lib/types';
import { useProjectStore } from '../../stores/projectStore';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Cpu, Loader2 } from 'lucide-react';

export default function BoardSelector() {
  const [boards, setBoards] = useState<BoardDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const { wizardData, updateWizardData, setWizardStep } = useProjectStore();

  useEffect(() => {
    if (wizardData.category) {
      setLoading(true);
      api.boards.list(wizardData.category)
        .then((res) => setBoards(res.data))
        .finally(() => setLoading(false));
    }
  }, [wizardData.category]);

  return (
    <div>
      <Button variant="ghost" onClick={() => setWizardStep('category')} className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
      <h2 className="text-2xl font-bold text-white mb-2">Select a Board</h2>
      <p className="text-gray-400 mb-6">Choose the development board for your project.</p>
      {loading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading boards...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => {
            const selected = wizardData.boardId === board.id;
            return (
              <Card key={board.id} onClick={() => { updateWizardData({ boardId: board.id }); setWizardStep('connections'); }} className={`cursor-pointer p-5 transition-all hover:border-blue-500 ${selected ? 'border-blue-500 bg-blue-600/10' : ''}`}>
                <div className="flex items-start gap-3">
                  <Cpu className={`w-6 h-6 mt-0.5 ${selected ? 'text-blue-400' : 'text-gray-500'}`} />
                  <div>
                    <h3 className="font-semibold text-white text-sm">{board.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{board.processor} &middot; {board.formFactor}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {board.interfaces.slice(0, 4).map((iface) => (<span key={iface} className="px-1.5 py-0.5 bg-gray-800 rounded text-[10px] text-gray-400">{iface}</span>))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
