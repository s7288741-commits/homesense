'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Sparkles, AlertTriangle, ArrowRight, ShoppingCart,
  Calendar, ShieldAlert, Check, RefreshCw, X
} from 'lucide-react';
import { useHousehold } from '@/context/HouseholdContext';
import { formatCurrency } from '@/lib/utils';
import { ItemStatus } from '@/types';

export default function DashboardPage() {
  const {
    inventoryItems,
    shoppingPlan,
    budget,
    actionCards,
    autoPreparePlan,
    dismissActionCard,
    restockInventoryItem,
    addItemToPlan,
  } = useHousehold();

  const [bannerAdded, setBannerAdded] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleAutoPrepare = () => {
    autoPreparePlan();
    setBannerAdded(true);
  };

  const runningLowItems = inventoryItems.filter(
    (i) => i.status === ItemStatus.RUNNING_LOW || i.status === ItemStatus.UPCOMING
  );

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Page Header */}
      <PageHeader
        title="Household Overview"
        subtitle="Smart replenishment insights — track supplies, predict restocks, and order in one tap"
        icon={Sparkles}
      />

      {/* ── Decision Banner ── */}
      {!bannerDismissed && (
        <section className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-[#121722] p-6 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-400">
                  <AlertTriangle className="h-3 w-3" /> Urgent Restock Alert
                </span>
                <span className="text-xs text-slate-400">{mounted ? inventoryItems.length : 12} items tracked</span>
              </div>
              <h2 className="text-lg font-bold text-white">Cooking Oil & Basmati Rice Running Low</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Cooking oil will run out in ~2 days. Household usage increased by 15%. Rain expected tomorrow morning—ordering ahead is recommended.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 md:pt-0">
              {bannerAdded ? (
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-4 py-2.5 text-xs font-bold text-emerald-300 shadow-md">
                  <Check className="h-4 w-4" /> Added to Shopping Plan
                </span>
              ) : (
                <button
                  onClick={handleAutoPrepare}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500 transition-all cursor-pointer"
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
                className="p-2 text-slate-400 hover:text-white cursor-pointer"
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
              Running Low & Urgent Restocks ({runningLowItems.length})
            </h2>
            <Link href="/inventory" className="text-xs font-bold text-violet-400 hover:underline flex items-center gap-1">
              View All Inventory ({inventoryItems.length}) <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {runningLowItems.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 space-y-3 shadow-md border-l-4 ${
                  item.status === ItemStatus.RUNNING_LOW
                    ? 'border-red-500/30 border-l-red-500 bg-[#121722]'
                    : 'border-amber-500/30 border-l-amber-500 bg-[#121722]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">{item.name}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      item.status === ItemStatus.RUNNING_LOW
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    }`}
                  >
                    ~{item.remainingDaysMin || 2} days left
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Stock: {item.quantity} {item.unit} · Preferred brand: {item.preferredBrand || 'Standard'}
                </p>
                <div className="text-xs text-slate-300 bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1">
                  <strong className="text-amber-400 block">Why it&apos;s flagged:</strong> Used at ~0.2 {item.unit}/day based on your recent family usage.
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => restockInventoryItem(item.id, 2, item.unit)}
                    className="flex-1 rounded-xl bg-emerald-600/20 border border-emerald-500/30 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Restock Now
                  </button>
                  <button
                    onClick={() =>
                      addItemToPlan({
                        name: item.name,
                        brand: item.preferredBrand || undefined,
                        quantity: 1,
                        unit: item.unit,
                        unitPrice: item.typicalPrice || 180,
                        category: item.category,
                      })
                    }
                    className="flex-1 rounded-xl bg-violet-600/20 border border-violet-500/30 py-1.5 text-xs font-bold text-violet-300 hover:bg-violet-600 hover:text-white transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" /> Add to Plan
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Smart Recommendations & Alerts */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold tracking-wider text-slate-400 uppercase">Smart Recommendations & Alerts</h3>
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
                  onClick={() => dismissActionCard(card.id)}
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
                {shoppingPlan.status || 'READY FOR REVIEW'}
              </span>
            </div>

            <div className="space-y-2 border-y border-white/5 py-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Items in Plan</span>
                <span className="font-bold text-white">{shoppingPlan.items.length} items</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Total</span>
                <span className="font-bold text-white">{formatCurrency(shoppingPlan.totalEstimate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Budget Left</span>
                <span className="font-bold text-emerald-400">{formatCurrency(budget.remaining)}</span>
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
                <span>Monsoon Rain Forecast</span>
                <span className="text-amber-400">8-10 AM</span>
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
