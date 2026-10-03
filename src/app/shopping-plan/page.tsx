'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Modal } from '@/components/ui/Modal';
import {
  getCurrentPlan, getBudgetGuard,
} from '@/services/shopping-plan.service';
import {
  ShoppingPlan, BudgetGuardInfo,
  PLAN_STATUS_CONFIG, MARKETPLACE_CONFIG, Marketplace, PLAN_ITEM_SOURCE_LABELS,
} from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  ShoppingCart, CheckCircle2, Sparkles,
  Zap, Trash2, ArrowRight, ShieldCheck, Check
} from 'lucide-react';

export default function ShoppingPlanPage() {
  const [plan, setPlan] = useState<ShoppingPlan | null>(null);
  const [budgetGuard, setBudgetGuard] = useState<BudgetGuardInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Marketplace>(Marketplace.BLINKIT);

  useEffect(() => {
    async function loadPlanData() {
      setIsLoading(true);
      try {
        const [planData, budgetData] = await Promise.all([
          getCurrentPlan(),
          getBudgetGuard('plan-001'),
        ]);
        setPlan(planData);
        setBudgetGuard(budgetData);
      } catch (error) {
        console.error('Failed to load plan:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPlanData();
  }, []);

  const handleRemoveItem = (itemId: string) => {
    if (!plan) return;
    const updatedItems = plan.items.filter((i) => i.id !== itemId);
    setPlan({
      ...plan,
      items: updatedItems,
      totalEstimate: updatedItems.reduce((sum, i) => sum + (i.totalPrice || 0), 0),
    });
  };

  const confirmApproval = () => {
    setIsApproved(true);
    setShowApprovalModal(false);
  };

  if (isLoading || !plan) {
    return <div className="p-8 text-center text-xs text-white/50">Loading Smart Shopping Plan...</div>;
  }

  const statusConfig = PLAN_STATUS_CONFIG[isApproved ? 'APPROVED' : plan.status];
  const totalEstimate = plan.totalEstimate || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${plan.monthYear} Smart Shopping Plan`}
        subtitle={`${plan.items.length} items · Estimated total: ${formatCurrency(totalEstimate)}`}
        icon={ShoppingCart}
        badge={{ text: statusConfig.label, variant: isApproved ? 'emerald' : 'violet' }}
        actions={
          !isApproved && (
            <button
              onClick={() => setShowApprovalModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" /> Approve Plan & Order
            </button>
          )
        }
      />

      {/* Status Progress */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#12121a] p-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-300 font-bold">1</span>
          <span className="font-semibold text-white">Generate List</span>
        </div>
        <div className="h-px flex-1 bg-white/10 mx-3" />
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-300 font-bold">2</span>
          <span className="font-semibold text-white">Review Rationale</span>
        </div>
        <div className="h-px flex-1 bg-white/10 mx-3" />
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full font-bold ${isApproved ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40'}`}>3</span>
          <span className={`font-semibold ${isApproved ? 'text-emerald-300' : 'text-white/40'}`}>Approved</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Plan Items & Rationale */}
        <div className="space-y-4 lg:col-span-8">
          {/* Budget Guard Alert */}
          {budgetGuard && (
            <div className="flex items-center justify-between rounded-xl border border-violet-500/20 bg-violet-500/10 p-3.5 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-violet-400 shrink-0" />
                <span className="text-violet-200">
                  Plan total ({formatCurrency(totalEstimate)}) is within your monthly limit ({formatCurrency(budgetGuard.monthlyTarget)}).
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400">
                {formatCurrency(budgetGuard.monthlyTarget - totalEstimate)} remaining
              </span>
            </div>
          )}

          {/* Items List */}
          <div className="rounded-2xl border border-white/10 bg-[#12121a] overflow-hidden">
            <div className="border-b border-white/10 bg-white/[0.02] px-4 py-3 text-xs font-semibold text-white/60 flex justify-between">
              <span>Item & Source Engine Rationale</span>
              <span>Est. Price</span>
            </div>

            <div className="divide-y divide-white/5">
              {plan.items.map((item) => {
                const sourceConfig = PLAN_ITEM_SOURCE_LABELS[item.source];
                return (
                  <div key={item.id} className="p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between hover:bg-white/[0.01]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{item.name}</span>
                        {item.brand && (
                          <span className="text-[10px] text-white/40 bg-white/5 px-2 py-0.5 rounded">
                            {item.brand}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-violet-300">
                        <Sparkles className="h-3 w-3 text-violet-400 shrink-0" />
                        <span>{sourceConfig.icon} Added via {sourceConfig.label} engine</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end">
                      <div className="text-right">
                        <span className="text-sm font-semibold text-white">{formatCurrency(item.totalPrice || 0)}</span>
                        <p className="text-[10px] text-white/40">{item.quantity} {item.unit}</p>
                      </div>
                      {!isApproved && (
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1.5 text-white/30 hover:text-red-400 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Store Comparison & Checkout */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-[#12121a] p-5 space-y-4">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" /> Store Price Optimization
            </h2>
            <p className="text-xs text-white/50">Simulated price & delivery estimates across quick-commerce apps:</p>

            <div className="space-y-2">
              {Object.values(Marketplace).map((store) => {
                const config = MARKETPLACE_CONFIG[store];
                const isSelected = selectedStore === store;
                return (
                  <div
                    key={store}
                    onClick={() => setSelectedStore(store)}
                    className={`cursor-pointer rounded-xl border p-3 text-xs transition-all ${
                      isSelected
                        ? 'border-violet-500 bg-violet-500/10 text-white'
                        : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between font-semibold">
                      <span>{config.name}</span>
                      <span className="text-emerald-400">Est. 12-18 mins</span>
                    </div>
                    <p className="mt-1 text-[11px] text-white/40">Optimized cart matching available</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-3 flex justify-between text-xs font-semibold">
              <span className="text-white/60">Estimated Total</span>
              <span className="text-white text-sm">{formatCurrency(totalEstimate)}</span>
            </div>

            {!isApproved ? (
              <button
                onClick={() => setShowApprovalModal(true)}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
              >
                Approve & Send to Cart <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-3 text-xs text-center text-emerald-300 font-semibold flex items-center justify-center gap-1.5">
                <Check className="h-4 w-4" /> Order Approved & Processing
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title="Confirm Shopping Plan Approval"
        subtitle="Review final items and confirm order dispatcher"
      >
        <div className="space-y-4">
          <p className="text-xs text-white/70">
            You are approving <strong>{plan.items.length} items</strong> for a total estimated cost of{' '}
            <strong>{formatCurrency(totalEstimate)}</strong> via <strong>{MARKETPLACE_CONFIG[selectedStore].name}</strong>.
          </p>

          <div className="rounded-xl bg-white/[0.03] p-3 text-xs space-y-1">
            <span className="font-semibold text-white">Approval Actions:</span>
            <ul className="list-disc pl-4 text-white/60 space-y-0.5 text-[11px]">
              <li>Items will be marked as &quot;Approved&quot; in Household Memory.</li>
              <li>Replenishment predictions will update item exhaust timelines.</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowApprovalModal(false)}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-white/60 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={confirmApproval}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
            >
              Confirm & Approve
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
