// ============================================================================
// HomeSense — Memory & Analytics Types
// ============================================================================
// Defines: Consumption stats, Spending analytics, Preferences, Patterns,
//          Events, Anomalies, and Plan History.
// Primary page: Household Memory. Summaries in Dashboard.
// ============================================================================

// ── Consumption Analytics (PRD §4, §5, §24) ──

export interface ConsumptionStat {
  itemId: string;
  itemName: string;
  avgDurationDays: number;
  durationRange: { min: number; max: number };
  avgQuantityPerCycle: number;
  unit: string;
  trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  trendPercentage: number; // e.g., +12% or -5%
  cycleCount: number; // how many cycles of data
}

export interface ConsumptionChartPoint {
  month: string; // e.g., "Apr 2026"
  durationDays: number;
  quantity: number;
}

export interface ItemConsumptionHistory {
  itemId: string;
  itemName: string;
  dataPoints: ConsumptionChartPoint[];
}

// ── Spending Analytics (PRD §24) ──

export interface MonthlySpending {
  month: string; // e.g., "Sep 2026"
  totalSpent: number;
  budget: number;
  withinBudget: boolean;
  categoryBreakdown: CategorySpending[];
}

export interface CategorySpending {
  category: string;
  amount: number;
  percentage: number;
  color: string; // for chart rendering
}

export interface TopExpenseItem {
  itemName: string;
  costPerCycle: number;
  estimatedYearlyCost: number;
  category: string;
}

export interface SpendingComparison {
  currentMonth: number;
  previousMonth: number;
  difference: number;
  percentChange: number;
}

// ── Preferences (PRD §21) ──

export interface BrandPreference {
  itemName: string;
  preferredBrand: string;
  timesChosen: number;
  totalChoices: number;
  confidence: number; // 0-1, how sure the system is
  previousBrand?: string; // if brand was recently switched
  lastChosenBy?: string;
}

export interface PackSizePreference {
  itemName: string;
  preferredSize: string;
  unit: string;
}

export interface SubstitutionRecord {
  id: string;
  itemName: string;
  originalBrand: string;
  substitutedBrand: string;
  timesSubstituted: number;
  isNowDefault: boolean; // true if system updated the baseline
  date: string;
}

// ── Patterns (PRD §9, §10) ──

export interface CoPurchaseRule {
  primaryItem: string;
  associatedItems: string[];
  strength: number; // 0-1, how often they're bought together
}

export interface ForgottenPattern {
  itemName: string;
  timesForgotten: number;
  totalCycles: number;
  forgottenPercentage: number;
}

export interface SkippedPattern {
  itemName: string;
  timesSkipped: number;
  timesSuggested: number;
  skippedPercentage: number;
  isAutoSuppressed: boolean; // system stopped suggesting
}

// ── Events (PRD §8) ──

export enum EventType {
  FESTIVAL = 'FESTIVAL',
  GUESTS = 'GUESTS',
  TRAVEL = 'TRAVEL',
  PARTY = 'PARTY',
  FAMILY_VISIT = 'FAMILY_VISIT',
  CUSTOM = 'CUSTOM',
}

export const EVENT_TYPE_CONFIG: Record<EventType, { label: string; icon: string }> = {
  [EventType.FESTIVAL]: { label: 'Festival', icon: '🎉' },
  [EventType.GUESTS]: { label: 'Guests', icon: '👥' },
  [EventType.TRAVEL]: { label: 'Travel', icon: '✈️' },
  [EventType.PARTY]: { label: 'Party', icon: '🎂' },
  [EventType.FAMILY_VISIT]: { label: 'Family Visit', icon: '👨‍👩‍👧‍👦' },
  [EventType.CUSTOM]: { label: 'Custom', icon: '📌' },
};

export interface HouseholdEvent {
  id: string;
  householdId: string;
  name: string;
  type: EventType;
  startDate: string; // ISO
  endDate: string; // ISO
  guestCount: number;
  additionalItems: EventAdditionalItem[];
  isUpcoming: boolean;
}

export interface EventAdditionalItem {
  itemName: string;
  additionalQuantity: number;
  unit: string;
  reason: string; // e.g., "6 guests × 3 days"
}

export interface EventImpact {
  eventId: string;
  eventName: string;
  date: string;
  impactByCategory: {
    category: string;
    percentageIncrease: number;
  }[];
  budgetImpact: number; // additional spend
}

