'use client';

import React, { useState, useEffect } from 'react';
import {
  getConsumptionStats, getMonthlySpending, getTopExpenses, getSpendingComparison,
  getBrandPreferences, getSubstitutionHistory, getCoPurchaseRules,
  getForgottenPatterns, getSkippedPatterns, getEvents, getEventImpacts,
  getAnomalies, getPlanHistory,
} from '@/services/memory.service';
import {
  ConsumptionStat, MonthlySpending, TopExpenseItem, SpendingComparison,
  BrandPreference, SubstitutionRecord, CoPurchaseRule, ForgottenPattern,
  SkippedPattern, HouseholdEvent, EventImpact, Anomaly, PlanHistoryEntry,
  EVENT_TYPE_CONFIG, ANOMALY_REASON_LABELS, AnomalyReason,
} from '@/types';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import {
  Brain, TrendingUp, TrendingDown, Minus, DollarSign, Heart,
  Link2, CalendarDays, AlertTriangle, ClipboardList, Plus, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

type MemoryTab = 'consumption' | 'spending' | 'preferences' | 'patterns' | 'events' | 'anomalies' | 'history';

const TABS: { id: MemoryTab; label: string; icon: React.ElementType }[] = [
  { id: 'consumption', label: 'Consumption', icon: TrendingUp },
  { id: 'spending', label: 'Spending', icon: DollarSign },
  { id: 'preferences', label: 'Preferences', icon: Heart },
  { id: 'patterns', label: 'Patterns', icon: Link2 },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle },
  { id: 'history', label: 'Plan History', icon: ClipboardList },
];

