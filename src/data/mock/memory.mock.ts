// ============================================================================
// HomeSense — Mock Household Memory Data
// ============================================================================
// Analytics, patterns, events, anomalies, and plan history.
// Powers the Household Memory page's 7 tabs.
// ============================================================================

import {
  ConsumptionStat,
  ItemConsumptionHistory,
  MonthlySpending,
  TopExpenseItem,
  SpendingComparison,
  BrandPreference,
  SubstitutionRecord,
  CoPurchaseRule,
  ForgottenPattern,
  SkippedPattern,
  HouseholdEvent,
  EventType,
  EventImpact,
  Anomaly,
  AnomalyReason,
  PlanHistoryEntry,
} from '@/types';

// ── Consumption Stats ──

export const mockConsumptionStats: ConsumptionStat[] = [
  {
    itemId: 'inv-001',
    itemName: 'Rice (Basmati)',
    avgDurationDays: 29.4,
    durationRange: { min: 27, max: 32 },
    avgQuantityPerCycle: 5,
    unit: 'kg',
    trend: 'STABLE',
    trendPercentage: 2,
    cycleCount: 7,
  },
  {
    itemId: 'inv-007',
    itemName: 'Milk',
    avgDurationDays: 3.2,
    durationRange: { min: 2, max: 5 },
    avgQuantityPerCycle: 2,
    unit: 'L',
    trend: 'INCREASING',
    trendPercentage: 12,
    cycleCount: 28,
  },
  {
    itemId: 'inv-003',
    itemName: 'Cooking Oil',
    avgDurationDays: 26.8,
    durationRange: { min: 24, max: 30 },
    avgQuantityPerCycle: 2,
    unit: 'L',
    trend: 'STABLE',
    trendPercentage: -3,
    cycleCount: 7,
  },
  {
    itemId: 'inv-011',
    itemName: 'Detergent Powder',
    avgDurationDays: 28.5,
    durationRange: { min: 25, max: 32 },
    avgQuantityPerCycle: 3,
    unit: 'kg',
    trend: 'INCREASING',
    trendPercentage: 8,
    cycleCount: 7,
  },
  {
    itemId: 'inv-006',
    itemName: 'Tea Powder',
    avgDurationDays: 19.8,
    durationRange: { min: 17, max: 22 },
    avgQuantityPerCycle: 500,
    unit: 'g',
    trend: 'STABLE',
    trendPercentage: 1,
    cycleCount: 10,
  },
  {
    itemId: 'inv-015',
    itemName: 'Shampoo',
    avgDurationDays: 38.2,
    durationRange: { min: 35, max: 42 },
    avgQuantityPerCycle: 1,
    unit: 'bottle',
    trend: 'DECREASING',
    trendPercentage: -5,
    cycleCount: 5,
  },
];

export const mockConsumptionHistory: ItemConsumptionHistory[] = [
  {
    itemId: 'inv-001',
    itemName: 'Rice (Basmati)',
    dataPoints: [
      { month: 'Apr 2026', durationDays: 31, quantity: 5 },
      { month: 'May 2026', durationDays: 29, quantity: 5 },
      { month: 'Jun 2026', durationDays: 30, quantity: 5 },
      { month: 'Jul 2026', durationDays: 27, quantity: 5 },
      { month: 'Aug 2026', durationDays: 32, quantity: 5 },
      { month: 'Sep 2026', durationDays: 17, quantity: 5 }, // anomaly
    ],
  },
  {
    itemId: 'inv-007',
    itemName: 'Milk',
    dataPoints: [
      { month: 'Apr 2026', durationDays: 4, quantity: 2 },
      { month: 'May 2026', durationDays: 3.5, quantity: 2 },
      { month: 'Jun 2026', durationDays: 3, quantity: 2 },
      { month: 'Jul 2026', durationDays: 3, quantity: 2 },
      { month: 'Aug 2026', durationDays: 2.5, quantity: 2 },
      { month: 'Sep 2026', durationDays: 3, quantity: 2 },
    ],
  },
];

// ── Spending Analytics ──

