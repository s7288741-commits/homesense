'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Settings, DollarSign, Server, Database, RefreshCw, Shield, Info, CheckCircle } from 'lucide-react';
import { mockHousehold } from '@/data/mock/household.mock';
import { formatCurrency } from '@/lib/utils';

export default function SettingsPage() {
  const [budgetLimit, setBudgetLimit] = useState<number>(mockHousehold.monthlyBudget);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & System Status"
        subtitle="Manage household parameters, budgets, and view integration modes"
        icon={Settings}
      />

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-300">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Settings saved successfully!
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column — Household Settings */}
        <div className="space-y-6 lg:col-span-7">
          <form onSubmit={handleSave} className="rounded-2xl border border-white/10 bg-[#12121a] p-5 shadow-lg space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <DollarSign className="h-4 w-4 text-violet-400" />
              Household Budget & Preferences
            </h2>

            <div>
              <label className="mb-1 block text-xs text-white/50">Household Name</label>
              <input
                type="text"
                disabled
                value={mockHousehold.name}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-white/50">Monthly Replenishment Budget (₹)</label>
              <input
                type="number"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-white/40">
                Current spending target: {formatCurrency(budgetLimit)} per month
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="text-xs font-medium text-white">Smart Reminders & Alerts</span>
                <p className="text-[11px] text-white/40">Notify when items reach critical stock levels</p>
              </div>
              <input
                type="checkbox"
                checked={notificationEnabled}
                onChange={(e) => setNotificationEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-medium text-white shadow-md shadow-violet-600/20 hover:bg-violet-500 transition-all"
              >
                Save Preferences
              </button>
            </div>
          </form>

          {/* Members Card */}
          <div className="rounded-2xl border border-white/10 bg-[#12121a] p-5 shadow-lg space-y-3">
            <h2 className="text-sm font-semibold text-white">Household Members</h2>
            <div className="space-y-2">
              {mockHousehold.members.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3 text-xs">
                  <div>
                    <span className="font-medium text-white">{member.name}</span>
                    <span className="ml-2 text-[10px] text-white/40">({member.role})</span>
                  </div>
                  <span className="text-[11px] text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full">
                    {member.email}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Operational Feasibility & Architecture Audit */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-white/10 bg-[#12121a] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Server className="h-4 w-4 text-emerald-400" />
                Operational Status & Adapters
              </h2>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
                Standalone / Local
              </span>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              HomeSense runs entirely locally without requiring paid cloud infrastructure or external AWS services.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                <Database className="h-4 w-4 shrink-0 text-violet-400 mt-0.5" />
                <div>
                  <span className="font-medium text-white">Data Storage</span>
                  <p className="text-[11px] text-white/40">Local Client/Server State & JSON Seed Adapters</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                <RefreshCw className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <span className="font-medium text-white">Quick-Commerce API Adapter</span>
                  <p className="text-[11px] text-white/40">Simulated price comparison for Blinkit, Zepto, Instamart</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                <Shield className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <span className="font-medium text-white">Privacy & Security</span>
                  <p className="text-[11px] text-white/40">All household memory remains on local system</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-3 text-xs text-violet-200 flex items-start gap-2">
              <Info className="h-4 w-4 shrink-0 text-violet-400 mt-0.5" />
              <span>
                <strong>Hackathon Note:</strong> Real quick-commerce and AI LLM backends can be connected seamlessly by swapping `.env.local` API endpoints.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