export default function HouseholdMemoryPage() {
  const [activeTab, setActiveTab] = useState<MemoryTab>('consumption');
  const [isLoading, setIsLoading] = useState(true);

  // All data states
  const [consumptionStats, setConsumptionStats] = useState<ConsumptionStat[]>([]);
  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending[]>([]);
  const [topExpenses, setTopExpenses] = useState<TopExpenseItem[]>([]);
  const [spendingComp, setSpendingComp] = useState<SpendingComparison | null>(null);
  const [brandPrefs, setBrandPrefs] = useState<BrandPreference[]>([]);
  const [subRecords, setSubRecords] = useState<SubstitutionRecord[]>([]);
  const [coPurchaseRules, setCoPurchaseRules] = useState<CoPurchaseRule[]>([]);
  const [forgottenPatterns, setForgottenPatterns] = useState<ForgottenPattern[]>([]);
  const [skippedPatterns, setSkippedPatterns] = useState<SkippedPattern[]>([]);
  const [events, setEvents] = useState<HouseholdEvent[]>([]);
  const [eventImpacts, setEventImpacts] = useState<EventImpact[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [planHistory, setPlanHistory] = useState<PlanHistoryEntry[]>([]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [cs, ms, te, sc, bp, sr, cpr, fp, sp, ev, ei, an, ph] = await Promise.all([
          getConsumptionStats(), getMonthlySpending(), getTopExpenses(), getSpendingComparison(),
          getBrandPreferences(), getSubstitutionHistory(), getCoPurchaseRules(),
          getForgottenPatterns(), getSkippedPatterns(), getEvents(), getEventImpacts(),
          getAnomalies(), getPlanHistory(),
        ]);
        setConsumptionStats(cs); setMonthlySpending(ms); setTopExpenses(te); setSpendingComp(sc);
        setBrandPrefs(bp); setSubRecords(sr); setCoPurchaseRules(cpr);
        setForgottenPatterns(fp); setSkippedPatterns(sp); setEvents(ev); setEventImpacts(ei);
        setAnomalies(an); setPlanHistory(ph);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'INCREASING') return <ArrowUpRight className="h-3.5 w-3.5 text-red-400" />;
    if (trend === 'DECREASING') return <ArrowDownRight className="h-3.5 w-3.5 text-emerald-400" />;
    return <Minus className="h-3.5 w-3.5 text-white/30" />;
  };

  // ── Chart configs ──
  const spendingChartData = {
    labels: monthlySpending.map((m) => m.month.split(' ')[0]),
    datasets: [{
      label: 'Spent',
      data: monthlySpending.map((m) => m.totalSpent),
      backgroundColor: monthlySpending.map((m) => m.withinBudget ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'),
      borderColor: monthlySpending.map((m) => m.withinBudget ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'),
      borderWidth: 1,
      borderRadius: 6,
    }, {
      label: 'Budget',
      data: monthlySpending.map((m) => m.budget),
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const spendingChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255,255,255,0.03)' }, ticks: { color: 'rgba(255,255,255,0.3)', font: { size: 10 }, callback: (v: string | number) => `₹${v}` } },
    },
  };

  const latestMonth = monthlySpending[monthlySpending.length - 1];
  const categoryChartData = latestMonth ? {
    labels: latestMonth.categoryBreakdown.map((c) => c.category),
    datasets: [{
      data: latestMonth.categoryBreakdown.map((c) => c.amount),
      backgroundColor: latestMonth.categoryBreakdown.map((c) => c.color),
      borderColor: 'transparent',
      borderWidth: 0,
      spacing: 2,
      borderRadius: 4,
    }],
  } : null;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-violet-400" />
          <h1 className="text-xl font-bold text-white">Household Memory</h1>
        </div>
        <p className="mt-1 text-sm text-white/40">
          What HomeSense has learned about your household
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl bg-white/[0.02] p-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-white/30 hover:text-white/50'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* ── Consumption Tab ── */}
          {activeTab === 'consumption' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {consumptionStats.map((stat) => (
                  <div key={stat.itemId} className="glass-card rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white/80">{stat.itemName}</h3>
                      <div className="flex items-center gap-1">
                        <TrendIcon trend={stat.trend} />
                        <span className={cn('text-[10px] font-medium',
                          stat.trend === 'INCREASING' ? 'text-red-400' :
                          stat.trend === 'DECREASING' ? 'text-emerald-400' : 'text-white/30'
                        )}>
                          {stat.trendPercentage > 0 ? '+' : ''}{stat.trendPercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-[11px] text-white/30">Avg Duration</span>
                        <span className="text-[11px] text-white/60">{stat.avgDurationDays} days ({stat.durationRange.min}-{stat.durationRange.max})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[11px] text-white/30">Avg Quantity</span>
                        <span className="text-[11px] text-white/60">{stat.avgQuantityPerCycle} {stat.unit}/cycle</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[11px] text-white/30">Data Points</span>
                        <span className="text-[11px] text-white/40">{stat.cycleCount} cycles</span>
                      </div>
                    </div>
                    <div className={cn(
                      'mt-2 rounded-lg px-3 py-1.5 text-center text-[10px] font-medium',
                      stat.trend === 'STABLE' ? 'bg-emerald-500/[0.06] text-emerald-400' :
                      stat.trend === 'INCREASING' ? 'bg-red-500/[0.06] text-red-400' :
                      'bg-blue-500/[0.06] text-blue-400'
                    )}>
                      {stat.trend === 'STABLE' ? '━━━ Stable' :
                       stat.trend === 'INCREASING' ? '↑ Increasing' : '↓ Decreasing'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Spending Tab ── */}
          {activeTab === 'spending' && (
            <div className="space-y-4">
              {/* Month over month comparison */}
              {spendingComp && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass-card rounded-2xl p-4 text-center">
                    <span className="text-[10px] text-white/30">This Month</span>
                    <p className="text-lg font-bold text-white">{formatCurrency(spendingComp.currentMonth)}</p>
                  </div>
                  <div className="glass-card rounded-2xl p-4 text-center">
                    <span className="text-[10px] text-white/30">Last Month</span>
                    <p className="text-lg font-bold text-white/50">{formatCurrency(spendingComp.previousMonth)}</p>
                  </div>
                  <div className="glass-card rounded-2xl p-4 text-center">
                    <span className="text-[10px] text-white/30">Change</span>
                    <p className={cn('text-lg font-bold', spendingComp.difference < 0 ? 'text-emerald-400' : 'text-red-400')}>
                      {spendingComp.difference < 0 ? '' : '+'}{formatCurrency(Math.abs(spendingComp.difference))}
                    </p>
                    <span className={cn('text-[10px]', spendingComp.percentChange < 0 ? 'text-emerald-400' : 'text-red-400')}>
                      {spendingComp.percentChange > 0 ? '+' : ''}{spendingComp.percentChange.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Charts */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="glass-card rounded-2xl p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white">Monthly Spending Trend</h3>
                  <div className="h-48">
                    <Bar data={spendingChartData} options={spendingChartOptions} />
                  </div>
                </div>
                {categoryChartData && (
                  <div className="glass-card rounded-2xl p-4">
                    <h3 className="mb-3 text-sm font-semibold text-white">Category Distribution</h3>
                    <div className="flex items-center gap-4">
                      <div className="relative h-[120px] w-[120px]">
                        <Doughnut data={categoryChartData} options={{ responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }} />
                      </div>
                      <div className="flex-1 space-y-2">
                        {latestMonth.categoryBreakdown.map((cat) => (
                          <div key={cat.category} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                              <span className="text-[11px] text-white/50">{cat.category}</span>
                            </div>
                            <span className="text-[11px] font-medium text-white/60">{formatCurrency(cat.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Top Expenses */}
              <div className="glass-card rounded-2xl p-4">
                <h3 className="mb-3 text-sm font-semibold text-white">Top Expenses</h3>
                <div className="space-y-2">
                  {topExpenses.map((te, i) => (
                    <div key={te.itemName} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.04] text-[10px] font-bold text-white/30">{i + 1}</span>
                        <div>
                          <span className="text-xs font-medium text-white/70">{te.itemName}</span>
                          <p className="text-[10px] text-white/30">{te.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium text-white/60">{formatCurrency(te.costPerCycle)}/cycle</span>
                        <p className="text-[10px] text-white/25">~{formatCurrency(te.estimatedYearlyCost)}/yr</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Preferences Tab ── */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-4">
                <h3 className="mb-3 text-sm font-semibold text-white">Brand Preferences</h3>
                <div className="space-y-2">
                  {brandPrefs.map((bp) => (
                    <div key={bp.itemName} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-4 py-3">
                      <div>
                        <span className="text-xs font-medium text-white/70">{bp.itemName}</span>
                        <p className="text-[11px] text-white/40">→ {bp.preferredBrand} (chosen {bp.timesChosen}/{bp.totalChoices} times)</p>
                        {bp.previousBrand && (
                          <p className="text-[10px] text-violet-400/60">Switched from {bp.previousBrand}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-white/[0.06]">
                          <div
                            className="h-full rounded-full bg-violet-500"
                            style={{ width: `${bp.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-white/30">{Math.round(bp.confidence * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {subRecords.length > 0 && (
                <div className="glass-card rounded-2xl p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white">Substitution History</h3>
                  <div className="space-y-2">
                    {subRecords.map((sr) => (
                      <div key={sr.id} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-4 py-2">
                        <div>
                          <span className="text-xs text-white/60">{sr.itemName}: {sr.originalBrand} → {sr.substitutedBrand}</span>
                          <p className="text-[10px] text-white/25">{sr.timesSubstituted}x · {formatDate(sr.date)}</p>
                        </div>
                        {sr.isNowDefault && (
                          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">Now Default</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Patterns Tab ── */}
          {activeTab === 'patterns' && (
            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-4">
                <h3 className="mb-3 text-sm font-semibold text-white">Usually Bought Together</h3>
                <div className="space-y-3">
                  {coPurchaseRules.map((rule) => (
                    <div key={rule.primaryItem} className="rounded-lg bg-white/[0.02] px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-white/70">{rule.primaryItem}</span>
                        <span className="text-white/20">→</span>
                        <div className="flex gap-1">
                          {rule.associatedItems.map((ai) => (
                            <span key={ai} className="rounded-md bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-400">{ai}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1 flex-1 rounded-full bg-white/[0.06]">
                          <div className="h-full rounded-full bg-blue-500/50" style={{ width: `${rule.strength * 100}%` }} />
                        </div>
                        <span className="text-[10px] text-white/25">{Math.round(rule.strength * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="glass-card rounded-2xl p-4">
                  <h3 className="mb-3 text-sm font-semibold text-amber-400">Frequently Forgotten</h3>
                  <div className="space-y-2">
                    {forgottenPatterns.map((fp, i) => (
                      <div key={fp.itemName} className="flex items-center justify-between rounded-lg bg-amber-500/[0.04] px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-amber-400/40">{i + 1}</span>
                          <span className="text-xs text-white/70">{fp.itemName}</span>
                        </div>
                        <span className="text-[11px] text-amber-400">Forgot {fp.forgottenPercentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-2xl p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white/40">Frequently Skipped</h3>
                  <div className="space-y-2">
                    {skippedPatterns.map((sp) => (
                      <div key={sp.itemName} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
                        <div>
                          <span className="text-xs text-white/50">{sp.itemName}</span>
                          <p className="text-[10px] text-white/20">Skipped {sp.timesSkipped}/{sp.timesSuggested}</p>
                        </div>
                        {sp.isAutoSuppressed && (
                          <span className="text-[10px] text-white/20">Auto-suppressed</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Events Tab ── */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">Upcoming Events</h3>
                <button className="flex items-center gap-1.5 rounded-xl bg-violet-500/10 px-3 py-1.5 text-xs text-violet-300 hover:bg-violet-500/15">
                  <Plus className="h-3.5 w-3.5" /> Add Event
                </button>
              </div>
              {events.filter((e) => e.isUpcoming).map((evt) => {
                const tc = EVENT_TYPE_CONFIG[evt.type];
                return (
                  <div key={evt.id} className="glass-card rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{tc.icon}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-white/80">{evt.name}</h4>
                        <p className="text-[11px] text-white/30">{formatDate(evt.startDate)} – {formatDate(evt.endDate)} · {evt.guestCount} guests</p>
                      </div>
                    </div>
                    {evt.additionalItems.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <span className="text-[10px] text-white/30">Additional items suggested:</span>
                        {evt.additionalItems.map((ai) => (
                          <div key={ai.itemName} className="flex items-center justify-between rounded-lg bg-purple-500/[0.04] px-3 py-1.5">
                            <span className="text-xs text-white/60">{ai.itemName} +{ai.additionalQuantity} {ai.unit}</span>
                            <span className="text-[10px] text-white/25">{ai.reason}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {eventImpacts.length > 0 && (
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-white/40">Past Event Impact</h3>
                  {eventImpacts.map((ei) => (
                    <div key={ei.eventId} className="glass-card mb-2 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-white/60">{ei.eventName}</span>
                        <span className="text-[10px] text-white/25">{formatDate(ei.date)}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {ei.impactByCategory.map((ic) => (
                          <span key={ic.category} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/40">
                            {ic.category}: +{ic.percentageIncrease}%
                          </span>
                        ))}
                      </div>
                      <p className="mt-1 text-[10px] text-red-400/60">Budget impact: +{formatCurrency(ei.budgetImpact)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Anomalies Tab ── */}
          {activeTab === 'anomalies' && (
            <div className="space-y-3">
              {anomalies.map((anom) => (
                <div key={anom.id} className={cn(
                  'glass-card rounded-2xl p-4',
                  anom.action === 'PENDING' && 'border-amber-500/20'
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={cn('h-4 w-4', anom.action === 'PENDING' ? 'text-amber-400' : 'text-white/20')} />
                      <span className="text-sm font-medium text-white/80">{anom.itemName}</span>
                    </div>
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium',
                      anom.action === 'ISOLATED' ? 'bg-blue-500/10 text-blue-400' :
                      anom.action === 'INCORPORATED' ? 'bg-emerald-500/10 text-emerald-400' :
                      'bg-amber-500/10 text-amber-400'
                    )}>
                      {anom.action === 'ISOLATED' ? 'Isolated ✅' : anom.action === 'INCORPORATED' ? 'Incorporated ✅' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-[11px]">
                    <span className="text-white/30">Normal: {anom.normalDurationDays} days</span>
                    <span className="text-white/30">Actual: {anom.actualDurationDays} days</span>
                    <span className="text-red-400/60">{Math.round((1 - anom.actualDurationDays / anom.normalDurationDays) * 100)}% faster</span>
                  </div>
                  {anom.reason && (
                    <p className="mt-1 text-[11px] text-white/40">Reason: {ANOMALY_REASON_LABELS[anom.reason]}</p>
                  )}
                  {anom.action === 'PENDING' && (
                    <div className="mt-3 grid grid-cols-3 gap-1.5">
                      {Object.entries(ANOMALY_REASON_LABELS).slice(0, 6).map(([key, label]) => (
                        <button key={key} className="rounded-lg bg-white/[0.04] px-2 py-1.5 text-[10px] text-white/40 transition-all hover:bg-white/[0.08] hover:text-white/60">
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Plan History Tab ── */}
          {activeTab === 'history' && (
            <div className="glass-card overflow-hidden rounded-2xl">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase">Month</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase">Items</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase">Total Spent</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase">Budget</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {planHistory.map((ph) => (
                    <tr key={ph.id} className="border-b border-white/[0.03] transition-all hover:bg-white/[0.02] cursor-pointer">
                      <td className="px-4 py-3 text-sm font-medium text-white/70">{ph.monthYear}</td>
                      <td className="px-4 py-3 text-xs text-white/50">{ph.itemCount} items</td>
                      <td className="px-4 py-3 text-xs text-white/60">{formatCurrency(ph.totalSpent)}</td>
                      <td className="px-4 py-3">
                        <span className={cn('text-xs font-medium', ph.withinBudget ? 'text-emerald-400' : 'text-red-400')}>
                          {ph.withinBudget ? '✅' : `❌ +${formatCurrency(ph.totalSpent - ph.budgetTarget)}`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium',
                          ph.status === 'ACTIVE' ? 'bg-violet-500/10 text-violet-400' : 'bg-white/[0.04] text-white/30'
                        )}>
                          {ph.status === 'ACTIVE' ? 'Active' : 'Complete'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