// ── Anomalies (PRD §7) ──

export enum AnomalyReason {
  GUESTS = 'GUESTS',
  FESTIVAL = 'FESTIVAL',
  MORE_MEMBERS = 'MORE_MEMBERS',
  LESS_PURCHASED = 'LESS_PURCHASED',
  NORMAL_VARIANCE = 'NORMAL_VARIANCE',
  OTHER = 'OTHER',
}

export const ANOMALY_REASON_LABELS: Record<AnomalyReason, string> = {
  [AnomalyReason.GUESTS]: 'Guests at home',
  [AnomalyReason.FESTIVAL]: 'Festival / Event',
  [AnomalyReason.MORE_MEMBERS]: 'More family members present',
  [AnomalyReason.LESS_PURCHASED]: 'Purchased less than usual',
  [AnomalyReason.NORMAL_VARIANCE]: 'Normal consumption variance',
  [AnomalyReason.OTHER]: 'Other',
};

export interface Anomaly {
  id: string;
  itemId: string;
  itemName: string;
  normalDurationDays: number;
  actualDurationDays: number;
  detectedAt: string; // ISO
  reason: AnomalyReason | null; // null if not yet explained
  reasonDetail: string | null; // free text for "Other"
  action: 'ISOLATED' | 'INCORPORATED' | 'PENDING'; // how it was handled
}

// ── Plan History (PRD §15) ──

export interface PlanHistoryEntry {
  id: string;
  monthYear: string;
  itemCount: number;
  totalSpent: number;
  budgetTarget: number;
  withinBudget: boolean;
  status: 'COMPLETED' | 'ACTIVE';
  completedAt: string | null;
}

// ── Weather (PRD §13) ──

export interface WeatherForecast {
  date: string;
  condition: 'CLEAR' | 'CLOUDY' | 'RAIN' | 'HEAVY_RAIN' | 'STORM';
  temperature: number;
  icon: string;
  description: string;
}

export interface ShoppingWindow {
  suggestedDate: string;
  suggestedTimeSlot: string; // e.g., "Thursday morning"
  reasoning: string;
  weatherForecast: WeatherForecast[];
}

// ── Notifications (PRD §11) ──

export enum NotificationType {
  RUNNING_LOW = 'RUNNING_LOW',
  ANOMALY = 'ANOMALY',
  DAILY_SUMMARY = 'DAILY_SUMMARY',
  WEEKLY_FORECAST = 'WEEKLY_FORECAST',
  MONTHLY_PLAN = 'MONTHLY_PLAN',
  EVENT_REMINDER = 'EVENT_REMINDER',
  FORGOTTEN_ITEM = 'FORGOTTEN_ITEM',
  WEATHER_ALERT = 'WEATHER_ALERT',
  BUDGET_WARNING = 'BUDGET_WARNING',
}

export const NOTIFICATION_PRIORITY: Record<NotificationType, number> = {
  [NotificationType.ANOMALY]: 1,
  [NotificationType.RUNNING_LOW]: 2,
  [NotificationType.BUDGET_WARNING]: 3,
  [NotificationType.EVENT_REMINDER]: 4,
  [NotificationType.FORGOTTEN_ITEM]: 5,
  [NotificationType.MONTHLY_PLAN]: 6,
  [NotificationType.WEATHER_ALERT]: 7,
  [NotificationType.DAILY_SUMMARY]: 8,
  [NotificationType.WEEKLY_FORECAST]: 9,
};

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string; // deep link to relevant page
  actionLabel?: string;
}

// ── Dashboard Smart Action Cards (PRD §9, §10, §11, §12) ──

export enum ActionCardType {
  FORGOTTEN_ITEM = 'FORGOTTEN_ITEM',
  CO_PURCHASE = 'CO_PURCHASE',
  BUY_NOW_VS_WAIT = 'BUY_NOW_VS_WAIT',
  ANOMALY_ALERT = 'ANOMALY_ALERT',
  EVENT_REMINDER = 'EVENT_REMINDER',
}

export interface SmartActionCard {
  id: string;
  type: ActionCardType;
  priority: number; // lower = more important
  title: string;
  message: string;
  actions: {
    label: string;
    variant: 'primary' | 'secondary' | 'ghost';
    actionId: string;
  }[];
  isDismissed: boolean;
  relatedItemIds?: string[];
}
