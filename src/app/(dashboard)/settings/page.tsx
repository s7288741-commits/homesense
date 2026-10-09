'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Settings,
  DollarSign,
  Server,
  Database,
  RefreshCw,
  Shield,
  Info,
  CheckCircle,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Building2,
  Users,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useHousehold } from '@/context/HouseholdContext';
import { MemberRole } from '@/types';

// Predefined, reliable role options for household management
export const HOUSEHOLD_ROLE_OPTIONS = [
  { value: MemberRole.ADMIN, label: 'Admin (Full Management & Approval)' },
  { value: MemberRole.MEMBER, label: 'Member (Can Edit Inventory & Plans)' },
  { value: 'SPOUSE', label: 'Spouse / Partner' },
  { value: 'PARENT', label: 'Parent / Head of Household' },
  { value: 'CHILD', label: 'Child / Dependent' },
  { value: 'ROOMMATE', label: 'Roommate' },
  { value: 'CARETAKER', label: 'Caretaker / Helper' },
  { value: MemberRole.VIEWER, label: 'Viewer (Read-only)' },
];

export default function SettingsPage() {
  const {
    householdName,
    householdMembers,
    updateHouseholdName,
    addMember,
    updateMember,
    deleteMember,
    budget,
    updateBudget,
    addToast,
  } = useHousehold();

  const [hNameInput, setHNameInput] = useState<string>(householdName);
  const [budgetLimit, setBudgetLimit] = useState<number>(budget.monthlyTarget);
  const [notificationEnabled, setNotificationEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Add Member State
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Member');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // Edit Member State
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    setHNameInput(householdName);
  }, [householdName]);

  useEffect(() => {
    setBudgetLimit(budget.monthlyTarget);
  }, [budget.monthlyTarget]);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    if (hNameInput.trim() && hNameInput !== householdName) {
      updateHouseholdName(hNameInput.trim());
    }
    updateBudget(budgetLimit);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    addMember({
      name: newMemberName.trim(),
      role: newMemberRole.trim() || MemberRole.MEMBER,
      email: newMemberEmail.trim(),
    });

    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberRole('Member');
    setShowAddMember(false);
  };

  const handleStartEdit = (member: { id: string; name: string; role: string; email: string }) => {
    setEditingMemberId(member.id);
    setEditName(member.name);
    setEditRole(member.role);
    setEditEmail(member.email);
  };

  const handleSaveEdit = (id: string) => {
    if (!editName.trim()) return;
    updateMember(id, {
      name: editName.trim(),
      role: editRole.trim() as MemberRole,
      email: editEmail.trim(),
    });
    setEditingMemberId(null);
  };

  const handleDeleteMemberClick = (id: string, name: string) => {
    if (householdMembers.length <= 1) {
      addToast('Cannot remove the only member in the household.', 'amber');
      return;
    }
    deleteMember(id);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & System Status"
        subtitle="Manage your household name, family member permissions, monthly budgets, and storage settings"
        icon={Settings}
      />

      {savedSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-300 animate-fade-in">
          <CheckCircle className="h-4 w-4 shrink-0" />
          Settings saved successfully! Household name & budget updated across system.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column — Household Settings */}
        <div className="space-y-6 lg:col-span-7">
          <form onSubmit={handleSavePreferences} className="rounded-2xl border border-white/10 bg-[#121722] p-5 shadow-lg space-y-4">
            <h2 className="flex items-center gap-2 text-sm font-bold text-white">
              <Building2 className="h-4 w-4 text-violet-400" />
              Household Details & Monthly Budget
            </h2>

            <div>
              <label className="mb-1 block text-xs text-slate-300 font-semibold flex items-center justify-between">
                <span>Household Name</span>
                <span className="text-[10px] text-violet-400 font-normal">Editable</span>
              </label>
              <input
                type="text"
                required
                value={hNameInput}
                onChange={(e) => setHNameInput(e.target.value)}
                placeholder="e.g. Marathe Household"
                className="w-full rounded-xl border border-white/10 bg-[#181E2A] px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none font-semibold transition-all"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-300 font-semibold">Monthly Replenishment Budget (₹)</label>
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
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-600/20 hover:bg-violet-500 transition-all cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </form>

          {/* Members Card */}
          <div className="rounded-2xl border border-white/10 bg-[#121722] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="h-4 w-4 text-violet-400" />
                  Household Members ({householdMembers.length})
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Manage, edit details, or remove active members</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMember(!showAddMember)}
                className="rounded-xl bg-violet-600/20 border border-violet-500/30 px-3 py-1.5 text-xs font-bold text-violet-300 hover:bg-violet-600 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Add Member
              </button>
            </div>

            {/* Add Member Form */}
            {showAddMember && (
              <form onSubmit={handleAddMemberSubmit} className="rounded-xl border border-violet-500/30 bg-violet-500/5 p-3.5 space-y-2.5 text-xs animate-in fade-in duration-150">
                <h4 className="text-xs font-bold text-violet-300">Add New Household Member</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Member Name (e.g. Priya)"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#121722] px-3 py-1.5 text-white focus:border-violet-500 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="rounded-xl border border-white/10 bg-[#121722] px-3 py-1.5 text-white focus:border-violet-500 focus:outline-none cursor-pointer"
                    >
                      {HOUSEHOLD_ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#121722] text-white">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      className="rounded-xl border border-white/10 bg-[#121722] px-3 py-1.5 text-white focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddMember(false)}
                    className="px-3 py-1 text-slate-400 hover:text-white text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-violet-600 px-4 py-1 text-xs font-bold text-white shadow-md shadow-violet-600/30 hover:bg-violet-500 transition-all cursor-pointer"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            )}

            {/* Members List */}
            <div className="space-y-2">
              {householdMembers.map((member) => {
                const isEditing = editingMemberId === member.id;
                return (
                  <div
                    key={member.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl bg-white/[0.03] p-3 text-xs border border-white/5 gap-3 transition-all hover:bg-white/[0.05]"
                  >
                    {isEditing ? (
                      <div className="w-full space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            placeholder="Name"
                            className="rounded-lg border border-violet-500/50 bg-[#121722] px-2.5 py-1 text-white font-bold text-xs"
                          />
                          <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="rounded-lg border border-violet-500/50 bg-[#121722] px-2.5 py-1 text-white text-xs focus:border-violet-500 focus:outline-none cursor-pointer"
                          >
                            {HOUSEHOLD_ROLE_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value} className="bg-[#121722] text-white">
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            placeholder="Email"
                            className="rounded-lg border border-violet-500/50 bg-[#121722] px-2.5 py-1 text-white text-xs"
                          />
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingMemberId(null)}
                            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-white transition-all cursor-pointer"
                          >
                            <X className="h-3 w-3" /> Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(member.id)}
                            className="flex items-center gap-1 rounded-lg bg-violet-600 px-3 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-violet-500 transition-all cursor-pointer"
                          >
                            <Save className="h-3 w-3" /> Save Changes
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 font-bold text-xs shrink-0 border border-violet-500/30">
                            {getInitials(member.name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{member.name}</span>
                              <span className="text-[10px] text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-md border border-violet-500/20 font-semibold">
                                {member.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">{member.email}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(member)}
                            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-300 transition-all cursor-pointer"
                            title="Edit Member Details"
                          >
                            <Pencil className="h-3 w-3 text-violet-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMemberClick(member.id, member.name)}
                            className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-semibold text-rose-400 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300 transition-all cursor-pointer"
                            title="Delete Member"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
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
