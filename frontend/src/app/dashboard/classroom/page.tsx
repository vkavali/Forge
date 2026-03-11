'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { Classroom, ClassroomAssignment } from '../../../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Users, Plus, Copy, Loader2, ClipboardList } from 'lucide-react';

type View = 'overview' | 'classroom';

export default function ClassroomPage() {
  const [teaching, setTeaching] = useState<Classroom[]>([]);
  const [enrolled, setEnrolled] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('overview');
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [assignments, setAssignments] = useState<ClassroomAssignment[]>([]);

  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [creating, setCreating] = useState(false);

  const [createForm, setCreateForm] = useState({ name: '', description: '' });
  const [joinCode, setJoinCode] = useState('');

  const loadClassrooms = async () => {
    try {
      const [t, e] = await Promise.all([api.classrooms.teaching(), api.classrooms.enrolled()]);
      setTeaching(t.data);
      setEnrolled(e.data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { loadClassrooms(); }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      await api.classrooms.create(createForm);
      await loadClassrooms();
      setShowCreate(false);
      setCreateForm({ name: '', description: '' });
    } catch (err: unknown) { alert(err instanceof Error ? err.message : 'Failed'); }
    finally { setCreating(false); }
  };

  const handleJoin = async () => {
    try {
      await api.classrooms.join(joinCode);
      await loadClassrooms();
      setShowJoin(false);
      setJoinCode('');
    } catch (err: unknown) { alert(err instanceof Error ? err.message : 'Failed to join'); }
  };

  const openClassroom = async (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setView('classroom');
    try {
      const res = await api.classrooms.assignments(classroom.id);
      setAssignments(res.data);
    } catch {}
  };

  const copyJoinCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  if (loading) return <div className="text-gray-400 flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Loading...</div>;

  if (view === 'classroom' && selectedClassroom) {
    return (
      <div>
        <button onClick={() => setView('overview')} className="text-gray-400 hover:text-white text-sm mb-4 transition-colors">&larr; Back to Classrooms</button>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{selectedClassroom.name}</h1>
            <p className="text-gray-400 mt-1">{selectedClassroom.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500">Join Code:</span>
              <code className="bg-gray-800 px-2 py-0.5 rounded text-sm text-blue-400">{selectedClassroom.joinCode}</code>
              <button onClick={() => copyJoinCode(selectedClassroom.joinCode)} className="text-gray-500 hover:text-white transition-colors">
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white mb-4">Assignments</h2>
        {assignments.length === 0 ? (
          <p className="text-gray-500">No assignments yet.</p>
        ) : (
          <div className="space-y-3">
            {assignments.map(a => (
              <Card key={a.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">{a.title}</h3>
                      <p className="text-sm text-gray-400 mt-1">{a.instructions}</p>
                      {a.dueDate && <p className="text-xs text-gray-500 mt-1">Due: {new Date(a.dueDate).toLocaleDateString()}</p>}
                    </div>
                    <ClipboardList className="w-5 h-5 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-500" /> Classroom
          </h1>
          <p className="text-gray-400 mt-2">Create or join classrooms for guided learning.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowJoin(!showJoin)}>Join Class</Button>
          <Button onClick={() => setShowCreate(!showCreate)}><Plus className="w-4 h-4 mr-2" /> Create Class</Button>
        </div>
      </div>

      {showJoin && (
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-sm text-gray-400 mb-1">Join Code</label>
                <input value={joinCode} onChange={e => setJoinCode(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" placeholder="Enter join code..." />
              </div>
              <Button onClick={handleJoin} disabled={!joinCode}>Join</Button>
              <Button variant="outline" onClick={() => setShowJoin(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showCreate && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Create Classroom</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input value={createForm.name} onChange={e => setCreateForm({ ...createForm, name: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea value={createForm.description} onChange={e => setCreateForm({ ...createForm, description: e.target.value })} rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleCreate} disabled={creating || !createForm.name}>
                {creating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {creating ? 'Creating...' : 'Create'}
              </Button>
              <Button variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {teaching.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Teaching</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teaching.map(c => (
              <Card key={c.id} className="cursor-pointer hover:border-blue-700 transition-colors" onClick={() => openClassroom(c)}>
                <CardHeader>
                  <CardTitle className="text-lg">{c.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400 mb-3">{c.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Code:</span>
                    <code className="bg-gray-800 px-2 py-0.5 rounded text-xs text-blue-400">{c.joinCode}</code>
                    <button onClick={(e) => { e.stopPropagation(); copyJoinCode(c.joinCode); }} className="text-gray-500 hover:text-white transition-colors">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {enrolled.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Enrolled</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolled.map(c => (
              <Card key={c.id} className="cursor-pointer hover:border-blue-700 transition-colors" onClick={() => openClassroom(c)}>
                <CardHeader>
                  <CardTitle className="text-lg">{c.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">{c.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {teaching.length === 0 && enrolled.length === 0 && (
        <p className="text-gray-500">No classrooms yet. Create one or join with a code!</p>
      )}
    </div>
  );
}
