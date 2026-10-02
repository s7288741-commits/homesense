'use client';

import React, { useEffect, useRef } from 'react';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, ShoppingBag, Receipt, PiggyBank, ArrowRight } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import type { MonthlySpending } from '@/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface QuickAnalyticsProps {
  data: {
    spentThisMonth: number;
    itemsPurchased: number;
    shoppingTrips: number;
    savedThisMonth: number;
    categoryBreakdown: MonthlySpending['categoryBreakdown'];
  } | null;
  isLoading: boolean;
}

export default function QuickAnalytics({ data, isLoading }: QuickAnalyticsProps) {
  if (isLoading || !data) {
    return (
      <div className="glass-card rounded-2xl p-5">
        <div className="skeleton mb-4 h-4 w-32" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Spent', value: formatCurrency(data.spentThisMonth), icon: Receipt, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Items', value: `${data.itemsPurchased}`, icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Trips', value: `${data.shoppingTrips}`, icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Saved', value: formatCurrency(data.savedThisMonth), icon: PiggyBank, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  ];

  const doughnutData = {
    labels: data.categoryBreakdown.map((c) => c.category),
    datasets: [
      {
        data: data.categoryBreakdown.map((c) => c.amount),
        backgroundColor: data.categoryBreakdown.map((c) => c.color),
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 4,
        spacing: 2,
        borderRadius: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1a1a2e',
        titleColor: '#fff',
        bodyColor: 'rgba(255,255,255,0.6)',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        cornerRadius: 10,
        padding: 10,
        callbacks: {
          label: (context: { parsed: number; label: string }) => ` ${formatCurrency(context.parsed)}`,
        },
      },
    },
  };

  return (
    <div className="glass-card rounded-2xl p-5 animate-fade-in">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">This Month</h2>
        <a
          href="/household-memory"
          className="flex items-center gap-1 text-[11px] text-white/30 transition-all hover:text-white/50"
        >
          Details <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      {/* Stat Cards */}
      <div className="mb-4 grid grid-cols-4 gap-2">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="flex flex-col items-center rounded-xl bg-white/[0.03] px-2 py-3">
            <div className={`mb-1 flex h-7 w-7 items-center justify-center rounded-lg ${bg}`}>
              <Icon className={`h-3.5 w-3.5 ${color}`} />
            </div>
            <span className="text-sm font-bold text-white">{value}</span>
            <span className="text-[9px] text-white/30">{label}</span>
          </div>
        ))}
      </div>

      {/* Category Chart + Legend */}
      <div className="flex items-center gap-4">
        <div className="relative h-[100px] w-[100px] shrink-0">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
        <div className="flex-1 space-y-1.5">
          {data.categoryBreakdown.map((cat) => (
            <div key={cat.category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-[11px] text-white/50">{cat.category}</span>
              </div>
              <span className="text-[11px] font-medium text-white/60">{cat.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
