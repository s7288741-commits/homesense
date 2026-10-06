'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Sparkles, AlertTriangle, ArrowRight, ShoppingCart,
  Calendar, ShieldAlert, Check, CloudRain, Plus, X
} from 'lucide-react';
import {
  getDashboardHealthSummary,
  getActionCards,
  getDashboardBudget,
  getDashboardWeather,
  getDashboardPlanOverview,
  dismissActionCard,
} from '@/services/dashboard.service';
import type {
  InventoryHealthSummary,
  SmartActionCard,
  ShoppingWindow,
  HouseholdBudget,
} from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const [healthSummary, setHealthSummary] = useState<InventoryHealthSummary | null>(null);
  const [actionCards, setActionCards] = useState<SmartActionCard[]>([]);
  const [budget, setBudget] = useState<HouseholdBudget | null>(null);
  const [weather, setWeather] = useState<ShoppingWindow | null>(null);
  const [planOverview, setPlanOverview] = useState<{
    id: string; monthYear: string; status: string; totalEstimate: number; generatedAt: string; itemCount: number;
  } | null>(null);
  const [bannerAdded, setBannerAdded] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [health, cards, budgetData, weatherData, plan] = await Promise.all([
          getDashboardHealthSummary(),
          getActionCards(),
          getDashboardBudget(),
          getDashboardWeather(),
          getDashboardPlanOverview(),
        ]);

        setHealthSummary(health);
        setActionCards(cards);
        setBudget(budgetData);
        setWeather(weatherData);
        setPlanOverview(plan);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    }

    loadDashboardData();
  }, []);

  const handleDismissCard = async (cardId: string) => {
    setActionCards((prev) => prev.filter((c) => c.id !== cardId));
    await dismissActionCard(cardId);
  };

  const runningLowCount = healthSummary?.runningLowItems ? healthSummary.runningLowItems.length : 3;

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Page Header */}
      <PageHeader
        title="Household Overview"
        subtitle="Contextual replenishment intelligence — Remember → Predict → Explain → Recommend"
        icon={Sparkles}
      />

      {/* ── Compact Decision Banner (Reduced Footprint, Phone Mockup Removed) ── */}
      {!bannerDismissed && (
        <section className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-[#121722] p-6 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-400">
                  <AlertTriangle className="h-3 w-3" /> Urgent Decision Recommended
                </span>
                <span className="text-xs text-slate-400">{healthSummary?.total || 12} items tracked</span>
              </div>
              <h2 className="text-lg font-bold text-white">Cooking Oil & Basmati Rice Depletion Risk</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cooking oil will run out in ~2 days. Household velocity increased 15%. Rain forecast tomorrow morning (quick-commerce delivery recommended).
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 md:pt-0">
              {bannerAdded ? (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md">
                  <Check className="h-4 w-4" /> Added to Shopping Plan
                </span>
              ) : (
                <button
                  onClick={() => setBannerAdded(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500 transition-all"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Auto-Prepare Shopping Plan
                </button>
              )}
              <Link
                href="/shopping-plan"
                className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-all"
              >
                Review Plan
              </Link>
              <button
                onClick={() => setBannerDismissed(true)}
                className="p-2 text-slate-400 hover:text-white"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Main Operations Grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Urgent Risks & Actionable Recommendations */}
        <div className="space-y-5 lg:col-span-8">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-white">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              Urgent Household Risks ({runningLowCount})
            </h2>
            <Link href="/inventory" className="text-xs font-bold text-violet-400 hover:underline flex items-center gap-1">
              View All Inventory <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-red-500/30 bg-[#121722] p-5 space-y-3 shadow-md border-l-4 border-l-red-500">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Cooking Oil (Sunflower)</span>
                <span className="rounded-full bg-red-500/20 border border-red-500/40 px-2.5 py-0.5 text-[11px] font-bold text-red-400">
                  Critical: ~2 days
                </span>
              </div>
              <p className="text-xs text-slate-400">Current stock: 0.5 Liters · Preferred brand: Fortune</p>
              <div className="text-xs text-slate-300 bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
                <strong className="text-amber-400 block">Explanation:</strong> Average consumption is 0.2L/day. Unrestocked since 12 days ago.
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-[#121722] p-5 space-y-3 shadow-md border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">Basmati Rice</span>
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[11px] font-bold text-amber-400">
                  Low: ~4 days
                </span>
              </div>
              <p className="text-xs text-slate-400">Current stock: 1.2 kg · Preferred pack: 5 kg bag</p>
              <div className="text-xs text-slate-300 bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
                <strong className="text-violet-400 block">Explanation:</strong> Co-purchased with Whole Wheat Flour during monthly restock.
              </div>
            </div>
          </div>

          {/* Contextual Intelligence Recommendations */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Contextual Intelligence</h3>
            {actionCards.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl border border-white/10 bg-[#121722] p-4 flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{card.title}</span>
                    <span className="text-[10px] text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-full font-bold border border-violet-500/30">
                      Priority {card.priority}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{card.message}</p>
                </div>
                <button
                  onClick={() => handleDismissCard(card.id)}
                  className="rounded-xl border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all"
                >
                  Dismiss
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Compact Shopping Plan Summary & Budget */}
        <div className="space-y-5 lg:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-[#121722] p-5 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                <ShoppingCart className="h-4.5 w-4.5 text-violet-400" />
                Active Shopping Plan
              </h2>
              <span className="rounded-full bg-violet-500/20 border border-violet-500/30 px-2 py-0.5 text-[10px] font-bold text-violet-300">
                {planOverview?.status || 'READY FOR REVIEW'}
              </span>
            </div>

            <div className="space-y-2 border-y border-white/5 py-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Items in Plan</span>
                <span className="font-bold text-white">{planOverview?.itemCount || 8} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Total</span>
                <span className="font-bold text-white">{formatCurrency(planOverview?.totalEstimate || 1850)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Budget Left</span>
                <span className="font-bold text-emerald-400">{formatCurrency(budget?.remaining || 6150)}</span>
              </div>
            </div>

            <Link
              href="/shopping-plan"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-violet-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500 transition-all"
            >
              Open Shopping Plan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Context Signals & Weather */}
          <div className="rounded-2xl border border-white/10 bg-[#121722] p-5 space-y-3 shadow-md">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-violet-400" /> Context Signals & Weather
            </h3>
            <div className="rounded-xl bg-white/[0.03] p-3.5 text-xs space-y-1 border border-white/5">
              <div className="flex justify-between text-white font-bold">
                <span>{weather?.reasoning || 'Monsoon Rain Forecast'}</span>
                <span className="text-amber-400">{weather?.suggestedTimeSlot || '8-10 AM'}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Rain expected tomorrow morning. Quick-commerce delivery (Blinkit / Zepto) recommended.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
