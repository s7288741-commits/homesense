import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { InventoryItem, ItemCategory, ItemUnit, ItemStatus, CATEGORY_LABELS } from '@/types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: InventoryItem) => void;
}

export function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
  const [form, setForm] = useState({
    name: '',
    category: ItemCategory.GROCERY,
    quantity: '',
    unit: ItemUnit.KG,
    purchaseDate: new Date().toISOString().split('T')[0],
    expectedDurationDays: '',
    preferredBrand: '',
    preferredPackSize: '',
    typicalPrice: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: form.name,
      category: form.category,
      quantity: parseFloat(form.quantity) || 0,
      unit: form.unit,
      purchaseDate: new Date(form.purchaseDate).toISOString(),
      expectedDurationDays: form.expectedDurationDays ? parseInt(form.expectedDurationDays) : null,
      preferredBrand: form.preferredBrand || null,
      preferredPackSize: form.preferredPackSize || null,
      typicalPrice: form.typicalPrice ? parseFloat(form.typicalPrice) : null,
      status: ItemStatus.NORMAL,
      householdId: 'hh-001',
      remainingDaysMin: form.expectedDurationDays ? parseInt(form.expectedDurationDays) : 10,
      remainingDaysMax: form.expectedDurationDays ? parseInt(form.expectedDurationDays) + 3 : 15,
      consumptionVelocity: null,
      coPurchaseItems: [],
      hasAnomaly: false,
      lastRestockedBy: null,
    };
    onAdd(newItem);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Household Item" subtitle="Track stock level and duration">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-white/60">Item Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Basmati Rice"
            className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:border-violet-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-white/60">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as ItemCategory }))}
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#181E2A] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-violet-600 focus:outline-none"
            >
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-white/60">Unit *</label>
            <select
              value={form.unit}
              onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value as ItemUnit }))}
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#181E2A] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-violet-600 focus:outline-none"
            >
              {Object.values(ItemUnit).map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-white/60">Quantity *</label>
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={form.quantity}
              onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
              placeholder="5"
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-violet-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-white/60">Expected Duration (Days)</label>
            <input
              type="number"
              min="1"
              value={form.expectedDurationDays}
              onChange={(e) => setForm((prev) => ({ ...prev, expectedDurationDays: e.target.value }))}
              placeholder="30"
              className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-violet-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-slate-200 dark:border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-2xl bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-violet-500 shadow-md shadow-violet-600/20"
          >
            Save Item
          </button>
        </div>
      </form>
    </Modal>
  );
}
