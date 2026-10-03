import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: {
    text: string;
    variant?: 'violet' | 'emerald' | 'amber' | 'red' | 'neutral';
  };
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  badge,
  actions,
  className,
}: PageHeaderProps) {
  const badgeColors = {
    violet: 'bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/20',
    emerald: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/20',
    amber: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20',
    red: 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/20',
    neutral: 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/60 border-slate-200 dark:border-white/10',
  };

  return (
    <div className={cn('mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between', className)}>
      <div>
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">
              <Icon className="h-5 w-5" />
            </div>
          )}
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          {badge && (
            <span
              className={cn(
                'rounded-full border px-3 py-0.5 text-xs font-bold',
                badgeColors[badge.variant || 'violet']
              )}
            >
              {badge.text}
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-white/50">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
