// ============================================================================
// HomeSense — Inventory Service
// ============================================================================
// TO SWAP TO REAL API: Replace mock imports with apiClient calls.
// Components and hooks don't change at all.
// ============================================================================

import { delay } from '@/lib/utils';
import { mockInventoryItems, mockInventoryHealthSummary } from '@/data/mock/inventory.mock';
import type { InventoryItem, InventoryHealthSummary, RestockPayload, ItemStatus } from '@/types';

// Simulates network latency for realistic loading states
const MOCK_DELAY = 400;

/**
 * Fetch all inventory items for the household.
 *
 * REAL API: GET /inventory/items?household_id={id}
 */
export async function getInventoryItems(): Promise<InventoryItem[]> {
  await delay(MOCK_DELAY);
  return [...mockInventoryItems];
}

/**
 * Get inventory health summary (status counts + running low items).
 *
 * REAL API: GET /inventory/summary?household_id={id}
 */
export async function getInventoryHealthSummary(): Promise<InventoryHealthSummary> {
  await delay(MOCK_DELAY);
  return { ...mockInventoryHealthSummary };
}

/**
 * Add a new item to inventory.
 *
 * REAL API: POST /inventory/items
 */
export async function addInventoryItem(item: Omit<InventoryItem, 'id' | 'status' | 'remainingDaysMin' | 'remainingDaysMax' | 'consumptionVelocity' | 'coPurchaseItems' | 'hasAnomaly' | 'lastRestockedBy'>): Promise<InventoryItem> {
  await delay(MOCK_DELAY);
  const newItem: InventoryItem = {
    ...item,
    id: `inv-${Date.now()}`,
    status: 'UNKNOWN' as ItemStatus,
    remainingDaysMin: null,
    remainingDaysMax: null,
    consumptionVelocity: null,
    coPurchaseItems: [],
    hasAnomaly: false,
    lastRestockedBy: null,
  };
  return newItem;
}

/**
 * Update an existing inventory item.
 *
 * REAL API: PUT /inventory/items/{id}
 */
export async function updateInventoryItem(id: string, updates: Partial<InventoryItem>): Promise<InventoryItem> {
  await delay(MOCK_DELAY);
  const existing = mockInventoryItems.find((i) => i.id === id);
  if (!existing) throw new Error(`Item ${id} not found`);
  return { ...existing, ...updates };
}

/**
 * Restock an inventory item (core consumption signal).
 *
 * REAL API: POST /inventory/{id}/restock
 */
export async function restockItem(payload: RestockPayload): Promise<InventoryItem> {
  await delay(MOCK_DELAY);
  const existing = mockInventoryItems.find((i) => i.id === payload.itemId);
  if (!existing) throw new Error(`Item ${payload.itemId} not found`);
  return {
    ...existing,
    quantity: payload.quantity,
    unit: payload.unit,
    purchaseDate: payload.date,
    typicalPrice: payload.pricePaid ?? existing.typicalPrice,
    preferredBrand: payload.brand ?? existing.preferredBrand,
    status: 'NORMAL' as ItemStatus,
    remainingDaysMin: existing.expectedDurationDays,
    remainingDaysMax: existing.expectedDurationDays ? existing.expectedDurationDays + 3 : null,
  };
}

/**
 * Mark an item as running low (core consumption signal).
 *
 * REAL API: POST /inventory/{id}/status
 */
export async function markItemRunningLow(itemId: string): Promise<InventoryItem> {
  await delay(MOCK_DELAY);
  const existing = mockInventoryItems.find((i) => i.id === itemId);
  if (!existing) throw new Error(`Item ${itemId} not found`);
  return { ...existing, status: 'RUNNING_LOW' as ItemStatus };
}

/**
 * Delete an inventory item.
 *
 * REAL API: DELETE /inventory/items/{id}
 */
export async function deleteInventoryItem(id: string): Promise<void> {
  await delay(MOCK_DELAY);
  // In real API, this would delete from the backend
}
