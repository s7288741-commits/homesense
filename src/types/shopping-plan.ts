// ============================================================================
// HomeSense — Shopping Plan Types
// ============================================================================
// Defines: ShoppingPlan, PlanItem, Substitution, BudgetGuard, SmartSavings.
// Primary page: Shopping Plan. Summary in Dashboard.
// ============================================================================

export enum PlanStatus {
  DRAFT = 'DRAFT',         // System-generated, user hasn't reviewed
  READY = 'READY',         // User has reviewed and modified
  APPROVED = 'APPROVED',   // User confirmed, ready for purchase
  COMPLETED = 'COMPLETED', // All items purchased/resolved
}

export const PLAN_STATUS_CONFIG: Record<PlanStatus, { label: string; color: string; bgColor: string }> = {
  [PlanStatus.DRAFT]: { label: 'Draft', color: 'text-slate-400', bgColor: 'bg-slate-500/10' },
  [PlanStatus.READY]: { label: 'Ready', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  [PlanStatus.APPROVED]: { label: 'Approved', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
  [PlanStatus.COMPLETED]: { label: 'Completed', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
};

// Where did this plan item come from?
export enum PlanItemSource {
  PREDICTION = 'PREDICTION',       // Auto-added by prediction engine
  FORGOTTEN = 'FORGOTTEN',         // Suggested by forgotten item memory
  CO_PURCHASE = 'CO_PURCHASE',     // Suggested by co-purchase rules
  EVENT = 'EVENT',                 // Added due to household event
  MANUAL = 'MANUAL',               // Manually added by user
}

export const PLAN_ITEM_SOURCE_LABELS: Record<PlanItemSource, { label: string; icon: string }> = {
  [PlanItemSource.PREDICTION]: { label: 'Predicted', icon: '🔮' },
  [PlanItemSource.FORGOTTEN]: { label: 'Suggested', icon: '💡' },
  [PlanItemSource.CO_PURCHASE]: { label: 'Often Paired', icon: '🔗' },
  [PlanItemSource.EVENT]: { label: 'Event', icon: '📅' },
  [PlanItemSource.MANUAL]: { label: 'Manual', icon: '✏️' },
};

export enum UrgencyLevel {
  BUY_NOW = 'BUY_NOW',       // 1-3 days remaining
  CAN_WAIT = 'CAN_WAIT',     // 4-7 days remaining
  NOT_URGENT = 'NOT_URGENT',  // 8+ days remaining
}

export const URGENCY_CONFIG: Record<UrgencyLevel, { label: string; color: string; bgColor: string }> = {
  [UrgencyLevel.BUY_NOW]: { label: 'Buy Soon', color: 'text-red-400', bgColor: 'bg-red-500/10' },
  [UrgencyLevel.CAN_WAIT]: { label: 'Can Wait', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  [UrgencyLevel.NOT_URGENT]: { label: 'Not Urgent', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
};

export interface PlanItem {
  id: string;
  planId: string;
  inventoryItemId: string | null; // null for manually added items not yet in inventory
  name: string;
  quantity: number;
  unit: string;
  brand: string | null;
  packSize: string | null;
  unitPrice: number | null;
  totalPrice: number | null;
  source: PlanItemSource;
  urgency: UrgencyLevel;
  isSubstitution: boolean;
  originalBrand?: string; // if substituted, what was the original
  remainingDays: number | null;
}

export interface ShoppingPlan {
  id: string;
  householdId: string;
  monthYear: string; // e.g., "September 2026"
  status: PlanStatus;
  items: PlanItem[];
  totalEstimate: number;
  generatedAt: string; // ISO date
  approvedAt: string | null;
  completedAt: string | null;
}

// Budget Guard (PRD §16)
export interface BudgetGuardInfo {
  monthlyTarget: number;
  planEstimate: number;
  difference: number; // positive = over budget
  isOverBudget: boolean;
  suggestions: BudgetSuggestion[];
}

export interface BudgetSuggestion {
  id: string;
  itemId: string;
  itemName: string;
  currentBrand: string;
  suggestedBrand: string;
  currentPrice: number;
  suggestedPrice: number;
  savings: number;
  type: 'BRAND_SWITCH' | 'PACK_OPTIMIZE' | 'QUANTITY_REDUCE';
}

// Smart Savings (PRD §17)
export interface SmartSavingsInfo {
  standardTotal: number;
  optimizedTotal: number;
  potentialSavings: number;
  optimizations: PackOptimization[];
  isAvailable: boolean; // false if no real-time pricing data
}

export interface PackOptimization {
  id: string;
  itemName: string;
  currentSelection: string; // e.g., "2x 2.5kg (₹280)"
  optimizedSelection: string; // e.g., "1x 5kg bag (₹250)"
  savings: number;
}

// Forgotten Items (PRD §9)
export interface ForgottenItem {
  id: string;
  itemName: string;
  lastPurchasedDaysAgo: number;
  usualCycleDays: number;
  isOverdue: boolean;
}

// Co-Purchase Suggestion (PRD §10)
export interface CoPurchaseSuggestion {
  triggerItemName: string;
  suggestedItems: {
    name: string;
    isAlreadyInPlan: boolean;
  }[];
}

// Substitution (PRD §20)
export interface SubstitutionOption {
  id: string;
  originalItem: string;
  originalBrand: string;
  originalPrice: number;
  isOutOfStock: boolean;
  alternatives: SubstitutionAlternative[];
}

export interface SubstitutionAlternative {
  id: string;
  brand: string;
  packSize: string;
  price: number;
  priceDifference: number; // negative = cheaper
  rating: number;
  isInStock: boolean;
}

// Marketplace (PRD §22)
export enum Marketplace {
  AMAZON = 'AMAZON',
  BLINKIT = 'BLINKIT',
  ZEPTO = 'ZEPTO',
  BIGBASKET = 'BIGBASKET',
  FLIPKART = 'FLIPKART',
}

export const MARKETPLACE_CONFIG: Record<Marketplace, { name: string; logo: string; color: string }> = {
  [Marketplace.AMAZON]: { name: 'Amazon', logo: '🛍️', color: '#FF9900' },
  [Marketplace.BLINKIT]: { name: 'Blinkit', logo: '⚡', color: '#F8CB46' },
  [Marketplace.ZEPTO]: { name: 'Zepto', logo: '🚀', color: '#7B2FF7' },
  [Marketplace.BIGBASKET]: { name: 'BigBasket', logo: '🧺', color: '#84C225' },
  [Marketplace.FLIPKART]: { name: 'Flipkart', logo: '🛒', color: '#2874F0' },
};
