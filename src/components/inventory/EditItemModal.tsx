'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { InventoryItem, ItemCategory, ItemUnit, CATEGORY_LABELS } from '@/types';

interface EditItemModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<InventoryItem>) => void;
}

export function EditItemModal({ item, isOpen, onClose, onSave }: EditItemModalProps) {
  const [form, setForm] = useState({
    name: '',
    category: ItemCategory.GROCERY,
    quantity: '',
    unit: ItemUnit.KG,
    expectedDurationDays: '',
    preferredBrand: '',
    typicalPrice: '',
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        category: item.category,
        quantity: item.quantity.toString(),
        unit: item.unit,
        expectedDurationDays: item.expectedDurationDays ? item.expectedDurationDays.toString() : '',
        preferredBrand: item.preferredBrand || '',
        typicalPrice: item.typicalPrice ? item.typicalPrice.toString() : '',
      });
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item.id, {
      name: form.name,
      category: form.category,
      quantity: parseFloat(form.quantity) || item.quantity,
      unit: form.unit,
      expectedDurationDays: form.expectedDurationDays ? parseInt(form.expectedDurationDays) : item.expectedDurationDays,
      preferredBrand: form.preferredBrand || null,
      typicalPrice: form.typicalPrice ? parseFloat(form.typicalPrice) : item.typicalPrice,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Edit ${item.name}`} subtitle="Modify item parameters and duration">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="mb-1 block font-semibold text-slate-300">Item Name *</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full rounded-xl border border-white/10 bg-[#121722] px-3.5 py-2 text-white focus:border-violet-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-semibold text-slate-300">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as ItemCategory }))}
              className="w-full rounded-xl border border-white/10 bg-[#121722] px-3.5 py-2 text-white focus:border-violet-500 focus:outline-none"
            >
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-300">Unit *</label>
            <select
              value={form.unit}
              onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value as ItemUnit }))}
              className="w-full rounded-xl border border-white/10 bg-[#121722] px-3.5 py-2 text-white focus:border-violet-500 focus:outline-none"
            >
              {Object.values(ItemUnit).map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-semibold text-slate-300">Quantity *</label>
            <input
              type="number"
              required
              min="0"
              step="0.1"
              value={form.quantity}
              onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-[#121722] px-3.5 py-2 text-white focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-300">Expected Duration (Days)</label>
            <input
              type="number"
              min="1"
              value={form.expectedDurationDays}
              onChange={(e) => setForm((prev) => ({ ...prev, expectedDurationDays: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-[#121722] px-3.5 py-2 text-white focus:border-violet-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-semibold text-slate-300">Preferred Brand</label>
            <input
              type="text"
              value={form.preferredBrand}
              onChange={(e) => setForm((prev) => ({ ...prev, preferredBrand: e.target.value }))}
              placeholder="e.g., Fortune"
              className="w-full rounded-xl border border-white/10 bg-[#121722] px-3.5 py-2 text-white focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-300">Typical Price (₹)</label>
            <input
              type="number"
              min="0"
              value={form.typicalPrice}
              onChange={(e) => setForm((prev) => ({ ...prev, typicalPrice: e.target.value }))}
              placeholder="180"
              className="w-full rounded-xl border border-white/10 bg-[#121722] px-3.5 py-2 text-white focus:border-violet-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-bold text-white hover:bg-violet-500 shadow-md shadow-violet-600/20"
          >
            Update Item
          </button>
        </div>
      </form>
    </Modal>
  );
}
