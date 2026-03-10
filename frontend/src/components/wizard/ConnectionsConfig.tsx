'use client';

import { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface PinMapping { pin: string; component: string; description: string; }

export default function ConnectionsConfig() {
  const { wizardData, updateWizardData, setWizardStep } = useProjectStore();
  const [mappings, setMappings] = useState<PinMapping[]>(
    (wizardData.connectionsConfig?.pins as PinMapping[]) || [{ pin: '', component: '', description: '' }]
  );

  const addRow = () => setMappings([...mappings, { pin: '', component: '', description: '' }]);
  const removeRow = (i: number) => setMappings(mappings.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof PinMapping, value: string) => {
    const updated = [...mappings]; updated[i] = { ...updated[i], [field]: value }; setMappings(updated);
  };

  const next = () => {
    updateWizardData({ connectionsConfig: { pins: mappings.filter((m) => m.pin || m.component) } });
    setWizardStep('behavior');
  };

  return (
    <div>
      <Button variant="ghost" onClick={() => setWizardStep('board')} className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
      <h2 className="text-2xl font-bold text-white mb-2">Configure Connections</h2>
      <p className="text-gray-400 mb-6">Define your pin mappings and component connections.</p>
      <div className="space-y-3">
        <div className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2 text-xs text-gray-500 px-1"><span>Pin</span><span>Component</span><span>Description</span><span></span></div>
        {mappings.map((m, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_2fr_auto] gap-2">
            <Input placeholder="GPIO2" value={m.pin} onChange={(e) => updateRow(i, 'pin', e.target.value)} />
            <Input placeholder="DHT22" value={m.component} onChange={(e) => updateRow(i, 'component', e.target.value)} />
            <Input placeholder="Temperature sensor data pin" value={m.description} onChange={(e) => updateRow(i, 'description', e.target.value)} />
            <Button variant="ghost" size="icon" onClick={() => removeRow(i)} className="text-red-400"><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={addRow}><Plus className="w-4 h-4 mr-1" /> Add Pin</Button>
      </div>
      <div className="mt-8 flex justify-end"><Button onClick={next}>Continue</Button></div>
    </div>
  );
}