export const mockMonthlySpending: MonthlySpending[] = [
  {
    month: 'Apr 2026',
    totalSpent: 4200,
    budget: 5000,
    withinBudget: true,
    categoryBreakdown: [
      { category: 'Grocery', amount: 1890, percentage: 45, color: '#10B981' },
      { category: 'Personal Care', amount: 924, percentage: 22, color: '#8B5CF6' },
      { category: 'Cleaning', amount: 756, percentage: 18, color: '#3B82F6' },
      { category: 'Snacks', amount: 630, percentage: 15, color: '#F59E0B' },
    ],
  },
  {
    month: 'May 2026',
    totalSpent: 3800,
    budget: 5000,
    withinBudget: true,
    categoryBreakdown: [
      { category: 'Grocery', amount: 1710, percentage: 45, color: '#10B981' },
      { category: 'Personal Care', amount: 836, percentage: 22, color: '#8B5CF6' },
      { category: 'Cleaning', amount: 684, percentage: 18, color: '#3B82F6' },
      { category: 'Snacks', amount: 570, percentage: 15, color: '#F59E0B' },
    ],
  },
  {
    month: 'Jun 2026',
    totalSpent: 4500,
    budget: 5000,
    withinBudget: true,
    categoryBreakdown: [
      { category: 'Grocery', amount: 2025, percentage: 45, color: '#10B981' },
      { category: 'Personal Care', amount: 990, percentage: 22, color: '#8B5CF6' },
      { category: 'Cleaning', amount: 810, percentage: 18, color: '#3B82F6' },
      { category: 'Snacks', amount: 675, percentage: 15, color: '#F59E0B' },
    ],
  },
  {
    month: 'Jul 2026',
    totalSpent: 5800,
    budget: 5000,
    withinBudget: false,
    categoryBreakdown: [
      { category: 'Grocery', amount: 2610, percentage: 45, color: '#10B981' },
      { category: 'Personal Care', amount: 1276, percentage: 22, color: '#8B5CF6' },
      { category: 'Cleaning', amount: 1044, percentage: 18, color: '#3B82F6' },
      { category: 'Snacks', amount: 870, percentage: 15, color: '#F59E0B' },
    ],
  },
  {
    month: 'Aug 2026',
    totalSpent: 4100,
    budget: 5000,
    withinBudget: true,
    categoryBreakdown: [
      { category: 'Grocery', amount: 1845, percentage: 45, color: '#10B981' },
      { category: 'Personal Care', amount: 902, percentage: 22, color: '#8B5CF6' },
      { category: 'Cleaning', amount: 738, percentage: 18, color: '#3B82F6' },
      { category: 'Snacks', amount: 615, percentage: 15, color: '#F59E0B' },
    ],
  },
  {
    month: 'Sep 2026',
    totalSpent: 3680,
    budget: 5000,
    withinBudget: true,
    categoryBreakdown: [
      { category: 'Grocery', amount: 1656, percentage: 45, color: '#10B981' },
      { category: 'Personal Care', amount: 810, percentage: 22, color: '#8B5CF6' },
      { category: 'Cleaning', amount: 662, percentage: 18, color: '#3B82F6' },
      { category: 'Snacks', amount: 552, percentage: 15, color: '#F59E0B' },
    ],
  },
];

export const mockTopExpenses: TopExpenseItem[] = [
  { itemName: 'Detergent Powder', costPerCycle: 540, estimatedYearlyCost: 6480, category: 'Cleaning' },
  { itemName: 'Shampoo', costPerCycle: 480, estimatedYearlyCost: 4320, category: 'Personal Care' },
  { itemName: 'Rice (Basmati)', costPerCycle: 450, estimatedYearlyCost: 5400, category: 'Grocery' },
  { itemName: 'Wheat Flour', costPerCycle: 420, estimatedYearlyCost: 5040, category: 'Grocery' },
  { itemName: 'Spice Box', costPerCycle: 350, estimatedYearlyCost: 2100, category: 'Essentials' },
];

export const mockSpendingComparison: SpendingComparison = {
  currentMonth: 3680,
  previousMonth: 4100,
  difference: -420,
  percentChange: -10.2,
};

// ── Preferences ──

