'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FolderPlus, LogOut, Cpu, GraduationCap, BookOpen, Users, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'next/navigation';
import { cn } from '../../lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Projects', icon: LayoutDashboard, description: 'Your workspace' },
  { href: '/dashboard/projects/new', label: 'New Project', icon: FolderPlus, description: 'Create hardware' },
  { href: '/dashboard/learn', label: 'Learn', icon: GraduationCap, description: 'Guided projects' },
  { href: '/dashboard/templates', label: 'Templates', icon: BookOpen, description: 'Reusable designs' },
  { href: '/dashboard/classroom', label: 'Classroom', icon: Users, description: 'Teach & learn' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { name, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push('/'); };

  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800/80 flex flex-col h-screen sticky top-0">
      {/* Brand */}
      <div className="p-5 border-b border-zinc-800/80">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
            <Cpu className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <span className="text-base font-bold text-white tracking-tight">TheShipboard</span>
            <p className="text-[10px] text-zinc-600 leading-none">Hardware Generator</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest px-3 mb-2 mt-1">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all group relative',
                isActive
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm shadow-amber-500/5'
                  : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200 border border-transparent'
              )}
            >
              <item.icon className={cn('w-[18px] h-[18px] shrink-0', isActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300')} />
              <div className="flex-1 min-w-0">
                <span className="block leading-tight">{item.label}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-500/50" />}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-zinc-800/80">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
            <span className="text-xs font-bold text-amber-400">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-300 truncate">{name}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-zinc-500 hover:bg-zinc-800/60 hover:text-zinc-300 w-full transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
