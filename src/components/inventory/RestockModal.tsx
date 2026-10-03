import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { InventoryItem, ItemStatus } from '@/types';
import { formatCurrency, formatQuantity } from '@/lib/utils';

interface RestockModalProps {
  item: InventoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onRestock: (updated: InventoryItem) => void;
}

export function RestockModal({ item, isOpen, onClose, onRestock }: RestockModalProps) {
  if (!item) return null;

  const [quantity, setQuantity] = useState(item.quantity.toString());
  const [pricePaid, setPricePaid] = useState(item.typicalPrice?.toString() || '');
  const [brand, setBrand] = useState(item.preferredBrand || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: InventoryItem = {
      ...item,
      quantity: parseFloat(quantity) || item.quantity,
      purchaseDate: new Date().toISOString(),
      typicalPrice: pricePaid ? parseFloat(pricePaid) : item.typicalPrice,
      preferredBrand: brand || item.preferredBrand,
      status: ItemStatus.NORMAL,
      remainingDaysMin: item.expectedDurationDays || 14,
      remainingDaysMax: item.expectedDurationDays ? item.expectedDurationDays + 3 : 18,
    };
    onRestock(updated);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Restock: ${item.name}`}
      subtitle="Update quantity and record restocking details"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-white/60">Quantity Restocked</label>
            <input
              type="number"
              required
              min="0.1"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
            />
            <span className="text-[10px] text-white/40">Current: {formatQuantity(item.quantity, item.unit)}</span>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-white/60">Price Paid (₹)</label>
            <input
              type="number"
              min="0"
              value={pricePaid}
              onChange={(e) => setPricePaid(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
            />
            <span className="text-[10px] text-white/40">Typical: {item.typicalPrice ? formatCurrency(item.typicalPrice) : 'N/A'}</span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-white/60">Brand</label>
          <input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-violet-500 focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-white/60 hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
          >
            Confirm Restock
          </button>
        </div>
      </form>
    </Modal>
  );
}
