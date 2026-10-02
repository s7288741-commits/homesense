// ============================================================================
// HomeSense — Memory Service
// ============================================================================
import { delay } from '@/lib/utils';
import {
  mockConsumptionStats,
  mockConsumptionHistory,
  mockMonthlySpending,
  mockTopExpenses,
  mockSpendingComparison,
  mockBrandPreferences,
  mockSubstitutionRecords,
  mockCoPurchaseRules,
  mockForgottenPatterns,
  mockSkippedPatterns,
  mockEvents,
  mockEventImpacts,
  mockAnomalies,
  mockPlanHistory,
} from '@/data/mock/memory.mock';
import type {
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
  EventImpact,
  Anomaly,
  AnomalyReason,
  PlanHistoryEntry,
} from '@/types';

const MOCK_DELAY = 400;

// ── Consumption ──

/** GET /memory/consumption-stats */
export async function getConsumptionStats(): Promise<ConsumptionStat[]> {
  await delay(MOCK_DELAY);
  return [...mockConsumptionStats];
}

/** GET /memory/consumption-history/{itemId} */
export async function getConsumptionHistory(itemId?: string): Promise<ItemConsumptionHistory[]> {
  await delay(MOCK_DELAY);
  if (itemId) return mockConsumptionHistory.filter((h) => h.itemId === itemId);
  return [...mockConsumptionHistory];
}

// ── Spending ──

/** GET /memory/spending */
export async function getMonthlySpending(): Promise<MonthlySpending[]> {
  await delay(MOCK_DELAY);
  return [...mockMonthlySpending];
}

/** GET /memory/top-expenses */
export async function getTopExpenses(): Promise<TopExpenseItem[]> {
  await delay(MOCK_DELAY);
  return [...mockTopExpenses];
}

/** GET /memory/spending-comparison */
export async function getSpendingComparison(): Promise<SpendingComparison> {
  await delay(MOCK_DELAY);
  return { ...mockSpendingComparison };
}

// ── Preferences ──

/** GET /memory/brand-preferences */
export async function getBrandPreferences(): Promise<BrandPreference[]> {
  await delay(MOCK_DELAY);
  return [...mockBrandPreferences];
}

/** GET /memory/substitution-history */
export async function getSubstitutionHistory(): Promise<SubstitutionRecord[]> {
  await delay(MOCK_DELAY);
  return [...mockSubstitutionRecords];
}

// ── Patterns ──

/** GET /memory/co-purchase-rules */
export async function getCoPurchaseRules(): Promise<CoPurchaseRule[]> {
  await delay(MOCK_DELAY);
  return [...mockCoPurchaseRules];
}

/** GET /memory/forgotten-patterns */
export async function getForgottenPatterns(): Promise<ForgottenPattern[]> {
  await delay(MOCK_DELAY);
  return [...mockForgottenPatterns];
}

/** GET /memory/skipped-patterns */
export async function getSkippedPatterns(): Promise<SkippedPattern[]> {
  await delay(MOCK_DELAY);
  return [...mockSkippedPatterns];
}

// ── Events ──

/** GET /events?household_id={id} */
export async function getEvents(): Promise<HouseholdEvent[]> {
  await delay(MOCK_DELAY);
  return [...mockEvents];
}

/** GET /events/impacts */
export async function getEventImpacts(): Promise<EventImpact[]> {
  await delay(MOCK_DELAY);
  return [...mockEventImpacts];
}

/** POST /events */
export async function createEvent(event: Omit<HouseholdEvent, 'id'>): Promise<HouseholdEvent> {
  await delay(MOCK_DELAY);
  return { ...event, id: `evt-${Date.now()}` };
}

// ── Anomalies ──

/** GET /anomalies?household_id={id} */
export async function getAnomalies(): Promise<Anomaly[]> {
  await delay(MOCK_DELAY);
  return [...mockAnomalies];
}

/** POST /anomalies/{id}/explain */
export async function explainAnomaly(anomalyId: string, reason: AnomalyReason, detail?: string): Promise<Anomaly> {
  await delay(MOCK_DELAY);
  const anomaly = mockAnomalies.find((a) => a.id === anomalyId);
  if (!anomaly) throw new Error(`Anomaly ${anomalyId} not found`);
  const action = reason === 'NORMAL_VARIANCE' ? 'INCORPORATED' : 'ISOLATED';
  return { ...anomaly, reason, reasonDetail: detail ?? null, action: action as Anomaly['action'] };
}

// ── Plan History ──

/** GET /shopping-plans/history */
export async function getPlanHistory(): Promise<PlanHistoryEntry[]> {
  await delay(MOCK_DELAY);
  return [...mockPlanHistory];
}
