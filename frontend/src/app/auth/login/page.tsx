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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await api.auth.login({ email, password });
      login(res.data.token, res.data.userId, res.data.email, res.data.name);
      router.push('/dashboard');
    } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Login failed'); } finally { setLoading(false); }
  };

  return (
    <Card><CardHeader className="text-center"><div className="flex justify-center mb-4"><Cpu className="w-10 h-10 text-amber-500" /></div><CardTitle>Welcome back</CardTitle><CardDescription>Sign in to your TheShipboard account</CardDescription></CardHeader>
      <CardContent><form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}</Button>
        <p className="text-sm text-gray-400 text-center">Don&apos;t have an account? <Link href="/auth/register" className="text-amber-400 hover:underline">Sign up</Link></p>
      </form></CardContent></Card>
  );
}
