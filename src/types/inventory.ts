// ============================================================================
// HomeSense — Inventory Types
// ============================================================================
// Defines: InventoryItem, Category, ItemStatus, Units, and consumption events.
// Primary page: Inventory. Also used in Dashboard & Shopping Plan.
// ============================================================================

export enum ItemCategory {
  GROCERY = 'GROCERY',
  FOOD_BEVERAGES = 'FOOD_BEVERAGES',
  SNACKS = 'SNACKS',
  CLEANING = 'CLEANING',
  PERSONAL_CARE = 'PERSONAL_CARE',
  HOUSEHOLD_ESSENTIALS = 'HOUSEHOLD_ESSENTIALS',
  CUSTOM = 'CUSTOM',
}

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  [ItemCategory.GROCERY]: 'Grocery',
  [ItemCategory.FOOD_BEVERAGES]: 'Food & Beverages',
  [ItemCategory.SNACKS]: 'Snacks',
  [ItemCategory.CLEANING]: 'Cleaning',
  [ItemCategory.PERSONAL_CARE]: 'Personal Care',
  [ItemCategory.HOUSEHOLD_ESSENTIALS]: 'Household Essentials',
  [ItemCategory.CUSTOM]: 'Custom',
};

export const CATEGORY_ICONS: Record<ItemCategory, string> = {
  [ItemCategory.GROCERY]: '🛒',
  [ItemCategory.FOOD_BEVERAGES]: '🥤',
  [ItemCategory.SNACKS]: '🍪',
  [ItemCategory.CLEANING]: '🧹',
  [ItemCategory.PERSONAL_CARE]: '🧴',
  [ItemCategory.HOUSEHOLD_ESSENTIALS]: '🏠',
  [ItemCategory.CUSTOM]: '📦',
};

export enum ItemStatus {
  NORMAL = 'NORMAL',           // 🟢 Sufficient stock
  UPCOMING = 'UPCOMING',       // 🟡 Will run low soon (7-14 days)
  RUNNING_LOW = 'RUNNING_LOW', // 🔴 Running low (1-7 days)
  UNKNOWN = 'UNKNOWN',         // ⚪ Not enough data to predict
}

export const STATUS_CONFIG: Record<ItemStatus, { label: string; emoji: string; color: string; bgColor: string; borderColor: string }> = {
  [ItemStatus.NORMAL]: {
    label: 'Normal',
    emoji: '🟢',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  [ItemStatus.UPCOMING]: {
    label: 'Upcoming',
    emoji: '🟡',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
  },
  [ItemStatus.RUNNING_LOW]: {
    label: 'Running Low',
    emoji: '🔴',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  [ItemStatus.UNKNOWN]: {
    label: 'Unknown',
    emoji: '⚪',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/30',
  },
};

export enum ItemUnit {
  KG = 'kg',
  G = 'g',
  L = 'L',
  ML = 'mL',
  UNITS = 'units',
  PACKETS = 'packets',
  BOTTLES = 'bottles',
  BOXES = 'boxes',
}

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  customCategory?: string; // only if category === CUSTOM
  quantity: number;
  unit: ItemUnit;
  purchaseDate: string; // ISO date
  expectedDurationDays: number | null; // null = system hasn't learned yet
  preferredBrand: string | null;
  preferredPackSize: string | null;
  typicalPrice: number | null;
  status: ItemStatus;
  householdId: string;

  // Derived fields (from Prediction Engine)
  remainingDaysMin: number | null; // e.g., 3 (in "3-5 days")
  remainingDaysMax: number | null; // e.g., 5
  consumptionVelocity: number | null; // units/day

  // Derived fields (from Memory Engine)
  coPurchaseItems: string[]; // item names usually bought together
  hasAnomaly: boolean; // true if current consumption is anomalous
  lastRestockedBy: string | null; // member name
}

// Event-driven signals — the ONLY way users report consumption (PRD §5)
export enum ConsumptionEventType {
  RESTOCKED = 'RESTOCKED',     // User bought/refilled this item
  RUNNING_LOW = 'RUNNING_LOW', // User signals item is getting low
  PURCHASED = 'PURCHASED',     // Item was bought (from shopping plan)
}

export interface RestockPayload {
  itemId: string;
  quantity: number;
  unit: ItemUnit;
  pricePaid: number | null;
  brand: string | null;
  date: string; // ISO date
}

export interface InventoryFilters {
  search: string;
  statuses: ItemStatus[];
  categories: ItemCategory[];
  sortBy: 'urgency' | 'name' | 'category' | 'lastPurchased' | 'price';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
}

// Summary counts for Dashboard widget
export interface InventoryHealthSummary {
  total: number;
  normal: number;
  upcoming: number;
  runningLow: number;
  unknown: number;
  runningLowItems: Pick<InventoryItem, 'id' | 'name' | 'status' | 'remainingDaysMin' | 'remainingDaysMax'>[];
  upcomingItems: Pick<InventoryItem, 'id' | 'name' | 'status' | 'remainingDaysMin' | 'remainingDaysMax'>[];
}
