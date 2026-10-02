'use client';

import React from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { PLAN_STATUS_CONFIG, type PlanStatus, type ShoppingPlan } from '@/types';
import { ClipboardList, ArrowRight, CalendarDays } from 'lucide-react';

interface PlanOverviewProps {
  data: { id: string; monthYear: string; status: PlanStatus; totalEstimate: number; generatedAt: string; itemCount: number } | null;
  budget: { monthlyTarget: number; remaining: number } | null;
  isLoading: boolean;
}

export default function PlanOverview({ data, budget, isLoading }: PlanOverviewProps) {
  if (isLoading || !data) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <div className="skeleton mb-3 h-4 w-32" />
        <div className="skeleton mb-2 h-8 rounded-lg" />
        <div className="skeleton h-16 rounded-lg" />
      </div>
    );
  }

  const statusConfig = PLAN_STATUS_CONFIG[data.status];
  const isWithinBudget = budget ? data.totalEstimate <= budget.monthlyTarget : true;
  const steps: PlanStatus[] = ['DRAFT', 'READY', 'APPROVED', 'COMPLETED'] as PlanStatus[];
  const currentStep = steps.indexOf(data.status);

  return (
    <div className="glass-card rounded-2xl p-5 animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-white/40" />
          <h2 className="text-sm font-semibold text-white">{data.monthYear} Plan</h2>
        </div>
        <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-semibold', statusConfig.bgColor, statusConfig.color)}>
          {statusConfig.label}
        </span>
      </div>

      {/* Progress Steps */}
      <div className="mb-4 flex items-center gap-1">
        {steps.map((step, i) => {
          const stepConfig = PLAN_STATUS_CONFIG[step];
          const isActive = i <= currentStep;
          return (
            <React.Fragment key={step}>
              <div
                className={cn(
                  'flex h-7 items-center justify-center rounded-md px-2 text-[10px] font-medium transition-all',
                  isActive ? `${stepConfig.bgColor} ${stepConfig.color}` : 'bg-white/[0.03] text-white/20'
                )}
              >
                {stepConfig.label}
              </div>
              {i < steps.length - 1 && (
                <div className={cn('h-px flex-1', isActive && i < currentStep ? 'bg-violet-500/30' : 'bg-white/[0.06]')} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-white/[0.03] px-3 py-2.5">
          <span className="text-[10px] text-white/30">Items</span>
          <p className="text-lg font-bold text-white">{data.itemCount}</p>
        </div>
        <div className="rounded-xl bg-white/[0.03] px-3 py-2.5">
          <span className="text-[10px] text-white/30">Estimated</span>
          <p className="text-lg font-bold text-white">{formatCurrency(data.totalEstimate)}</p>
        </div>
      </div>

      {/* Budget status */}
      {budget && (
        <div className={cn(
          'mt-2 rounded-lg px-3 py-2 text-[11px] font-medium',
          isWithinBudget ? 'bg-emerald-500/[0.06] text-emerald-400' : 'bg-red-500/[0.06] text-red-400'
        )}>
          {isWithinBudget
            ? `✅ Within budget (${formatCurrency(budget.remaining)} remaining)`
            : `⚠️ ${formatCurrency(data.totalEstimate - budget.monthlyTarget)} over budget`
          }
        </div>
      )}

      <a
        href="/shopping-plan"
        className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-500/15 to-indigo-500/10 py-2.5 text-xs font-medium text-violet-300 transition-all hover:from-violet-500/20 hover:to-indigo-500/15"
      >
        Review Full Plan <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