export const mockBrandPreferences: BrandPreference[] = [
  { itemName: 'Rice (Basmati)', preferredBrand: 'India Gate', timesChosen: 7, totalChoices: 7, confidence: 1.0 },
  { itemName: 'Cooking Oil', preferredBrand: 'Fortune', timesChosen: 5, totalChoices: 6, confidence: 0.83 },
  { itemName: 'Shampoo', preferredBrand: 'Dove', timesChosen: 3, totalChoices: 3, confidence: 1.0, previousBrand: 'Head & Shoulders' },
  { itemName: 'Detergent', preferredBrand: 'Surf Excel', timesChosen: 6, totalChoices: 7, confidence: 0.86 },
  { itemName: 'Tea Powder', preferredBrand: 'Tata Gold', timesChosen: 9, totalChoices: 10, confidence: 0.9 },
  { itemName: 'Toothpaste', preferredBrand: 'Colgate', timesChosen: 4, totalChoices: 5, confidence: 0.8 },
];

export const mockSubstitutionRecords: SubstitutionRecord[] = [
  {
    id: 'sr-001',
    itemName: 'Shampoo',
    originalBrand: 'Head & Shoulders',
    substitutedBrand: 'Dove',
    timesSubstituted: 3,
    isNowDefault: true,
    date: '2026-09-01T00:00:00Z',
  },
  {
    id: 'sr-002',
    itemName: 'Dal (Toor)',
    originalBrand: 'Tata Sampann',
    substitutedBrand: 'Fortune',
    timesSubstituted: 1,
    isNowDefault: false,
    date: '2026-08-15T00:00:00Z',
  },
];

// ── Patterns ──

export const mockCoPurchaseRules: CoPurchaseRule[] = [
  { primaryItem: 'Rice (Basmati)', associatedItems: ['Dal (Toor)', 'Cooking Oil', 'Sugar'], strength: 0.92 },
  { primaryItem: 'Tea Powder', associatedItems: ['Sugar', 'Milk'], strength: 0.85 },
  { primaryItem: 'Shampoo', associatedItems: ['Soap'], strength: 0.78 },
  { primaryItem: 'Detergent', associatedItems: ['Floor Cleaner', 'Dish Soap'], strength: 0.72 },
  { primaryItem: 'Bread', associatedItems: ['Milk', 'Butter'], strength: 0.68 },
];

export const mockForgottenPatterns: ForgottenPattern[] = [
  { itemName: 'Toothpaste', timesForgotten: 3, totalCycles: 7, forgottenPercentage: 43 },
  { itemName: 'Floor Cleaner', timesForgotten: 2, totalCycles: 7, forgottenPercentage: 29 },
  { itemName: 'Batteries (AA)', timesForgotten: 2, totalCycles: 7, forgottenPercentage: 29 },
];

export const mockSkippedPatterns: SkippedPattern[] = [
  { itemName: 'Mouthwash', timesSkipped: 4, timesSuggested: 5, skippedPercentage: 80, isAutoSuppressed: true },
  { itemName: 'Paper Towels', timesSkipped: 3, timesSuggested: 4, skippedPercentage: 75, isAutoSuppressed: false },
];

// ── Events ──

export const mockEvents: HouseholdEvent[] = [
  {
    id: 'evt-001',
    householdId: 'hh-001',
    name: 'Diwali Gathering',
    type: EventType.FESTIVAL,
    startDate: '2026-10-15T00:00:00Z',
    endDate: '2026-10-17T00:00:00Z',
    guestCount: 6,
    additionalItems: [
      { itemName: 'Rice (Basmati)', additionalQuantity: 2, unit: 'kg', reason: '6 guests × 3 days' },
      { itemName: 'Extra Snacks', additionalQuantity: 3, unit: 'packets', reason: 'Festival snacking' },
      { itemName: 'Milk', additionalQuantity: 2, unit: 'L', reason: 'Additional chai/sweets' },
    ],
    isUpcoming: true,
  },
  {
    id: 'evt-002',
    householdId: 'hh-001',
    name: 'Birthday Party',
    type: EventType.PARTY,
    startDate: '2026-08-10T00:00:00Z',
    endDate: '2026-08-12T00:00:00Z',
    guestCount: 6,
    additionalItems: [],
    isUpcoming: false,
  },
  {
    id: 'evt-003',
    householdId: 'hh-001',
    name: 'Family Visit',
    type: EventType.FAMILY_VISIT,
    startDate: '2026-07-01T00:00:00Z',
    endDate: '2026-07-14T00:00:00Z',
    guestCount: 4,
    additionalItems: [],
    isUpcoming: false,
  },
];

