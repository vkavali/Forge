'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { useAuthStore } from '../../../stores/authStore';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Cpu, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await api.auth.register({ name, email, password });
      login(res.data.token, res.data.userId, res.data.email, res.data.name);
      router.push('/dashboard');
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Registration failed'); } finally { setLoading(false); }
  };

  return (
    <Card><CardHeader className="text-center"><div className="flex justify-center mb-4"><Cpu className="w-10 h-10 text-amber-500" /></div><CardTitle>Create an account</CardTitle><CardDescription>Get started with TheShipboard</CardDescription></CardHeader>
      <CardContent><form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}</Button>
        <p className="text-sm text-gray-400 text-center">Already have an account? <Link href="/auth/login" className="text-amber-400 hover:underline">Sign in</Link></p>
      </form></CardContent></Card>
  );
}
