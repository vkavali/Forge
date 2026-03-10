'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import Sidebar from '../../components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { hydrate } = useAuthStore();
  const router = useRouter();

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => { if (typeof window !== 'undefined' && !localStorage.getItem('token')) router.push('/auth/login'); }, [router]);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 overflow-auto"><div className="p-8">{children}</div></main>
    </div>
  );
}
