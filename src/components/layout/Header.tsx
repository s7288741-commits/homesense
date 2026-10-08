'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, ChevronDown, Check, Sparkles } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { mockHousehold } from '@/data/mock/household.mock';
import { useHousehold } from '@/context/HouseholdContext';

export default function Header() {
  const { budget, notifications, markNotificationRead } = useHousehold();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#080A0F]/90 px-6 backdrop-blur-xl">
      {/* Left: Household Info & Budget */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏠</span>
          <div>
            <h1 className="text-sm font-bold text-white">{mockHousehold.name}</h1>
            <p className="text-[11px] text-slate-400">{mockHousehold.members.length} members active</p>
          </div>
        </div>

        {/* Budget Bar */}
        {budget && (
          <div className="ml-4 hidden items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#121722] px-4 py-1.5 shadow-sm md:flex">
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Monthly Budget</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-white">{formatCurrency(budget.spentThisMonth)}</span>
                <span className="text-[11px] text-slate-400">/ {formatCurrency(budget.monthlyTarget)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold text-emerald-400">
                {formatCurrency(budget.remaining)} left
              </span>
              <div className="h-1.5 w-24 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-violet-600 transition-all duration-500"
                  style={{ width: `${Math.min(100, budget.percentUsed)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Landing Page Link Button */}
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300 hover:bg-violet-600 hover:text-white transition-all shadow-sm"
          title="View Landing Page & Product Tour"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Landing Page</span>
        </Link>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 shadow-sm transition-all hover:bg-white/10 hover:text-white"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white shadow-md shadow-violet-600/30">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-white/10 bg-[#121722] p-3 shadow-2xl">
                <div className="mb-2 px-3 py-1 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-bold text-white">Notifications</h3>
                    <p className="text-[11px] text-slate-400">{unreadCount} unread</p>
                  </div>
                </div>
                <div className="max-h-80 space-y-1 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={cn(
                        'cursor-pointer rounded-xl px-3 py-2.5 transition-all hover:bg-white/5 flex items-start justify-between gap-2',
                        !notif.isRead && 'bg-violet-500/10 border-l-2 border-violet-500'
                      )}
                    >
                      <div>
                        <p className="text-xs font-semibold text-white">{notif.title}</p>
                        <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-2">{notif.message}</p>
                      </div>
                      {!notif.isRead && <Check className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 shadow-sm">
          <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 font-bold text-xs">
            PM
          </div>
          <span className="text-xs font-semibold text-slate-200">Prakash</span>
          <ChevronDown className="h-3 w-3 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
