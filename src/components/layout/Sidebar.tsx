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
        'fixed left-0 top-0 z-40 h-screen flex flex-col border-r border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-xl transition-all duration-300',
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-bold tracking-wide text-white">HomeSense</span>
            <span className="text-[10px] font-medium tracking-widest text-white/40 uppercase">Intelligence</span>
          </div>
        )}
      </div>

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
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-violet-500/15 to-indigo-500/10 text-white shadow-sm shadow-violet-500/5'
                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white/80'
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-500/25'
                      : 'bg-white/[0.04] text-white/50 group-hover:bg-white/[0.08] group-hover:text-white/70'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {!isCollapsed && <span>{item.label}</span>}
                {!isCollapsed && isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="my-4 h-px bg-white/[0.06]" />

        {/* Settings Nav */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="mb-2 px-3 text-[10px] font-semibold tracking-widest text-white/25 uppercase">Settings</p>
          )}
          {settingsItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-white/[0.06] text-white'
                    : 'text-white/40 hover:bg-white/[0.04] hover:text-white/60'
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04]">
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2 text-xs text-white/30 transition-all hover:bg-white/[0.06] hover:text-white/50"
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
