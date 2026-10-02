'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { STATUS_CONFIG, ItemStatus } from '@/types';
import type { InventoryHealthSummary } from '@/types';
import { formatRemainingDays } from '@/lib/utils';
import { AlertTriangle, ArrowRight, Package } from 'lucide-react';

interface InventoryHealthProps {
  data: InventoryHealthSummary | null;
  isLoading: boolean;
}

export default function InventoryHealth({ data, isLoading }: InventoryHealthProps) {
  if (isLoading || !data) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <div className="skeleton mb-4 h-5 w-40" />
        <div className="grid grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-xl" />
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-10 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const statusCards = [
    { status: ItemStatus.NORMAL, count: data.normal },
    { status: ItemStatus.UPCOMING, count: data.upcoming },
    { status: ItemStatus.RUNNING_LOW, count: data.runningLow },
    { status: ItemStatus.UNKNOWN, count: data.unknown },
  ];

  return (
    <div className="glass-card rounded-2xl p-5 animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-white/40" />
          <h2 className="text-sm font-semibold text-white">Inventory Health</h2>
        </div>
        <span className="text-[11px] text-white/30">{data.total} items tracked</span>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-2">
        {statusCards.map(({ status, count }) => {
          const config = STATUS_CONFIG[status];
          return (
            <div
              key={status}
              className={cn(
                'flex flex-col items-center rounded-xl border px-3 py-3 transition-all hover:scale-[1.02] cursor-pointer',
                config.bgColor,
                config.borderColor
              )}
            >
              <span className="text-lg">{config.emoji}</span>
              <span className={cn('text-xl font-bold', config.color)}>{count}</span>
              <span className="text-[10px] font-medium text-white/40">{config.label}</span>
            </div>
          );
        })}
      </div>

      {/* Running Low Items */}
      {data.runningLowItems.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
            <span className="text-xs font-semibold text-red-400">Action Needed</span>
          </div>
          <div className="space-y-1.5">
            {data.runningLowItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-red-500/[0.06] px-3 py-2 border border-red-500/10"
              >
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-400 pulse-red" />
                  <span className="text-xs font-medium text-white/80">{item.name}</span>
                </div>
                <span className="text-[11px] text-red-400/80">
                  {formatRemainingDays(item.remainingDaysMin, item.remainingDaysMax)} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Items */}
      {data.upcomingItems.length > 0 && (
        <div className="mt-3">
          <span className="mb-1.5 block text-xs font-medium text-amber-400/60">Coming Up</span>
          <div className="space-y-1">
            {data.upcomingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg px-3 py-1.5"
              >
                <span className="text-[11px] text-white/50">{item.name}</span>
                <span className="text-[11px] text-amber-400/60">
                  {formatRemainingDays(item.remainingDaysMin, item.remainingDaysMax)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Link to inventory */}
      <a
        href="/inventory"
        className="mt-3 flex items-center justify-center gap-1 rounded-xl border border-white/[0.06] py-2 text-[11px] font-medium text-white/30 transition-all hover:border-white/10 hover:text-white/50"
      >
        View Full Inventory <ArrowRight className="h-3 w-3" />
      </a>
    </div>
  );
}
