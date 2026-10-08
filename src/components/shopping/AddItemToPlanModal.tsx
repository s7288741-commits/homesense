'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { ItemUnit, ItemCategory } from '@/types';

interface AddItemToPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: {
    name: string;
    brand?: string;
    quantity: number;
    unit: ItemUnit;
    unitPrice: number;
    category?: string;
  }) => void;
}

export function AddItemToPlanModal({ isOpen, onClose, onAdd }: AddItemToPlanModalProps) {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState<ItemUnit>(ItemUnit.PACKETS);
  const [unitPrice, setUnitPrice] = useState('');
  const [category, setCategory] = useState<ItemCategory>(ItemCategory.GROCERY);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      brand: brand.trim() || undefined,
      quantity: parseFloat(quantity) || 1,
      unit,
      unitPrice: parseFloat(unitPrice) || 100,
      category,
    });

    setName('');
    setBrand('');
    setQuantity('1');
    setUnitPrice('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Item to Shopping Plan" subtitle="Include custom household products in active cart">
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="mb-1 block font-semibold text-slate-300">Item Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Olive Oil"
            className="w-full rounded-xl border border-white/10 bg-[#121722] px-3.5 py-2 text-white focus:border-violet-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-semibold text-slate-300">Preferred Brand</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Borges"
              className="w-full rounded-xl border border-white/10 bg-[#121722] px-3.5 py-2 text-white focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-300">Est. Price per Unit (₹)</label>
            <input
              type="number"
              required
              min="1"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="450"
              className="w-full rounded-xl border border-white/10 bg-[#121722] px-3.5 py-2 text-white focus:border-violet-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block font-semibold text-slate-300">Quantity *</label>
            <input
              type="number"
              required
              min="0.1"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#121722] px-3.5 py-2 text-white focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block font-semibold text-slate-300">Unit *</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as ItemUnit)}
              className="w-full rounded-xl border border-white/10 bg-[#121722] px-3.5 py-2 text-white focus:border-violet-500 focus:outline-none"
            >
              {Object.values(ItemUnit).map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
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
            Add to Plan
          </button>
        </div>
      </form>
    </Modal>
  );
}
