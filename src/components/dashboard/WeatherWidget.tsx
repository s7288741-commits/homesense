'use client';

import React from 'react';
import { cn, formatDate } from '@/lib/utils';
import type { ShoppingWindow } from '@/types';
import { Cloud, Droplets, Sun, CloudRain, CloudLightning } from 'lucide-react';

interface WeatherWidgetProps {
  data: ShoppingWindow | null;
  isLoading: boolean;
}

const CONDITION_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  CLEAR: { icon: Sun, color: 'text-amber-400' },
  CLOUDY: { icon: Cloud, color: 'text-slate-400' },
  RAIN: { icon: CloudRain, color: 'text-blue-400' },
  HEAVY_RAIN: { icon: CloudLightning, color: 'text-indigo-400' },
  STORM: { icon: CloudLightning, color: 'text-red-400' },
};

export default function WeatherWidget({ data, isLoading }: WeatherWidgetProps) {
  if (isLoading || !data) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <div className="skeleton mb-3 h-4 w-32" />
        <div className="skeleton mb-3 h-16 rounded-xl" />
        <div className="flex gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-16 flex-1 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const today = data.weatherForecast[0];
  const todayConfig = today ? CONDITION_ICONS[today.condition] : CONDITION_ICONS.CLEAR;
  const TodayIcon = todayConfig.icon;

  return (
    <div className="glass-card rounded-2xl p-5 animate-fade-in">
      <div className="mb-3 flex items-center gap-2">
        <Cloud className="h-4 w-4 text-white/40" />
        <h2 className="text-sm font-semibold text-white">Shopping Window</h2>
      </div>

      {/* Today */}
      {today && (
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
          <TodayIcon className={cn('h-8 w-8', todayConfig.color)} />
          <div>
            <p className="text-xs font-medium text-white/60">Today</p>
            <p className="text-sm font-semibold text-white/80">{today.description}</p>
            <p className="text-[11px] text-white/30">{today.temperature}°C</p>
          </div>
        </div>
      )}

      {/* Suggested Window */}
      <div className="mb-3 rounded-xl border border-violet-500/20 bg-violet-500/[0.06] px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">💡</span>
          <span className="text-xs font-semibold text-violet-300">Suggested</span>
        </div>
        <p className="mt-1 text-sm font-medium text-white/80">{data.suggestedTimeSlot}</p>
        <p className="mt-0.5 text-[11px] text-white/40">{data.reasoning}</p>
      </div>

      {/* 5-Day Forecast Mini */}
      <div className="flex gap-1.5">
        {data.weatherForecast.slice(0, 5).map((day, i) => {
          const config = CONDITION_ICONS[day.condition] || CONDITION_ICONS.CLEAR;
          const DayIcon = config.icon;
          const dateObj = new Date(day.date);
          const dayLabel = i === 0 ? 'Today' : dateObj.toLocaleDateString('en-IN', { weekday: 'short' });

          return (
            <div
              key={day.date}
              className={cn(
                'flex flex-1 flex-col items-center rounded-lg py-2 transition-all',
                i === 0 ? 'bg-white/[0.04]' : 'hover:bg-white/[0.03]'
              )}
            >
              <span className="text-[9px] font-medium text-white/30">{dayLabel}</span>
              <DayIcon className={cn('my-1 h-4 w-4', config.color)} />
              <span className="text-[10px] text-white/50">{day.temperature}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
