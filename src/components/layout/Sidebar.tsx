'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getMainNavItems, getSettingsNavItems } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const mainItems = getMainNavItems();
  const settingsItems = getSettingsNavItems();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen flex flex-col border-r border-white/[0.06] bg-[#080A0F]/95 backdrop-blur-xl transition-all duration-300',
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Brand */}
      <Link href="/" className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-4 hover:bg-white/5 transition-all">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/20">
          <Sparkles className="h-5 w-5" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-extrabold tracking-tight text-white">HomeSense</span>
            <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">Intelligence</span>
          </div>
        )}
      </Link>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {mainItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <div
                  className={cn(
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-slate-400 group-hover:text-white'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-white/[0.06]" />

        {/* Settings Nav */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="mb-2 px-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase">Settings</p>
          )}
          {settingsItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/25'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-white/5">
                  <Icon className="h-4 w-4" />
                </div>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-white/[0.06] p-3">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/[0.02] px-3 py-2 text-xs font-medium text-slate-400 shadow-sm hover:bg-white/5 hover:text-white"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