export const mockEventImpacts: EventImpact[] = [
  {
    eventId: 'evt-002',
    eventName: 'Birthday Party',
    date: '2026-08-10T00:00:00Z',
    impactByCategory: [
      { category: 'Snacks', percentageIncrease: 150 },
      { category: 'Food & Beverages', percentageIncrease: 200 },
    ],
    budgetImpact: 450,
  },
  {
    eventId: 'evt-003',
    eventName: 'Family Visit',
    date: '2026-07-01T00:00:00Z',
    impactByCategory: [
      { category: 'Grocery', percentageIncrease: 40 },
      { category: 'Personal Care', percentageIncrease: 30 },
      { category: 'Snacks', percentageIncrease: 60 },
    ],
    budgetImpact: 800,
  },
];

// ── Anomalies ──

export const mockAnomalies: Anomaly[] = [
  {
    id: 'anom-001',
    itemId: 'inv-011',
    itemName: 'Detergent Powder',
    normalDurationDays: 30,
    actualDurationDays: 17,
    detectedAt: '2026-09-28T00:00:00Z',
    reason: null,
    reasonDetail: null,
    action: 'PENDING',
  },
  {
    id: 'anom-002',
    itemId: 'inv-001',
    itemName: 'Rice (Basmati)',
    normalDurationDays: 30,
    actualDurationDays: 17,
    detectedAt: '2026-09-17T00:00:00Z',
    reason: AnomalyReason.GUESTS,
    reasonDetail: null,
    action: 'ISOLATED',
  },
  {
    id: 'anom-003',
    itemId: 'inv-003',
    itemName: 'Cooking Oil',
    normalDurationDays: 28,
    actualDurationDays: 12,
    detectedAt: '2026-08-22T00:00:00Z',
    reason: AnomalyReason.NORMAL_VARIANCE,
    reasonDetail: null,
    action: 'INCORPORATED',
  },
];

// ── Plan History ──

export const mockPlanHistory: PlanHistoryEntry[] = [
  { id: 'plan-001', monthYear: 'Oct 2026', itemCount: 12, totalSpent: 3680, budgetTarget: 5000, withinBudget: true, status: 'ACTIVE', completedAt: null },
  { id: 'plan-prev-001', monthYear: 'Sep 2026', itemCount: 14, totalSpent: 4100, budgetTarget: 5000, withinBudget: true, status: 'COMPLETED', completedAt: '2026-09-28T00:00:00Z' },
  { id: 'plan-prev-002', monthYear: 'Aug 2026', itemCount: 11, totalSpent: 3800, budgetTarget: 5000, withinBudget: true, status: 'COMPLETED', completedAt: '2026-08-29T00:00:00Z' },
  { id: 'plan-prev-003', monthYear: 'Jul 2026', itemCount: 18, totalSpent: 5800, budgetTarget: 5000, withinBudget: false, status: 'COMPLETED', completedAt: '2026-07-30T00:00:00Z' },
  { id: 'plan-prev-004', monthYear: 'Jun 2026', itemCount: 11, totalSpent: 3400, budgetTarget: 5000, withinBudget: true, status: 'COMPLETED', completedAt: '2026-06-28T00:00:00Z' },
  { id: 'plan-prev-005', monthYear: 'May 2026', itemCount: 13, totalSpent: 3950, budgetTarget: 5000, withinBudget: true, status: 'COMPLETED', completedAt: '2026-05-29T00:00:00Z' },
  { id: 'plan-prev-006', monthYear: 'Apr 2026', itemCount: 12, totalSpent: 4200, budgetTarget: 5000, withinBudget: true, status: 'COMPLETED', completedAt: '2026-04-28T00:00:00Z' },
];
