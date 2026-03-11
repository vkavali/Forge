'use client';

import { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { ArrowLeft } from 'lucide-react';

export default function BehaviorSpec() {
  const { wizardData, updateWizardData, setWizardStep } = useProjectStore();
  const [name, setName] = useState(wizardData.name || '');
  const [description, setDescription] = useState(wizardData.description || '');
  const [behavior, setBehavior] = useState(wizardData.behaviorSpec || '');

  const next = () => { updateWizardData({ name, description, behaviorSpec: behavior }); setWizardStep('review'); };

  return (
    <div>
      <Button variant="ghost" onClick={() => setWizardStep('connections')} className="mb-4"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
      <h2 className="text-2xl font-bold text-white mb-2">Describe Your Project</h2>
      <p className="text-gray-400 mb-6">Tell us what your project should do.</p>
      <div className="space-y-4 max-w-2xl">
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label><Input placeholder="e.g. Smart Soil Moisture Monitor" value={name} onChange={(e) => setName(e.target.value)} /></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Short Description</label><Input placeholder="e.g. Monitors soil moisture and sends alerts via WiFi" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Behavior Specification</label><Textarea rows={8} placeholder={"Describe the detailed behavior:\n- Read soil moisture every 5 minutes\n- Send data to MQTT broker\n- Flash LED when moisture is below 30%"} value={behavior} onChange={(e) => setBehavior(e.target.value)} /></div>
      </div>
      <div className="mt-8 flex justify-end"><Button onClick={next} disabled={!name || !behavior}>Continue</Button></div>
    </div>
  );
}
