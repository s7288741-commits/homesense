'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { AddItemModal } from '@/components/inventory/AddItemModal';
import { RestockModal } from '@/components/inventory/RestockModal';
import { EditItemModal } from '@/components/inventory/EditItemModal';
import { useHousehold } from '@/context/HouseholdContext';
import {
  InventoryItem,
  ItemStatus,
  STATUS_CONFIG,
  CATEGORY_LABELS,
  CATEGORY_ICONS,
  type InventoryFilters,
} from '@/types';
import { cn, formatQuantity, formatRemainingDays } from '@/lib/utils';
import {
  Package, Search, LayoutGrid, List, Plus, X, Edit3, Trash2, RefreshCw, AlertCircle
} from 'lucide-react';

export default function InventoryPage() {
  const {
    inventoryItems,
    addInventoryItem,
    updateInventoryItem,
    restockInventoryItem,
    markInventoryItemLow,
    deleteInventoryItem,
  } = useHousehold();

  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    statuses: [],
    categories: [],
    sortBy: 'urgency',
    sortOrder: 'asc',
    viewMode: 'grid',
  });

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRestockItem, setSelectedRestockItem] = useState<InventoryItem | null>(null);
  const [showRestockModal, setShowRestockModal] = useState(false);

  const [selectedEditItem, setSelectedEditItem] = useState<InventoryItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Filter & Sort Items
  const filteredItems = useMemo(() => {
    let result = [...inventoryItems];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.preferredBrand && i.preferredBrand.toLowerCase().includes(q)) ||
          CATEGORY_LABELS[i.category].toLowerCase().includes(q)
      );
    }

    if (filters.statuses.length > 0) {
      result = result.filter((i) => filters.statuses.includes(i.status));
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (filters.sortBy) {
        case 'urgency':
          cmp = (a.remainingDaysMin ?? 999) - (b.remainingDaysMin ?? 999);
          break;
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'category':
          cmp = a.category.localeCompare(b.category);
          break;
      }
      return filters.sortOrder === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [inventoryItems, filters]);

  const toggleStatus = (status: ItemStatus) => {
    setFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(status)
        ? prev.statuses.filter((s) => s !== status)
        : [...prev.statuses, status],
    }));
  };

  const handleRestock = (item: InventoryItem) => {
    setSelectedRestockItem(item);
    setShowRestockModal(true);
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedEditItem(item);
    setShowEditModal(true);
  };

  const handleDelete = (item: InventoryItem) => {
    if (confirm(`Are you sure you want to remove "${item.name}" from your inventory?`)) {
      deleteInventoryItem(item.id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Household Inventory"
        subtitle={`${inventoryItems.length} items tracked · ${inventoryItems.filter((i) => i.status === ItemStatus.RUNNING_LOW || i.status === ItemStatus.UPCOMING).length} need attention`}
        icon={Package}
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-violet-600/20 hover:bg-violet-500 transition-all"
          >
            <Plus className="h-4 w-4" /> Add Item
          </button>
        }
      />

      {/* Search & Status Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-white/30" />
          <input
            type="text"
            placeholder="Search items, brands, categories..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:border-violet-600 focus:outline-none shadow-sm"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {Object.values(ItemStatus).map((status) => {
              const config = STATUS_CONFIG[status];
              const count = inventoryItems.filter((i) => i.status === status).length;
              const isActive = filters.statuses.includes(status);
              return (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-50 dark:hover:bg-white/10'
                  )}
                >
                  <span>{config.emoji}</span>
                  <span>{config.label}</span>
                  <span className="ml-1 rounded-full bg-slate-100 dark:bg-white/10 px-2 py-0.2 text-[10px]">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as InventoryFilters['sortBy'] }))}
              className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#12161F] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-white/70 focus:border-violet-600 focus:outline-none shadow-sm"
            >
              <option value="urgency">Sort: Urgency</option>
              <option value="name">Sort: Name</option>
              <option value="category">Sort: Category</option>
            </select>

            <div className="flex rounded-2xl border border-slate-200 dark:border-white/10 p-0.5 bg-white dark:bg-white/5 shadow-sm">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, viewMode: 'grid' }))}
                className={cn('rounded-xl p-1.5 text-xs font-semibold', filters.viewMode === 'grid' ? 'bg-slate-100 dark:bg-white/20 text-slate-900 dark:text-white' : 'text-slate-400')}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, viewMode: 'list' }))}
                className={cn('rounded-xl p-1.5 text-xs font-semibold', filters.viewMode === 'list' ? 'bg-slate-100 dark:bg-white/20 text-slate-900 dark:text-white' : 'text-slate-400')}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {filters.viewMode === 'grid' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => {
            const statusConfig = STATUS_CONFIG[item.status];
            return (
              <div key={item.id} className="floating-card p-5 space-y-3 relative group">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h3>
                    <span className="text-[11px] text-slate-500 dark:text-white/40">
                      {CATEGORY_ICONS[item.category]} {CATEGORY_LABELS[item.category]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold', statusConfig.bgColor, statusConfig.color)}>
                      {statusConfig.emoji} {statusConfig.label}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 border-t border-slate-100 dark:border-white/5 pt-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-white/40">Quantity:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatQuantity(item.quantity, item.unit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-white/40">Est. Remaining:</span>
                    <span className={cn('font-bold', statusConfig.color)}>
                      {formatRemainingDays(item.remainingDaysMin, item.remainingDaysMax)}
                    </span>
                  </div>
                  {item.preferredBrand && (
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 dark:text-white/40">Brand:</span>
                      <span className="text-slate-700 dark:text-white/70 font-medium">{item.preferredBrand}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={() => handleRestock(item)}
                    className="flex-1 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Restock
                  </button>
                  {item.status !== ItemStatus.RUNNING_LOW && (
                    <button
                      onClick={() => markInventoryItemLow(item.id)}
                      className="rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 px-2.5 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/20"
                      title="Mark as Running Low"
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(item)}
                    className="rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 px-2.5 py-2 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-500/20"
                    title="Edit Item Details"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-2.5 py-2 text-xs font-semibold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/20"
                    title="Delete Item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {filters.viewMode === 'list' && (
        <div className="floating-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-400 dark:text-white/40">
              <tr>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Item</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Quantity</th>
                <th className="p-3.5">Est. Remaining</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredItems.map((item) => {
                const statusConfig = STATUS_CONFIG[item.status];
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                    <td className="p-3.5">
                      <span className={cn('rounded-full px-2.5 py-0.5 text-[10px] font-bold', statusConfig.bgColor, statusConfig.color)}>
                        {statusConfig.emoji} {statusConfig.label}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{item.name}</td>
                    <td className="p-3.5 text-slate-500 dark:text-white/50">{CATEGORY_LABELS[item.category]}</td>
                    <td className="p-3.5 text-slate-900 dark:text-white font-medium">{formatQuantity(item.quantity, item.unit)}</td>
                    <td className="p-3.5 font-bold text-slate-700 dark:text-white/80">{formatRemainingDays(item.remainingDaysMin, item.remainingDaysMax)}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button onClick={() => handleRestock(item)} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Restock</button>
                      <button onClick={() => markInventoryItemLow(item.id)} className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">Mark Low</button>
                      <button onClick={() => handleEdit(item)} className="text-violet-600 dark:text-violet-400 font-semibold hover:underline">Edit</button>
                      <button onClick={() => handleDelete(item)} className="text-red-600 dark:text-red-400 font-semibold hover:underline">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(newItem) => addInventoryItem(newItem)}
      />
      <RestockModal
        item={selectedRestockItem}
        isOpen={showRestockModal}
        onClose={() => setShowRestockModal(false)}
        onRestock={(updated) => restockInventoryItem(updated.id, updated.quantity, updated.unit, updated.typicalPrice, updated.preferredBrand)}
      />
      <EditItemModal
        item={selectedEditItem}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={(id, updates) => updateInventoryItem(id, updates)}
      />
    </div>
  );
}
