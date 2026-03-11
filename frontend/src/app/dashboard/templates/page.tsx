'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { ProjectTemplate } from '../../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { BookOpen, Plus, Loader2, Clock } from 'lucide-react';

export default function MyTemplatesPage() {
  const [templates, setTemplates] = useState<ProjectTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: '', description: '', category: 'MICROCONTROLLER', boardId: 'esp32-dev',
    difficultyLevel: 'BEGINNER', subjectArea: '', behaviorSpec: '',
    learningObjectives: '',  estimatedMinutes: 30,
  });

  useEffect(() => {
    const load = async () => {
      try { const res = await api.templates.mine(); setTemplates(res.data); }
      catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const objectives = form.learningObjectives.split('\n').map(s => s.trim()).filter(Boolean);
      await api.templates.create({
        name: form.name, description: form.description, category: form.category,
        boardId: form.boardId, difficultyLevel: form.difficultyLevel,
        subjectArea: form.subjectArea, behaviorSpec: form.behaviorSpec,
        learningObjectives: objectives, estimatedMinutes: form.estimatedMinutes,
        connectionsConfig: {}, isPublic: true,
      });
      const res = await api.templates.mine();
      setTemplates(res.data);
      setShowCreate(false);
      setForm({ name: '', description: '', category: 'MICROCONTROLLER', boardId: 'esp32-dev', difficultyLevel: 'BEGINNER', subjectArea: '', behaviorSpec: '', learningObjectives: '', estimatedMinutes: 30 });
    } catch (err: unknown) { alert(err instanceof Error ? err.message : 'Failed'); }
    finally { setCreating(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-500" /> My Templates
          </h1>
          <p className="text-gray-400 mt-2">Create and manage your project templates.</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          <Plus className="w-4 h-4 mr-2" /> New Template
        </Button>
      </div>

      {showCreate && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Create Template</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Board ID</label>
                <input value={form.boardId} onChange={e => setForm({ ...form, boardId: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                  <option>MICROCONTROLLER</option><option>MICROPYTHON</option><option>LINUX_SBC</option>
                  <option>ROBOTICS</option><option>DRONE</option><option>AUTOMOTIVE</option>
                  <option>MOTOR_CONTROL</option><option>CNC</option><option>FPGA</option>
                  <option>WEARABLE</option><option>AUDIO_DSP</option><option>INDUSTRIAL</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Difficulty</label>
                <select value={form.difficultyLevel} onChange={e => setForm({ ...form, difficultyLevel: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Subject Area</label>
                <input value={form.subjectArea} onChange={e => setForm({ ...form, subjectArea: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="e.g. IoT, Robotics" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Estimated Minutes</label>
                <input type="number" value={form.estimatedMinutes} onChange={e => setForm({ ...form, estimatedMinutes: parseInt(e.target.value) || 30 })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Behavior Specification</label>
                <textarea value={form.behaviorSpec} onChange={e => setForm({ ...form, behaviorSpec: e.target.value })} rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="Describe what the project should do..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-400 mb-1">Learning Objectives (one per line)</label>
                <textarea value={form.learningObjectives} onChange={e => setForm({ ...form, learningObjectives: e.target.value })} rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="Understand GPIO pin configuration&#10;Learn to read sensor data&#10;..." />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreate} disabled={creating || !form.name}>
                {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {creating ? 'Creating...' : 'Create Template'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-gray-400"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>
      ) : templates.length === 0 ? (
        <p className="text-gray-500">No templates yet. Create one to get started!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => (
            <Card key={t.id}>
              <CardHeader>
                <CardTitle className="text-lg">{t.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-400 mb-3">{t.description}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-600/10 text-blue-400 text-xs rounded-full">{t.category}</span>
                  <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full">{t.boardId}</span>
                  <span className="px-2 py-0.5 bg-green-600/10 text-green-400 text-xs rounded-full">{t.difficultyLevel}</span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {t.estimatedMinutes} min
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
