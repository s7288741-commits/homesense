'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Modal } from '@/components/ui/Modal';
import { AddItemToPlanModal } from '@/components/shopping/AddItemToPlanModal';
import { useHousehold } from '@/context/HouseholdContext';
import {
  PLAN_STATUS_CONFIG,
  MARKETPLACE_CONFIG,
  Marketplace,
  PLAN_ITEM_SOURCE_LABELS,
  PlanItemSource,
} from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  ShoppingCart, CheckCircle2, Sparkles, RefreshCw, AlertCircle,
  Zap, Trash2, ArrowRight, ShieldCheck, Check, Plus
} from 'lucide-react';

export default function ShoppingPlanPage() {
  const {
    shoppingPlan,
    selectedStore,
    setSelectedStore,
    budget,
    removeItemFromPlan,
    addItemToPlan,
    applySubstitution,
    approvePlan,
  } = useHousehold();

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [substitutionApplied, setSubstitutionApplied] = useState(false);

  const isApproved = shoppingPlan.status === ('APPROVED' as any);
  const statusConfig = PLAN_STATUS_CONFIG[isApproved ? 'APPROVED' : shoppingPlan.status];
  const totalEstimate = shoppingPlan.totalEstimate || 0;

  const handleApplySubstitution = () => {
    applySubstitution();
    setSubstitutionApplied(true);
    setShowSubModal(false);
  };

  const confirmApproval = () => {
    approvePlan();
    setShowApprovalModal(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${shoppingPlan.monthYear || 'October 2026'} Smart Shopping Plan`}
        subtitle={`${shoppingPlan.items.length} items · Estimated total: ${formatCurrency(totalEstimate)}`}
        icon={ShoppingCart}
        badge={{ text: statusConfig.label, variant: isApproved ? 'emerald' : 'violet' }}
        actions={
          <div className="flex items-center gap-2">
            {!isApproved && (
              <button
                onClick={() => setShowAddItemModal(true)}
                className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-all"
              >
                <Plus className="h-4 w-4" /> Add Item
              </button>
            )}
            {!isApproved && (
              <button
                onClick={() => setShowApprovalModal(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-all"
              >
                <CheckCircle2 className="h-4 w-4" /> Approve Plan & Order
              </button>
            )}
          </div>
        }
      />

      {/* Status Progress */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#121722] p-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-300 font-bold">1</span>
          <span className="font-bold text-white">Generate List</span>
        </div>
        <div className="h-px flex-1 bg-white/10 mx-3" />
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-violet-300 font-bold">2</span>
          <span className="font-bold text-white">Review Rationale & Substitutions</span>
        </div>
        <div className="h-px flex-1 bg-white/10 mx-3" />
        <div className="flex items-center gap-2">
          <span className={`flex h-6 w-6 items-center justify-center rounded-full font-bold ${isApproved ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/40'}`}>3</span>
          <span className={`font-bold ${isApproved ? 'text-emerald-400' : 'text-slate-400'}`}>Approved</span>
        </div>
      </div>

      {/* Product Substitution Assistant Alert Card */}
      <div className="rounded-2xl border border-amber-500/30 bg-[#171D29] p-5 shadow-lg space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-400 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> Product Substitution Alert
              </span>
              <span className="text-xs text-slate-400">Item: Detergent Powder</span>
            </div>
            <p className="text-xs font-semibold text-white">
              Preferred item <span className="text-amber-300">Surf Excel Matic (2L)</span> is currently out of stock on Blinkit.
            </p>
            <p className="text-xs text-slate-300">
              System found in-stock alternative: <strong className="text-emerald-400">Genteel Liquid Detergent (2L)</strong> — Same pack size, <strong>40% cheaper (Saves ₹230)</strong>, available now!
            </p>
          </div>

          <div className="shrink-0">
            {substitutionApplied ? (
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-300">
                <Check className="h-4 w-4" /> Substituted (Saved ₹230)
              </span>
            ) : (
              <button
                onClick={() => setShowSubModal(true)}
                className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-600/20 hover:bg-amber-500 transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" /> View Alternative (40% Off)
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Plan Items & Rationale */}
        <div className="space-y-4 lg:col-span-8">
          {/* Budget Guard Alert */}
          {budget && (
            <div className="flex items-center justify-between rounded-xl border border-violet-500/20 bg-violet-500/10 p-3.5 text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-violet-400 shrink-0" />
                <span className="text-violet-200">
                  Plan total ({formatCurrency(totalEstimate)}) is within your monthly limit ({formatCurrency(budget.monthlyTarget)}).
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-400">
                {formatCurrency(budget.remaining)} remaining
              </span>
            </div>
          )}

          {/* Items List */}
          <div className="rounded-2xl border border-white/10 bg-[#121722] overflow-hidden shadow-md">
            <div className="border-b border-white/10 bg-white/[0.02] px-4 py-3 text-xs font-bold text-slate-400 flex justify-between items-center">
              <span>Item & Source Engine Rationale</span>
              <span>Est. Price</span>
            </div>

            <div className="divide-y divide-white/5">
              {shoppingPlan.items.map((item) => {
                const sourceConfig = PLAN_ITEM_SOURCE_LABELS[item.source] || PLAN_ITEM_SOURCE_LABELS[PlanItemSource.PREDICTION];
                return (
                  <div key={item.id} className="p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between hover:bg-white/[0.01]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{item.name}</span>
                        {item.brand && (
                          <span className="text-[10px] text-slate-300 bg-white/5 px-2 py-0.5 rounded font-semibold border border-white/5">
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
                        <span className="text-sm font-bold text-white">{formatCurrency(item.totalPrice || 0)}</span>
                        <p className="text-[10px] text-slate-400">{item.quantity} {item.unit}</p>
                      </div>
                      {!isApproved && (
                        <button
                          onClick={() => removeItemFromPlan(item.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
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
          <div className="rounded-2xl border border-white/10 bg-[#121722] p-5 space-y-4 shadow-md">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" /> Store Price Optimization
            </h2>
            <p className="text-xs text-slate-400">Select preferred quick-commerce provider:</p>

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
                        ? 'border-violet-500 bg-violet-500/10 text-white shadow-md'
                        : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between font-bold">
                      <span>{config.name}</span>
                      <span className="text-emerald-400">Est. 12-18 mins</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">Optimized cart matching available</p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/10 pt-3 flex justify-between text-xs font-bold">
              <span className="text-slate-400">Estimated Total</span>
              <span className="text-white text-sm">{formatCurrency(totalEstimate)}</span>
            </div>

            {!isApproved ? (
              <button
                onClick={() => setShowApprovalModal(true)}
                className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
              >
                Approve & Send to Cart <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-3 text-xs text-center text-emerald-300 font-bold flex items-center justify-center gap-1.5">
                <Check className="h-4 w-4" /> Order Approved & Processing
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Custom Item Modal */}
      <AddItemToPlanModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        onAdd={(itemData) => addItemToPlan(itemData)}
      />

      {/* Product Substitution Modal */}
      <Modal
        isOpen={showSubModal}
        onClose={() => setShowSubModal(false)}
        title="Product Substitution Assistant"
        subtitle="Intelligent alternative matching for out-of-stock items"
      >
        <div className="space-y-4 text-xs">
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 space-y-1">
            <span className="font-bold text-red-300">Unavailable Item:</span>
            <p className="text-slate-300">Surf Excel Matic Liquid Detergent (2L) — Out of Stock on Blinkit</p>
          </div>

          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white text-sm">Recommended Alternative:</span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 font-bold text-[10px] border border-emerald-500/30">
                40% CHEAPER
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-white font-semibold">
                <span>Genteel Liquid Detergent</span>
                <span>₹340 <span className="line-through text-slate-500 text-[10px]">₹570</span></span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-slate-400 block">Pack Size Match</span>
                  <strong className="text-white">2 Liters (Identical)</strong>
                </div>
                <div className="bg-white/5 p-2 rounded-lg">
                  <span className="text-slate-400 block">Availability</span>
                  <strong className="text-emerald-400">In Stock Now (Blinkit 12m)</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowSubModal(false)}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
            >
              Keep Original
            </button>
            <button
              onClick={handleApplySubstitution}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" /> Substitute & Save ₹230
            </button>
          </div>
        </div>
      </Modal>

      {/* Approval Modal */}
      <Modal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        title="Confirm Shopping Plan Approval"
        subtitle="Review final items and confirm order dispatcher"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-300">
            You are approving <strong>{shoppingPlan.items.length} items</strong> for a total estimated cost of{' '}
            <strong>{formatCurrency(totalEstimate)}</strong> via <strong>{MARKETPLACE_CONFIG[selectedStore].name}</strong>.
          </p>

          <div className="rounded-xl bg-white/[0.03] p-3 text-xs space-y-1">
            <span className="font-bold text-white">Approval Actions:</span>
            <ul className="list-disc pl-4 text-slate-300 space-y-0.5 text-[11px]">
              <li>Items will be marked as &quot;Approved&quot; in Household Memory.</li>
              <li>Replenishment predictions will update item exhaust timelines.</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setShowApprovalModal(false)}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              onClick={confirmApproval}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
            >
              Confirm & Approve
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
