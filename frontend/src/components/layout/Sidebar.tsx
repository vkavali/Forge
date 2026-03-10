'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderPlus, LogOut, Cpu } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'next/navigation';
import { cn } from '../../lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Projects', icon: LayoutDashboard },
  { href: '/dashboard/projects/new', label: 'New Project', icon: FolderPlus },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { name, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Cpu className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold text-white">TheShipboard</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors', pathname === item.href ? 'bg-blue-600/20 text-blue-400' : 'text-gray-400 hover:bg-gray-800 hover:text-white')}>
            <item.icon className="w-5 h-5" />{item.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="text-sm text-gray-400 mb-3 px-3">{name}</div>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white w-full transition-colors">
          <LogOut className="w-5 h-5" />Sign Out
        </button>
      </div>
    </aside>
  );
}
