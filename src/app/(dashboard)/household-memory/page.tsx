'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  getConsumptionStats, getMonthlySpending,
  getBrandPreferences, getCoPurchaseRules,
  getForgottenPatterns, getAnomalies, getPlanHistory,
  recordBrandChoice, getConsumptionHistory,
} from '@/services/memory.service';
import {
  MonthlySpending, BrandPreference, CoPurchaseRule,
  ForgottenPattern, Anomaly, PlanHistoryEntry, ANOMALY_REASON_LABELS,
  ConsumptionStat, ItemConsumptionHistory,
} from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  Brain, DollarSign, Heart, Link2, AlertTriangle, ClipboardList,
  TrendingUp, RefreshCw, Sparkles, Check, ShoppingBag, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type FocusedTab = 'analytics' | 'trends' | 'preferences' | 'forgotten' | 'anomalies';

const TABS: { id: FocusedTab; label: string; icon: React.ElementType }[] = [
  { id: 'analytics', label: 'Household Analytics & Spending', icon: DollarSign },
  { id: 'trends', label: 'Item Consumption Trends', icon: TrendingUp },
  { id: 'preferences', label: 'Brand Preference Learning', icon: Heart },
  { id: 'forgotten', label: 'Frequently Purchased & Forgotten', icon: Link2 },
  { id: 'anomalies', label: 'Anomalies & Plan History', icon: AlertTriangle },
];

