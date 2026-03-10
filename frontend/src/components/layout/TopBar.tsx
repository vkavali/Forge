'use client';

import { useAuthStore } from '../../stores/authStore';

export default function TopBar({ title }: { title?: string }) {
  const { name } = useAuthStore();
  return (
    <header className="h-16 border-b border-gray-800 bg-gray-900/50 backdrop-blur flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-white">{title || 'Dashboard'}</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">{name}</span>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
          {name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
