'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getInventoryItems } from '@/services/inventory.service';
import {
  InventoryItem,
  ItemCategory,
  ItemStatus,
  ItemUnit,
  STATUS_CONFIG,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  type InventoryFilters,
} from '@/types';
import { cn, formatCurrency, formatQuantity, formatRemainingDays, getRelativeTime } from '@/lib/utils';
import {
  Package, Search, LayoutGrid, List, Filter, Plus, RefreshCw, AlertTriangle,
  ChevronDown, MoreHorizontal, ArrowUpDown, X
} from 'lucide-react';

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    statuses: [],
    categories: [],
    sortBy: 'urgency',
    sortOrder: 'asc',
    viewMode: 'grid',
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showRestockModal, setShowRestockModal] = useState(false);

  useEffect(() => {
    async function loadItems() {
      setIsLoading(true);
      try {
        const data = await getInventoryItems();
        setItems(data);
      } catch (error) {
        console.error('Failed to load inventory:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadItems();
  }, []);

  // ── Filtered & Sorted Items ──
  const filteredItems = useMemo(() => {
    let result = [...items];

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.preferredBrand && i.preferredBrand.toLowerCase().includes(q)) ||
          CATEGORY_LABELS[i.category].toLowerCase().includes(q)
      );
    }

    // Status filter
    if (filters.statuses.length > 0) {
      result = result.filter((i) => filters.statuses.includes(i.status));
    }

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter((i) => filters.categories.includes(i.category));
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (filters.sortBy) {
        case 'urgency':
          const aMin = a.remainingDaysMin ?? 999;
          const bMin = b.remainingDaysMin ?? 999;
          cmp = aMin - bMin;
          break;
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'category':
          cmp = a.category.localeCompare(b.category);
          break;
        case 'lastPurchased':
          cmp = new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
          break;
        case 'price':
          cmp = (b.typicalPrice ?? 0) - (a.typicalPrice ?? 0);
          break;
      }
      return filters.sortOrder === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [items, filters]);

  const toggleStatus = (status: ItemStatus) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }));
  };

  const handleRestock = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowRestockModal(true);
  };

  const handleMarkLow = (item: InventoryItem) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: ItemStatus.RUNNING_LOW } : i))
    );
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-violet-400" />
            <h1 className="text-xl font-bold text-white">Inventory</h1>
          </div>
          <p className="mt-1 text-sm text-white/40">
            {items.length} items tracked · {items.filter((i) => i.status === ItemStatus.RUNNING_LOW).length} running low
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      {/* Search & Filters */}
      <div className="mb-4 space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search items, brands, categories..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:border-violet-500/30 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Status filters + View toggle */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {Object.values(ItemStatus).map((status) => {
              const config = STATUS_CONFIG[status];
              const count = items.filter((i) => i.status === status).length;
              const isActive = filters.statuses.includes(status);
              return (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all',
                    isActive
                      ? `${config.bgColor} ${config.borderColor} ${config.color}`
                      : 'border-white/[0.06] text-white/30 hover:border-white/10 hover:text-white/50'
                  )}
                >
                  <span>{config.emoji}</span>
                  <span>{config.label}</span>
                  <span className="ml-1 rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px]">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as InventoryFilters['sortBy'] }))}
              className="rounded-lg border border-white/[0.06] bg-transparent px-2.5 py-1.5 text-xs text-white/50 focus:border-violet-500/30 focus:outline-none"
            >
              <option value="urgency">Sort: Urgency</option>
              <option value="name">Sort: Name</option>
              <option value="category">Sort: Category</option>
              <option value="lastPurchased">Sort: Last Purchased</option>
              <option value="price">Sort: Price</option>
            </select>

            {/* View toggle */}
            <div className="flex rounded-lg border border-white/[0.06] p-0.5">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, viewMode: 'grid' }))}
                className={cn(
                  'rounded-md p-1.5 transition-all',
                  filters.viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'
                )}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, viewMode: 'list' }))}
                className={cn(
                  'rounded-md p-1.5 transition-all',
                  filters.viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'
                )}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-2xl" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16">
          <Package className="mb-3 h-12 w-12 text-white/10" />
          <p className="text-sm font-medium text-white/40">
            {items.length === 0 ? 'Your inventory is empty' : 'No items match your filters'}
          </p>
          <p className="mt-1 text-xs text-white/20">
            {items.length === 0 ? 'Start by adding your first household item' : 'Try adjusting your search or filters'}
          </p>
          {items.length === 0 && (
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 flex items-center gap-2 rounded-xl bg-violet-500/10 px-4 py-2 text-xs font-medium text-violet-300 transition-all hover:bg-violet-500/15"
            >
              <Plus className="h-3.5 w-3.5" />
              Add First Item
            </button>
          )}
        </div>
      )}

      {/* Grid View */}
      {!isLoading && filteredItems.length > 0 && filters.viewMode === 'grid' && (
        <div className="stagger-children grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <ItemCard key={item.id} item={item} onRestock={handleRestock} onMarkLow={handleMarkLow} />
          ))}
        </div>
      )}

      {/* List View */}
      {!isLoading && filteredItems.length > 0 && filters.viewMode === 'list' && (
        <div className="glass-card overflow-hidden rounded-2xl">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase">Item</th>
                <th className="hidden px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase md:table-cell">Category</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase">Qty</th>
                <th className="hidden px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase lg:table-cell">Brand</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-wider text-white/30 uppercase">Remaining</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold tracking-wider text-white/30 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const statusConfig = STATUS_CONFIG[item.status];
                return (
                  <tr key={item.id} className="border-b border-white/[0.03] transition-all hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <span className="text-sm">{statusConfig.emoji}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-white/80">{item.name}</span>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className="text-xs text-white/40">{CATEGORY_LABELS[item.category]}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-white/60">{formatQuantity(item.quantity, item.unit)}</span>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <span className="text-xs text-white/40">{item.preferredBrand || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-medium', statusConfig.color)}>
                        {formatRemainingDays(item.remainingDaysMin, item.remainingDaysMax)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleRestock(item)}
                          className="rounded-lg bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400 transition-all hover:bg-emerald-500/15"
                        >
                          Restock
                        </button>
                        {item.status !== ItemStatus.RUNNING_LOW && (
                          <button
                            onClick={() => handleMarkLow(item)}
                            className="rounded-lg bg-red-500/10 px-2.5 py-1 text-[10px] font-medium text-red-400 transition-all hover:bg-red-500/15"
                          >
                            Low
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onAdd={(item) => { setItems((prev) => [item, ...prev]); setShowAddModal(false); }} />}

      {/* Restock Modal */}
      {showRestockModal && selectedItem && (
        <RestockModal
          item={selectedItem}
          onClose={() => { setShowRestockModal(false); setSelectedItem(null); }}
          onRestock={(updated) => {
            setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
            setShowRestockModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}

// ── Item Card Component ──

function ItemCard({
  item,
  onRestock,
  onMarkLow,
}: {
  item: InventoryItem;
  onRestock: (item: InventoryItem) => void;
  onMarkLow: (item: InventoryItem) => void;
}) {
  const statusConfig = STATUS_CONFIG[item.status];

  return (
    <div className="glass-card group relative rounded-2xl p-4 transition-all hover:border-white/10">
      {/* Status badge */}
      <div className={cn(
        'absolute right-3 top-3 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold',
        statusConfig.bgColor, statusConfig.color
      )}>
        {statusConfig.emoji} {statusConfig.label}
      </div>

      {/* Anomaly indicator */}
      {item.hasAnomaly && (
        <div className="absolute left-3 top-3">
          <AlertTriangle className="h-4 w-4 text-amber-400 animate-pulse" />
        </div>
      )}

      {/* Item info */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-white/90">{item.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[11px] text-white/30">{CATEGORY_ICONS[item.category]}</span>
          <span className="text-[11px] text-white/30">{CATEGORY_LABELS[item.category]}</span>
        </div>
      </div>

      <div className="mt-3 h-px bg-white/[0.04]" />

      {/* Details */}
      <div className="mt-3 space-y-1.5">
        <div className="flex justify-between">
          <span className="text-[11px] text-white/30">Quantity</span>
          <span className="text-[11px] font-medium text-white/60">{formatQuantity(item.quantity, item.unit)}</span>
        </div>
        {item.preferredBrand && (
          <div className="flex justify-between">
            <span className="text-[11px] text-white/30">Brand</span>
            <span className="text-[11px] text-white/60">{item.preferredBrand}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-[11px] text-white/30">Purchased</span>
          <span className="text-[11px] text-white/50">{getRelativeTime(item.purchaseDate)}</span>
        </div>
        {item.typicalPrice && (
          <div className="flex justify-between">
            <span className="text-[11px] text-white/30">Typical Price</span>
            <span className="text-[11px] text-white/50">{formatCurrency(item.typicalPrice)}</span>
          </div>
        )}
      </div>

      {/* Remaining time */}
      <div className={cn(
        'mt-3 rounded-lg px-3 py-2 text-center',
        statusConfig.bgColor
      )}>
        <span className="text-[10px] text-white/30">Remaining: </span>
        <span className={cn('text-xs font-bold', statusConfig.color)}>
          {formatRemainingDays(item.remainingDaysMin, item.remainingDaysMax)}
        </span>
      </div>

      {/* Co-purchase hint */}
      {item.coPurchaseItems.length > 0 && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-white/25">
          <span>🔗</span>
          <span>Usually with: {item.coPurchaseItems.join(', ')}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => onRestock(item)}
          className="flex-1 rounded-lg bg-emerald-500/10 py-2 text-xs font-medium text-emerald-400 transition-all hover:bg-emerald-500/15"
        >
          Restocked
        </button>
        {item.status !== ItemStatus.RUNNING_LOW && (
          <button
            onClick={() => onMarkLow(item)}
            className="flex-1 rounded-lg bg-red-500/10 py-2 text-xs font-medium text-red-400 transition-all hover:bg-red-500/15"
          >
            Running Low
          </button>
        )}
      </div>
    </div>
  );
}

// ── Add Item Modal ──

function AddItemModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (item: InventoryItem) => void;
}) {
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
      status: ItemStatus.UNKNOWN,
      householdId: 'hh-001',
      remainingDaysMin: null,
      remainingDaysMax: null,
      consumptionVelocity: null,
      coPurchaseItems: [],
      hasAnomaly: false,
      lastRestockedBy: null,
    };
    onAdd(newItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#12121a] p-6 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Add New Item</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.06] hover:text-white/50">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-white/40">Item Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Rice (Basmati)"
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-white/40">Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as ItemCategory }))}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white focus:border-violet-500/30 focus:outline-none"
            >
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key} className="bg-[#12121a]">{label}</option>
              ))}
            </select>
          </div>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-white/40">Quantity *</label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={form.quantity}
                onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
                placeholder="5"
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-white/40">Unit *</label>
              <select
                value={form.unit}
                onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value as ItemUnit }))}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white focus:border-violet-500/30 focus:outline-none"
              >
                {Object.values(ItemUnit).map((unit) => (
                  <option key={unit} value={unit} className="bg-[#12121a]">{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Purchase Date */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-white/40">Purchase Date</label>
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setForm((prev) => ({ ...prev, purchaseDate: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white focus:border-violet-500/30 focus:outline-none"
            />
          </div>

          {/* Expected Duration */}
          <div>
            <label className="mb-1 block text-[11px] font-medium text-white/40">Expected Duration (days)</label>
            <input
              type="number"
              min="1"
              value={form.expectedDurationDays}
              onChange={(e) => setForm((prev) => ({ ...prev, expectedDurationDays: e.target.value }))}
              placeholder="How long does this usually last?"
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none"
            />
          </div>

          {/* Optional: Brand, Pack, Price */}
          <details className="group">
            <summary className="cursor-pointer text-xs font-medium text-white/30 hover:text-white/50">
              ── Optional Details ──
            </summary>
            <div className="mt-3 space-y-3">
              <div>
                <label className="mb-1 block text-[11px] font-medium text-white/40">Preferred Brand</label>
                <input
                  type="text"
                  value={form.preferredBrand}
                  onChange={(e) => setForm((prev) => ({ ...prev, preferredBrand: e.target.value }))}
                  placeholder="e.g., India Gate"
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-white/40">Pack Size</label>
                  <input
                    type="text"
                    value={form.preferredPackSize}
                    onChange={(e) => setForm((prev) => ({ ...prev, preferredPackSize: e.target.value }))}
                    placeholder="e.g., 5 kg bag"
                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-white/40">Typical Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.typicalPrice}
                    onChange={(e) => setForm((prev) => ({ ...prev, typicalPrice: e.target.value }))}
                    placeholder="250"
                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-violet-500/30 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </details>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/[0.06] py-2.5 text-sm text-white/40 transition-all hover:bg-white/[0.04] hover:text-white/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30"
            >
              Save Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Restock Modal ──

function RestockModal({
  item,
  onClose,
  onRestock,
}: {
  item: InventoryItem;
  onClose: () => void;
  onRestock: (updated: InventoryItem) => void;
}) {
  const [form, setForm] = useState({
    quantity: item.quantity.toString(),
    unit: item.unit,
    pricePaid: item.typicalPrice?.toString() || '',
    brand: item.preferredBrand || '',
    date: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: InventoryItem = {
      ...item,
      quantity: parseFloat(form.quantity) || item.quantity,
      unit: form.unit,
      purchaseDate: new Date(form.date).toISOString(),
      typicalPrice: form.pricePaid ? parseFloat(form.pricePaid) : item.typicalPrice,
      preferredBrand: form.brand || item.preferredBrand,
      status: ItemStatus.NORMAL,
      remainingDaysMin: item.expectedDurationDays,
      remainingDaysMax: item.expectedDurationDays ? item.expectedDurationDays + 3 : null,
    };
    onRestock(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#12121a] p-6 shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Restock: {item.name}</h2>
            <p className="text-[11px] text-white/30">Pre-filled from your preferences</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.06]">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-white/40">Quantity Purchased</label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={form.quantity}
                onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white focus:border-violet-500/30 focus:outline-none"
              />
              <span className="text-[10px] text-white/20">Last time: {formatQuantity(item.quantity, item.unit)}</span>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-medium text-white/40">Price Paid (₹)</label>
              <input
                type="number"
                min="0"
                value={form.pricePaid}
                onChange={(e) => setForm((prev) => ({ ...prev, pricePaid: e.target.value }))}
                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white focus:border-violet-500/30 focus:outline-none"
              />
              <span className="text-[10px] text-white/20">Typical: {item.typicalPrice ? formatCurrency(item.typicalPrice) : 'N/A'}</span>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-white/40">Brand</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white focus:border-violet-500/30 focus:outline-none"
            />
            <span className="text-[10px] text-white/20">Preferred: {item.preferredBrand || 'Not set'}</span>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-medium text-white/40">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white focus:border-violet-500/30 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/[0.06] py-2.5 text-sm text-white/40 transition-all hover:bg-white/[0.04]">
              Cancel
            </button>
            <button type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30">
              Confirm Restock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