export default function HouseholdMemoryPage() {
  const [activeTab, setActiveTab] = useState<FocusedTab>('analytics');
  const [isLoading, setIsLoading] = useState(true);

  // Core Data State
  const [consumptionStats, setConsumptionStats] = useState<ConsumptionStat[]>([]);
  const [consumptionHistory, setConsumptionHistory] = useState<ItemConsumptionHistory[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string>('inv-001');

  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending[]>([]);
  const [brandPrefs, setBrandPrefs] = useState<BrandPreference[]>([]);
  const [coPurchaseRules, setCoPurchaseRules] = useState<CoPurchaseRule[]>([]);
  const [forgottenPatterns, setForgottenPatterns] = useState<ForgottenPattern[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [planHistory, setPlanHistory] = useState<PlanHistoryEntry[]>([]);

  // Brand Preference Simulator State
  const [simItem, setSimItem] = useState('Detergent');
  const [simBrand, setSimBrand] = useState('Surf Excel');
  const [simMember, setSimMember] = useState('Mom');
  const [simSuccessMsg, setSimSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadMemoryData() {
      setIsLoading(true);
      try {
        const [cs, ch, ms, bp, cpr, fp, an, ph] = await Promise.all([
          getConsumptionStats(),
          getConsumptionHistory(),
          getMonthlySpending(),
          getBrandPreferences(),
          getCoPurchaseRules(),
          getForgottenPatterns(),
          getAnomalies(),
          getPlanHistory(),
        ]);
        setConsumptionStats(cs);
        setConsumptionHistory(ch);
        setMonthlySpending(ms);
        setBrandPrefs(bp);
        setCoPurchaseRules(cpr);
        setForgottenPatterns(fp);
        setAnomalies(an);
        setPlanHistory(ph);
      } finally {
        setIsLoading(false);
      }
    }
    loadMemoryData();
  }, []);

  const handleSimulatePreference = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPref = await recordBrandChoice(simItem, simBrand, simMember);
    const freshPrefs = await getBrandPreferences();
    setBrandPrefs(freshPrefs);
    setSimSuccessMsg(
      `Preference Learned! System updated baseline for ${updatedPref.itemName} to "${updatedPref.preferredBrand}" chosen by ${simMember} (Confidence ${(updatedPref.confidence * 100).toFixed(0)}%).`
    );
    setTimeout(() => setSimSuccessMsg(null), 4000);
  };

  // Spending Chart
  const chartData = {
    labels: monthlySpending.map((m) => m.month.split(' ')[0]),
    datasets: [
      {
        label: 'Spent (₹)',
        data: monthlySpending.map((m) => m.totalSpent),
        backgroundColor: 'rgba(124, 58, 237, 0.5)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
      {
        label: 'Budget Target (₹)',
        data: monthlySpending.map((m) => m.budget),
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  // Selected item trend history
  const activeHistory = consumptionHistory.find((h) => h.itemId === selectedItemId) || consumptionHistory[0];
  const activeStat = consumptionStats.find((s) => s.itemId === selectedItemId) || consumptionStats[0];

  const trendChartData = activeHistory ? {
    labels: activeHistory.dataPoints.map((dp) => dp.month),
    datasets: [
      {
        label: 'Days Per Cycle',
        data: activeHistory.dataPoints.map((dp) => dp.durationDays),
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  } : null;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Household Analytics & Intelligence Memory"
        subtitle="Long-term consumption trends, shopping frequency, learned brand choices, and spending insights"
        icon={Brain}
      />

      {/* Tabs */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading Household Analytics...</div>
      ) : (
        <div>
          {/* Tab 1: Household Analytics & Spending */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics KPI Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-[#121722] p-4 space-y-1 shadow-md">
                  <span className="text-xs font-semibold text-slate-400">Shopping Frequency</span>
                  <div className="text-2xl font-bold text-white">4.2 <span className="text-xs font-normal text-slate-400">trips/month</span></div>
                  <p className="text-[11px] text-emerald-400 font-semibold">Average interval: 7.1 days</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#121722] p-4 space-y-1 shadow-md">
                  <span className="text-xs font-semibold text-slate-400">Avg Basket Spend</span>
                  <div className="text-2xl font-bold text-white">{formatCurrency(875)}</div>
                  <p className="text-[11px] text-slate-400">12 items per replenishment</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#121722] p-4 space-y-1 shadow-md">
                  <span className="text-xs font-semibold text-slate-400">Monthly Budget Target</span>
                  <div className="text-2xl font-bold text-white">{formatCurrency(5000)}</div>
                  <p className="text-[11px] text-emerald-400 font-semibold">{formatCurrency(1320)} within target</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#121722] p-4 space-y-1 shadow-md">
                  <span className="text-xs font-semibold text-slate-400">Learned Brand Loyalty</span>
                  <div className="text-2xl font-bold text-violet-400">92%</div>
                  <p className="text-[11px] text-slate-400">6 items with learned defaults</p>
                </div>
              </div>

              {/* Monthly Spending vs Budget Chart */}
              <div className="rounded-2xl border border-white/10 bg-[#121722] p-5 space-y-4 shadow-md">
                <h2 className="text-sm font-bold text-white">Monthly Household Spending vs Target Compliance</h2>
                <div className="h-64 w-full">
                  <Bar
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { labels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 11 } } } },
                      scales: {
                        x: { ticks: { color: 'rgba(255, 255, 255, 0.5)' }, grid: { display: false } },
                        y: { ticks: { color: 'rgba(255, 255, 255, 0.5)' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Item Consumption Trends */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#121722] p-5 space-y-4 shadow-md">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white">Item-Specific Consumption Trends</h2>
                    <p className="text-xs text-slate-400">Select any item to inspect historical duration and consumption velocity</p>
                  </div>

                  {/* Item Selector */}
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#181E2A] px-3.5 py-2 text-xs font-semibold text-white focus:border-violet-500 focus:outline-none"
                  >
                    {consumptionStats.map((stat) => (
                      <option key={stat.itemId} value={stat.itemId}>
                        {stat.itemName} ({stat.unit})
                      </option>
                    ))}
                  </select>
                </div>

                {activeStat && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 bg-white/[0.02] p-4 rounded-xl border border-white/5 text-xs">
                    <div>
                      <span className="text-slate-400 block">Avg Duration Per Cycle</span>
                      <strong className="text-white text-sm">{activeStat.avgDurationDays} days</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Consumption Velocity Shift</span>
                      <strong className={activeStat.trendPercentage > 0 ? 'text-amber-400 text-sm' : 'text-emerald-400 text-sm'}>
                        {activeStat.trendPercentage > 0 ? `+${activeStat.trendPercentage}% Increase` : `${activeStat.trendPercentage}% Decrease`}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Tracked Data Cycles</span>
                      <strong className="text-white text-sm">{activeStat.cycleCount} cycles</strong>
                    </div>
                  </div>
                )}

                {/* Trend Chart */}
                {trendChartData && (
                  <div className="h-60 w-full pt-2">
                    <Bar
                      data={trendChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { labels: { color: 'rgba(255, 255, 255, 0.7)' } } },
                        scales: {
                          x: { ticks: { color: 'rgba(255, 255, 255, 0.5)' }, grid: { display: false } },
                          y: { ticks: { color: 'rgba(255, 255, 255, 0.5)' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Brand Preference Learning Simulator */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Interactive Preference Learning Simulator Box */}
              <div className="rounded-2xl border border-violet-500/30 bg-[#161B28] p-5 shadow-lg space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  <h2 className="text-sm font-bold text-white">Brand Preference Learning Engine Simulator</h2>
                </div>
                <p className="text-xs text-slate-300">
                  Simulate Mom or family members choosing <strong>Brand B over Brand A</strong> repeatedly. The system automatically learns brand preferences and updates confidence.
                </p>

                {simSuccessMsg && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300 font-semibold flex items-center gap-2 animate-fade-in">
                    <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{simSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSimulatePreference} className="grid grid-cols-1 gap-3 sm:grid-cols-4 items-end">
                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-slate-300">Item Name</label>
                    <select
                      value={simItem}
                      onChange={(e) => setSimItem(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#121722] px-3 py-2 text-xs text-white focus:border-violet-500"
                    >
                      <option value="Detergent">Detergent</option>
                      <option value="Rice (Basmati)">Rice (Basmati)</option>
                      <option value="Cooking Oil">Cooking Oil</option>
                      <option value="Tea Powder">Tea Powder</option>
                      <option value="Shampoo">Shampoo</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-slate-300">Selected Brand (Brand B)</label>
                    <input
                      type="text"
                      required
                      value={simBrand}
                      onChange={(e) => setSimBrand(e.target.value)}
                      placeholder="e.g. Surf Excel Matic"
                      className="w-full rounded-xl border border-white/10 bg-[#121722] px-3 py-2 text-xs text-white focus:border-violet-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-semibold text-slate-300">Chosen By</label>
                    <select
                      value={simMember}
                      onChange={(e) => setSimMember(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#121722] px-3 py-2 text-xs text-white focus:border-violet-500"
                    >
                      <option value="Mom">Mom</option>
                      <option value="Dad">Dad</option>
                      <option value="Prakash">Prakash</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 shadow-md shadow-violet-600/20"
                  >
                    Record Brand Choice
                  </button>
                </form>
              </div>

              {/* Brand Loyalty List */}
              <div className="rounded-2xl border border-white/10 bg-[#121722] p-5 space-y-4 shadow-md">
                <h2 className="text-sm font-bold text-white">Learned Brand Loyalty & Confidence Scores</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {brandPrefs.map((bp) => (
                    <div key={`${bp.itemName}-${bp.preferredBrand}`} className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-white">{bp.itemName}</span>
                        <span className="text-violet-400">{bp.preferredBrand}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.round(bp.confidence * 100)}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Confidence: {Math.round(bp.confidence * 100)}%</span>
                        <span>{bp.timesChosen}/{bp.totalChoices} choices</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Frequently Purchased & Forgotten Items */}
          {activeTab === 'forgotten' && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Frequently Purchased */}
              <div className="rounded-2xl border border-white/10 bg-[#121722] p-5 space-y-3 shadow-md">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-emerald-400" /> Frequently Purchased Items
                </h2>
                <div className="space-y-2">
                  {consumptionStats.map((stat) => (
                    <div key={stat.itemId} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">{stat.itemName}</span>
                        <p className="text-[11px] text-slate-400">Every ~{stat.avgDurationDays} days ({stat.avgQuantityPerCycle} {stat.unit})</p>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full font-bold">
                        {stat.cycleCount} cycles
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequently Forgotten */}
              <div className="rounded-2xl border border-white/10 bg-[#121722] p-5 space-y-3 shadow-md">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-amber-400" /> Frequently Forgotten Items
                </h2>
                <div className="space-y-2">
                  {forgottenPatterns.map((p) => (
                    <div key={p.itemName} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white">{p.itemName}</span>
                        <p className="text-[11px] text-slate-400">Forgotten in {p.forgottenPercentage}% of shopping cycles</p>
                      </div>
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full font-bold">
                        Forgotten {p.timesForgotten}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Anomalies & Plan History */}
          {activeTab === 'anomalies' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#121722] p-5 space-y-3 shadow-md">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" /> Detected Consumption Anomalies
                </h2>
                <div className="space-y-2">
                  {anomalies.map((a) => (
                    <div key={a.id} className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-amber-200">
                        <span>{a.itemName}</span>
                        <span>{a.detectedAt.split('T')[0]}</span>
                      </div>
                      <p className="text-slate-300">
                        {a.reason ? ANOMALY_REASON_LABELS[a.reason] : 'Unexplained consumption spike'} {a.reasonDetail ? `(${a.reasonDetail})` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#121722] p-5 space-y-3 shadow-md">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-violet-400" /> Plan History Archive
                </h2>
                <div className="divide-y divide-white/5">
                  {planHistory.map((ph) => (
                    <div key={ph.id} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white">{ph.monthYear} Plan</span>
                        <p className="text-[10px] text-slate-400">{ph.itemCount} items · Target: {formatCurrency(ph.budgetTarget)}</p>
                      </div>
                      <span className="font-bold text-emerald-400">{formatCurrency(ph.totalSpent)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
