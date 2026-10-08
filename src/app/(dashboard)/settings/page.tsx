'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Settings, DollarSign, Server, Database, RefreshCw, Shield, Info, CheckCircle, Plus } from 'lucide-react';
import { mockHousehold } from '@/data/mock/household.mock';
import { formatCurrency } from '@/lib/utils';
import { useHousehold } from '@/context/HouseholdContext';
import { MemberRole } from '@/types';

export default function SettingsPage() {
  const { budget, updateBudget, addToast } = useHousehold();

  const [budgetLimit, setBudgetLimit] = useState<number>(budget.monthlyTarget);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [members, setMembers] = useState(mockHousehold.members);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('Family Member');
  const [memberEmail, setMemberEmail] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBudget(budgetLimit);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    const newMember = {
      id: `m-${Date.now()}`,
      name: memberName.trim(),
      role: MemberRole.MEMBER,
      email: memberEmail.trim() || `${memberName.toLowerCase()}@household.com`,
      joinedAt: new Date().toISOString(),
    };

    setMembers((prev) => [...prev, newMember]);
    setMemberName('');
    setMemberEmail('');
    setShowAddMember(false);
    addToast(`Added member "${newMember.name}" to Household!`, 'success');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & System Status"
        subtitle="Manage household parameters, budgets, and view integration modes"
        icon={Settings}
      />

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-300 animate-fade-in">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Settings saved successfully! Budget updated across system.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column — Household Settings */}
        <div className="space-y-6 lg:col-span-7">
          <form onSubmit={handleSave} className="rounded-2xl border border-white/10 bg-[#121722] p-5 shadow-lg space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white">
              <DollarSign className="h-4 w-4 text-violet-400" />
              Household Budget & Preferences
            </h2>

            <div>
              <label className="mb-1 block text-xs text-slate-400 font-semibold">Household Name</label>
              <input
                type="text"
                disabled
                value={mockHousehold.name}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-400 font-semibold">Monthly Replenishment Budget (₹)</label>
              <input
                type="number"
                required
                min="500"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-[#181E2A] px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none font-bold text-sm"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Current spending target: {formatCurrency(budgetLimit)} per month · {formatCurrency(budget.spentThisMonth)} already spent
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <span className="text-xs font-bold text-white">Smart Reminders & Alerts</span>
                <p className="text-[11px] text-slate-400">Notify when items reach critical stock levels</p>
              </div>
              <input
                type="checkbox"
                checked={notificationEnabled}
                onChange={(e) => setNotificationEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-600/20 hover:bg-violet-500 transition-all"
              >
                Save Preferences
              </button>
            </div>
          </form>

          {/* Members Card */}
          <div className="rounded-2xl border border-white/10 bg-[#121722] p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Household Members ({members.length})</h2>
              <button
                onClick={() => setShowAddMember(!showAddMember)}
                className="rounded-xl bg-violet-600/20 border border-violet-500/30 px-3 py-1.5 text-xs font-bold text-violet-300 hover:bg-violet-600 hover:text-white transition-all flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" /> Add Member
              </button>
            </div>

            {showAddMember && (
              <form onSubmit={handleAddMember} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Member Name (e.g. Priya)"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#121722] px-3 py-1.5 text-white"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Role (e.g. Sister)"
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#121722] px-3 py-1.5 text-white"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#121722] px-3 py-1.5 text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddMember(false)}
                    className="px-3 py-1 text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-violet-600 px-3.5 py-1 text-xs font-bold text-white"
                  >
                    Add
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-xl bg-white/[0.03] p-3 text-xs border border-white/5">
                  <div>
                    <span className="font-bold text-white">{member.name}</span>
                    <span className="ml-2 text-[10px] text-slate-400">({member.role})</span>
                  </div>
                  <span className="text-[11px] text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                    {member.email}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Operational Feasibility & Architecture Audit */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-white/10 bg-[#121722] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-bold text-white">
                <Server className="h-4 w-4 text-emerald-400" />
                Operational Status & Adapters
              </h2>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                Standalone / Local
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              HomeSense runs entirely locally without requiring paid cloud infrastructure or external AWS services.
            </p>

            <div className="space-y-2.5 pt-1">
              <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                <Database className="h-4 w-4 shrink-0 text-violet-400 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Data Storage</span>
                  <p className="text-[11px] text-slate-400">Local State & Browser Storage Adapters</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                <RefreshCw className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Quick-Commerce API Adapter</span>
                  <p className="text-[11px] text-slate-400">Simulated price comparison for Blinkit, Zepto, Instamart</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                <Shield className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Privacy & Security</span>
                  <p className="text-[11px] text-slate-400">All household memory remains on local system</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 p-3 text-xs text-violet-200 flex items-start gap-2">
              <Info className="h-4 w-4 shrink-0 text-violet-400 mt-0.5" />
              <span>
                <strong>Note:</strong> Real quick-commerce and AI LLM backends can be connected seamlessly by swapping `.env.local` API endpoints.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
