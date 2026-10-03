'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  getMonthlySpending,
  getBrandPreferences, getCoPurchaseRules,
  getForgottenPatterns, getAnomalies, getPlanHistory,
} from '@/services/memory.service';
import {
  MonthlySpending, BrandPreference, CoPurchaseRule,
  ForgottenPattern, Anomaly, PlanHistoryEntry, ANOMALY_REASON_LABELS,
} from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  Brain, DollarSign, Heart, Link2, AlertTriangle, ClipboardList,
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type FocusedTab = 'spending' | 'patterns' | 'preferences' | 'anomalies';

const TABS: { id: FocusedTab; label: string; icon: React.ElementType }[] = [
  { id: 'spending', label: 'Spending & Budget', icon: DollarSign },
  { id: 'patterns', label: 'Forgotten Patterns', icon: Link2 },
  { id: 'preferences', label: 'Brand Preferences', icon: Heart },
  { id: 'anomalies', label: 'Anomalies & History', icon: AlertTriangle },
];

export default function HouseholdMemoryPage() {
  const [activeTab, setActiveTab] = useState<FocusedTab>('spending');
  const [isLoading, setIsLoading] = useState(true);

  const [monthlySpending, setMonthlySpending] = useState<MonthlySpending[]>([]);
  const [brandPrefs, setBrandPrefs] = useState<BrandPreference[]>([]);
  const [coPurchaseRules, setCoPurchaseRules] = useState<CoPurchaseRule[]>([]);
  const [forgottenPatterns, setForgottenPatterns] = useState<ForgottenPattern[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [planHistory, setPlanHistory] = useState<PlanHistoryEntry[]>([]);

  useEffect(() => {
    async function loadMemoryData() {
      setIsLoading(true);
      try {
        const [ms, bp, cpr, fp, an, ph] = await Promise.all([
          getMonthlySpending(),
          getBrandPreferences(),
          getCoPurchaseRules(),
          getForgottenPatterns(),
          getAnomalies(),
          getPlanHistory(),
        ]);
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

  const chartData = {
    labels: monthlySpending.map((m) => m.month.split(' ')[0]),
    datasets: [
      {
        label: 'Spent (₹)',
        data: monthlySpending.map((m) => m.totalSpent),
        backgroundColor: 'rgba(139, 92, 246, 0.4)',
        borderColor: 'rgba(139, 92, 246, 1)',
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Household Memory & Learning Insights"
        subtitle="Long-term consumption patterns, brand loyalty, and spending intelligence"
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
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-white/40">Loading Household Memory Insights...</div>
      ) : (
        <div>
          {/* Tab 1: Spending & Budget */}
          {activeTab === 'spending' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#12121a] p-5 space-y-4">
                <h2 className="text-sm font-semibold text-white">Monthly Spending vs Budget Compliance</h2>
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

          {/* Tab 2: Forgotten Patterns */}
          {activeTab === 'patterns' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-[#12121a] p-5 space-y-3">
                <h2 className="text-sm font-semibold text-white">Frequently Forgotten Items</h2>
                <div className="space-y-2">
                  {forgottenPatterns.map((p) => (
                    <div key={p.itemName} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-white">{p.itemName}</span>
                        <p className="text-[11px] text-white/40">Forgotten in {p.forgottenPercentage}% of cycles</p>
                      </div>
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">
                        Forgotten {p.timesForgotten}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#12121a] p-5 space-y-3">
                <h2 className="text-sm font-semibold text-white">Co-Purchase Rules</h2>
                <div className="space-y-2">
                  {coPurchaseRules.map((rule) => (
                    <div key={rule.primaryItem} className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-white">{rule.primaryItem} ➔ {rule.associatedItems.join(', ')}</span>
                        <p className="text-[11px] text-white/40">Purchased together habitually</p>
                      </div>
                      <span className="text-[10px] text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full font-bold">
                        {Math.round(rule.strength * 100)}% Rule
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Brand Preferences */}
          {activeTab === 'preferences' && (
            <div className="rounded-2xl border border-white/10 bg-[#12121a] p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white">Learned Brand Loyalty & Confidence</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {brandPrefs.map((bp) => (
                  <div key={`${bp.itemName}-${bp.preferredBrand}`} className="rounded-xl border border-white/5 bg-white/[0.02] p-3.5 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white">{bp.itemName}</span>
                      <span className="text-violet-400">{bp.preferredBrand}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-violet-500" style={{ width: `${Math.round(bp.confidence * 100)}%` }} />
                    </div>
                    <p className="text-[10px] text-white/40">Confidence Score: {Math.round(bp.confidence * 100)}% ({bp.timesChosen}/{bp.totalChoices} choices)</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Anomalies & History */}
          {activeTab === 'anomalies' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-[#12121a] p-5 space-y-3">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" /> Detected Consumption Anomalies
                </h2>
                <div className="space-y-2">
                  {anomalies.map((a) => (
                    <div key={a.id} className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-amber-200">
                        <span>{a.itemName}</span>
                        <span>{a.detectedAt.split('T')[0]}</span>
                      </div>
                      <p className="text-white/70">
                        {a.reason ? ANOMALY_REASON_LABELS[a.reason] : 'Unexplained consumption spike'} {a.reasonDetail ? `(${a.reasonDetail})` : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#12121a] p-5 space-y-3">
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-violet-400" /> Plan History Archive
                </h2>
                <div className="divide-y divide-white/5">
                  {planHistory.map((ph) => (
                    <div key={ph.id} className="py-2.5 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-white">{ph.monthYear} Plan</span>
                        <p className="text-[10px] text-white/40">{ph.itemCount} items · Target: {formatCurrency(ph.budgetTarget)}</p>
                      </div>
                      <span className="font-semibold text-emerald-400">{formatCurrency(ph.totalSpent)}</span>
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
