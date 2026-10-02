'use client';

import React, { useState, useEffect } from 'react';
import {
  getCurrentPlan, getBudgetGuard, getSmartSavings,
  getForgottenItems, getCoPurchaseSuggestions, getSubstitutions,
  removePlanItem, approvePlan,
} from '@/services/shopping-plan.service';
import {
  ShoppingPlan, PlanItem, BudgetGuardInfo, SmartSavingsInfo,
  ForgottenItem, CoPurchaseSuggestion, SubstitutionOption,
  PLAN_STATUS_CONFIG, PLAN_ITEM_SOURCE_LABELS, URGENCY_CONFIG,
  UrgencyLevel, PlanStatus, MARKETPLACE_CONFIG, Marketplace,
} from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import {
  ShoppingCart, CheckCircle2, AlertTriangle, Sparkles, Lightbulb,
  Link2, Zap, Trash2, ChevronDown, ArrowRight, Shield, Clock,
  Package, X, ExternalLink,
} from 'lucide-react';

export default function ShoppingPlanPage() {
  const [plan, setPlan] = useState<ShoppingPlan | null>(null);
  const [budgetGuard, setBudgetGuard] = useState<BudgetGuardInfo | null>(null);
  const [smartSavings, setSmartSavings] = useState<SmartSavingsInfo | null>(null);
  const [forgottenItems, setForgottenItems] = useState<ForgottenItem[]>([]);
  const [coSuggestions, setCoSuggestions] = useState<CoPurchaseSuggestion[]>([]);
  const [substitutions, setSubstitutions] = useState<SubstitutionOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState<'items' | 'timing'>('items');

  useEffect(() => {
    async function loadPlan() {
      setIsLoading(true);
      try {
        const [planData, budgetData, savingsData, forgotten, coData, subData] = await Promise.all([
          getCurrentPlan(),
          getBudgetGuard('plan-001'),
          getSmartSavings('plan-001'),
          getForgottenItems('plan-001'),
          getCoPurchaseSuggestions('plan-001'),
          getSubstitutions('plan-001'),
        ]);
        setPlan(planData);
        setBudgetGuard(budgetData);
        setSmartSavings(savingsData);
        setForgottenItems(forgotten);
        setCoSuggestions(coData);
        setSubstitutions(subData);
      } catch (error) {
        console.error('Failed to load plan:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPlan();
  }, []);

  const handleRemoveItem = (itemId: string) => {
    if (!plan) return;
    setPlan({
      ...plan,
      items: plan.items.filter((i) => i.id !== itemId),
      totalEstimate: plan.items.filter((i) => i.id !== itemId).reduce((sum, i) => sum + (i.totalPrice || 0), 0),
    });
  };

  const handleApprove = async () => {
    if (!plan) return;
    setShowSummary(true);
  };

  const groupedByUrgency = plan?.items.reduce((acc, item) => {
    const group = item.urgency;
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<UrgencyLevel, PlanItem[]>) || {};

  if (isLoading) {
    return (
      <div>
        <div className="skeleton mb-6 h-8 w-48" />
        <div className="skeleton mb-4 h-24 rounded-2xl" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <ShoppingCart className="mb-4 h-16 w-16 text-white/10" />
        <p className="text-base font-medium text-white/40">No shopping plan yet</p>
        <p className="mt-1 text-sm text-white/20">Add items to inventory first, then generate a plan</p>
      </div>
    );
  }

  const statusConfig = PLAN_STATUS_CONFIG[plan.status];
  const steps: PlanStatus[] = ['DRAFT', 'READY', 'APPROVED', 'COMPLETED'] as PlanStatus[];
  const currentStep = steps.indexOf(plan.status);

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-violet-400" />
          <h1 className="text-xl font-bold text-white">{plan.monthYear} Shopping Plan</h1>
          <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-semibold', statusConfig.bgColor, statusConfig.color)}>
            {statusConfig.label}
          </span>
        </div>
        <p className="mt-1 text-sm text-white/40">
          {plan.items.length} items · Est. {formatCurrency(plan.totalEstimate)}
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="mb-6 flex items-center gap-2 rounded-2xl glass-card p-4">
        {steps.map((step, i) => {
          const sc = PLAN_STATUS_CONFIG[step];
          const isActive = i <= currentStep;
          return (
            <React.Fragment key={step}>
              <div className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all',
                isActive ? `${sc.bgColor} ${sc.color}` : 'text-white/20'
              )}>
                {isActive && i <= currentStep && <CheckCircle2 className="h-3.5 w-3.5" />}
                {sc.label}
              </div>
              {i < steps.length - 1 && (
                <div className={cn('h-px flex-1', isActive && i < currentStep ? 'bg-violet-500/30' : 'bg-white/[0.06]')} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Main Content — Plan Items */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          {/* Budget Guard */}
          {budgetGuard?.isOverBudget && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.05] p-4 animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-red-400" />
                <span className="text-sm font-semibold text-red-400">
                  Budget Alert: {formatCurrency(budgetGuard.difference)} over budget
                </span>
              </div>
              <p className="text-[11px] text-white/40 mb-3">
                Plan: {formatCurrency(budgetGuard.planEstimate)} · Budget: {formatCurrency(budgetGuard.monthlyTarget)}
              </p>
              {budgetGuard.suggestions.length > 0 && (
                <div className="space-y-1.5">
                  {budgetGuard.suggestions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                      <span className="text-xs text-white/60">
                        {s.itemName}: {s.currentBrand} → {s.suggestedBrand}
                      </span>
                      <span className="text-xs font-medium text-emerald-400">-{formatCurrency(s.savings)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Smart Savings */}
          {smartSavings?.isAvailable && smartSavings.potentialSavings > 0 && (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-emerald-400">Smart Savings Available</span>
                </div>
                <span className="text-lg font-bold text-emerald-400">Save {formatCurrency(smartSavings.potentialSavings)}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-white/[0.03] px-3 py-2">
                  <span className="text-[10px] text-white/30">Standard</span>
                  <p className="text-sm font-medium text-white/50 line-through">{formatCurrency(smartSavings.standardTotal)}</p>
                </div>
                <div className="rounded-lg bg-emerald-500/[0.06] px-3 py-2">
                  <span className="text-[10px] text-emerald-400/60">Optimized</span>
                  <p className="text-sm font-bold text-emerald-400">{formatCurrency(smartSavings.optimizedTotal)}</p>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                {smartSavings.optimizations.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between text-[11px]">
                    <span className="text-white/40">{opt.itemName}: {opt.currentSelection} → {opt.optimizedSelection}</span>
                    <span className="text-emerald-400">-{formatCurrency(opt.savings)}</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full rounded-xl bg-emerald-500/15 py-2 text-xs font-medium text-emerald-300 transition-all hover:bg-emerald-500/20">
                Apply Savings
              </button>
            </div>
          )}

          {/* Tab Toggle: Items vs Timing */}
          <div className="flex gap-1 rounded-xl bg-white/[0.03] p-1">
            <button
              onClick={() => setActiveTab('items')}
              className={cn('flex-1 rounded-lg py-2 text-xs font-medium transition-all',
                activeTab === 'items' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'
              )}
            >
              <Package className="mr-1.5 inline h-3.5 w-3.5" />
              Plan Items ({plan.items.length})
            </button>
            <button
              onClick={() => setActiveTab('timing')}
              className={cn('flex-1 rounded-lg py-2 text-xs font-medium transition-all',
                activeTab === 'timing' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'
              )}
            >
              <Clock className="mr-1.5 inline h-3.5 w-3.5" />
              Buy Now vs Wait
            </button>
          </div>

          {/* Items Tab */}
          {activeTab === 'items' && (
            <div className="glass-card overflow-hidden rounded-2xl animate-fade-in">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase">Item</th>
                    <th className="px-3 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase">Qty</th>
                    <th className="hidden px-3 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase md:table-cell">Brand</th>
                    <th className="px-3 py-3 text-right text-[10px] font-semibold tracking-wider text-white/30 uppercase">Price</th>
                    <th className="hidden px-3 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase sm:table-cell">Source</th>
                    <th className="px-3 py-3 text-right text-[10px] font-semibold tracking-wider text-white/30 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plan.items.map((item) => {
                    const urgencyConfig = URGENCY_CONFIG[item.urgency];
                    const sourceConfig = PLAN_ITEM_SOURCE_LABELS[item.source];
                    return (
                      <tr key={item.id} className="border-b border-white/[0.03] transition-all hover:bg-white/[0.02]">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {item.urgency === UrgencyLevel.BUY_NOW && (
                              <div className="h-1.5 w-1.5 rounded-full bg-red-400 pulse-red" />
                            )}
                            <div>
                              <span className="text-sm font-medium text-white/80">{item.name}</span>
                              {item.isSubstitution && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Zap className="h-3 w-3 text-amber-400" />
                                  <span className="text-[10px] text-amber-400/70">Substituted from {item.originalBrand}</span>
                                </div>
                              )}
                              {item.urgency === UrgencyLevel.BUY_NOW && item.remainingDays != null && (
                                <span className="text-[10px] text-red-400/70">⚠️ {item.remainingDays} days left</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-white/60">{item.quantity} {item.unit}</td>
                        <td className="hidden px-3 py-3 text-xs text-white/40 md:table-cell">{item.brand || '—'}</td>
                        <td className="px-3 py-3 text-right text-xs font-medium text-white/70">
                          {item.totalPrice ? formatCurrency(item.totalPrice) : '—'}
                        </td>
                        <td className="hidden px-3 py-3 sm:table-cell">
                          <span className={cn('inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium',
                            item.source === 'FORGOTTEN' ? 'bg-amber-500/10 text-amber-400' :
                            item.source === 'CO_PURCHASE' ? 'bg-blue-500/10 text-blue-400' :
                            item.source === 'EVENT' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-white/[0.04] text-white/30'
                          )}>
                            {sourceConfig.icon} {sourceConfig.label}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="rounded-lg p-1.5 text-white/20 transition-all hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-white/[0.08]">
                    <td colSpan={3} className="px-4 py-3 text-sm font-semibold text-white/60">Estimated Total</td>
                    <td className="px-3 py-3 text-right text-base font-bold text-white">{formatCurrency(plan.totalEstimate)}</td>
                    <td colSpan={2} />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Timing Tab — Buy Now vs Wait */}
          {activeTab === 'timing' && (
            <div className="space-y-3 animate-fade-in">
              {(Object.entries(groupedByUrgency) as [UrgencyLevel, PlanItem[]][]).sort(([a], [b]) => {
                const order: Record<string, number> = { BUY_NOW: 0, CAN_WAIT: 1, NOT_URGENT: 2 };
                return (order[a] ?? 3) - (order[b] ?? 3);
              }).map(([urgency, urgencyItems]: [UrgencyLevel, PlanItem[]]) => {
                const config = URGENCY_CONFIG[urgency];
                return (
                  <div key={urgency} className="glass-card rounded-2xl p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={cn('text-xs font-semibold', config.color)}>{config.label}</span>
                      <span className="text-[10px] text-white/20">({urgencyItems.length} items)</span>
                    </div>
                    <div className="space-y-1.5">
                      {urgencyItems.map((item: PlanItem) => (
                        <div key={item.id} className={cn('flex items-center justify-between rounded-lg px-3 py-2', config.bgColor)}>
                          <span className="text-xs text-white/70">{item.name}</span>
                          <span className={cn('text-[11px] font-medium', config.color)}>
                            {item.remainingDays != null ? `${item.remainingDays} days` : '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Approve Button */}
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 hover:brightness-110"
            >
              Approve & Continue →
            </button>
          </div>
        </div>

        {/* Sidebar — Forgotten + Co-Purchase + Substitutions */}
        <div className="col-span-12 space-y-4 lg:col-span-4">
          {/* Forgotten Items */}
          {forgottenItems.length > 0 && (
            <div className="glass-card rounded-2xl p-4 animate-fade-in">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-semibold text-white">Did you forget?</span>
              </div>
              <p className="mb-3 text-[11px] text-white/40">
                {forgottenItems.length} items from your usual cycle aren&apos;t in this plan:
              </p>
              <div className="space-y-2">
                {forgottenItems.map((fi) => (
                  <div key={fi.id} className="flex items-center justify-between rounded-lg bg-amber-500/[0.05] px-3 py-2">
                    <div>
                      <span className="text-xs font-medium text-white/70">{fi.itemName}</span>
                      <p className="text-[10px] text-white/30">
                        Usually every {fi.usualCycleDays} days · Last bought {fi.lastPurchasedDaysAgo} days ago
                      </p>
                    </div>
                    <button className="rounded-lg bg-amber-500/15 px-2.5 py-1 text-[10px] font-medium text-amber-400 transition-all hover:bg-amber-500/20">
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Co-Purchase Suggestions */}
          {coSuggestions.some((cs) => cs.suggestedItems.some((si) => !si.isAlreadyInPlan)) && (
            <div className="glass-card rounded-2xl p-4 animate-fade-in">
              <div className="mb-3 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">Usually Together</span>
              </div>
              <div className="space-y-3">
                {coSuggestions.map((cs) => {
                  const missing = cs.suggestedItems.filter((si) => !si.isAlreadyInPlan);
                  if (missing.length === 0) return null;
                  return (
                    <div key={cs.triggerItemName}>
                      <p className="text-[11px] text-white/40 mb-1.5">
                        Since you&apos;re buying <span className="text-white/60">{cs.triggerItemName}</span>:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {missing.map((si) => (
                          <button
                            key={si.name}
                            className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-[10px] font-medium text-blue-400 transition-all hover:bg-blue-500/15"
                          >
                            + {si.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Substitutions */}
          {substitutions.length > 0 && (
            <div className="glass-card rounded-2xl p-4 animate-fade-in">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-semibold text-white">Substitutions</span>
              </div>
              {substitutions.map((sub) => (
                <div key={sub.id}>
                  <div className="mb-2 rounded-lg bg-red-500/[0.06] px-3 py-2">
                    <span className="text-[11px] font-medium text-red-400">Out of Stock: </span>
                    <span className="text-[11px] text-white/60">{sub.originalBrand} {sub.originalItem}</span>
                  </div>
                  <div className="space-y-1.5">
                    {sub.alternatives.map((alt, i) => (
                      <div key={alt.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                        <div>
                          {i === 0 && <span className="text-[9px] text-amber-400">⭐ Recommended</span>}
                          <p className="text-xs text-white/70">{alt.brand} {alt.packSize}</p>
                          <p className="text-[10px] text-white/30">
                            {formatCurrency(alt.price)} · {alt.rating}★
                            {alt.priceDifference < 0 && (
                              <span className="text-emerald-400"> ({formatCurrency(Math.abs(alt.priceDifference))} cheaper)</span>
                            )}
                          </p>
                        </div>
                        <button className="rounded-lg bg-violet-500/15 px-2.5 py-1 text-[10px] font-medium text-violet-300 transition-all hover:bg-violet-500/20">
                          Replace
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Smart Summary Modal */}
      {showSummary && plan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSummary(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#12121a] p-6 shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <h2 className="text-base font-semibold text-white">Smart Shopping Summary</h2>
              </div>
              <button onClick={() => setShowSummary(false)} className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.06]">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1.5 mb-4">
              {plan.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg px-3 py-2 bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/70">{item.name}</span>
                    <span className="text-[10px] text-white/30">{item.quantity} {item.unit}</span>
                    {item.isSubstitution && <Zap className="h-3 w-3 text-amber-400" />}
                  </div>
                  <span className="text-xs font-medium text-white/60">{item.totalPrice ? formatCurrency(item.totalPrice) : '—'}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/[0.06] pt-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-white/50">Subtotal</span>
                <span className="font-medium text-white">{formatCurrency(plan.totalEstimate)}</span>
              </div>
              {smartSavings && smartSavings.potentialSavings > 0 && (
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-emerald-400/60">Smart Savings</span>
                  <span className="font-medium text-emerald-400">-{formatCurrency(smartSavings.potentialSavings)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-white/[0.06]">
                <span className="text-white/70">Estimated Total</span>
                <span className="text-white">{formatCurrency(plan.totalEstimate - (smartSavings?.potentialSavings || 0))}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-medium text-white/40 mb-2">Send to:</p>
              <div className="flex gap-2">
                {Object.entries(MARKETPLACE_CONFIG).map(([key, mp]) => (
                  <button
                    key={key}
                    className="flex items-center gap-1.5 rounded-xl border border-white/[0.06] px-3 py-2 text-xs text-white/50 transition-all hover:border-white/15 hover:bg-white/[0.03] hover:text-white/70"
                  >
                    <span>{mp.logo}</span>
                    <span>{mp.name}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowSummary(false)} className="flex-1 rounded-xl border border-white/[0.06] py-2.5 text-sm text-white/40 hover:bg-white/[0.04]">
                ← Modify Items
              </button>
              <button className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/20">
                Approve & Continue →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
