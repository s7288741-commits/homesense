'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { cn, formatCurrency, calcPercentage } from '@/lib/utils';
import { getDashboardBudget, getNotifications } from '@/services/dashboard.service';
import type { HouseholdBudget, AppNotification } from '@/types';
import { mockHousehold } from '@/data/mock/household.mock';

export default function Header() {
  const [budget, setBudget] = useState<HouseholdBudget | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    getDashboardBudget().then(setBudget);
    getNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const budgetColor = budget
    ? budget.percentUsed >= 90 ? 'bg-red-500' : budget.percentUsed >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
    : 'bg-white/10';

  const budgetTrackColor = budget
    ? budget.percentUsed >= 90 ? 'bg-red-500/20' : budget.percentUsed >= 70 ? 'bg-amber-500/20' : 'bg-emerald-500/20'
    : 'bg-white/5';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0a0a0f]/80 px-6 backdrop-blur-xl">
      {/* Left: Household Info */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏠</span>
          <div>
            <h1 className="text-sm font-semibold text-white">{mockHousehold.name}</h1>
            <p className="text-[11px] text-white/40">{mockHousehold.members.length} members</p>
          </div>
        </div>

        {/* Budget Bar */}
        {budget && (
          <div className="ml-4 hidden items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-1.5 md:flex">
            <div className="flex flex-col">
              <span className="text-[10px] font-medium tracking-wider text-white/30 uppercase">Monthly Budget</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-white">{formatCurrency(budget.spentThisMonth)}</span>
                <span className="text-[11px] text-white/30">/ {formatCurrency(budget.monthlyTarget)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={cn(
                'text-[10px] font-semibold',
                budget.percentUsed >= 90 ? 'text-red-400' : budget.percentUsed >= 70 ? 'text-amber-400' : 'text-emerald-400'
              )}>
                {formatCurrency(budget.remaining)} left
              </span>
              <div className={cn('h-1.5 w-24 rounded-full', budgetTrackColor)}>
                <div
                  className={cn('h-full rounded-full transition-all duration-500', budgetColor)}
                  style={{ width: `${Math.min(100, budget.percentUsed)}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-white/40 transition-all hover:bg-white/[0.06] hover:text-white/60">
          <Search className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-white/40 transition-all hover:bg-white/[0.06] hover:text-white/60"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-violet-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-violet-500/30">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-white/[0.08] bg-[#12121a] p-2 shadow-2xl shadow-black/50">
                <div className="mb-2 px-3 py-2">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                  <p className="text-[11px] text-white/40">{unreadCount} unread</p>
                </div>
                <div className="max-h-80 space-y-1 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'cursor-pointer rounded-xl px-3 py-2.5 transition-all hover:bg-white/[0.04]',
                        !notif.isRead && 'bg-violet-500/[0.04] border-l-2 border-violet-500'
                      )}
                    >
                      <p className="text-xs font-medium text-white/80">{notif.title}</p>
                      <p className="mt-0.5 text-[11px] text-white/40 line-clamp-2">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:bg-white/[0.04]">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 ring-1 ring-white/10">
            <User className="h-4 w-4 text-violet-300" />
          </div>
          <ChevronDown className="h-3 w-3 text-white/30" />
        </button>
      </div>
    </header>
  );
}
