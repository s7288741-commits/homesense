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

const MOCK_DELAY = 200;

// State caches for interactive learning simulation
let liveBrandPreferences = [...mockBrandPreferences];
let liveSubstitutionRecords = [...mockSubstitutionRecords];

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

// ── Spending & Analytics ──

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

// ── Preferences & Preference Learning (PRD §21) ──

/** GET /memory/brand-preferences */
export async function getBrandPreferences(): Promise<BrandPreference[]> {
  await delay(MOCK_DELAY);
  return [...liveBrandPreferences];
}

/**
 * Record a member's brand choice (e.g. Mom repeatedly selecting Brand B instead of Brand A).
 * Automatically updates learned preference baseline and confidence score.
 */
export async function recordBrandChoice(
  itemName: string,
  selectedBrand: string,
  chosenByMember: string = 'Mom'
): Promise<BrandPreference> {
  await delay(MOCK_DELAY);
  const existingIdx = liveBrandPreferences.findIndex(
    (bp) => bp.itemName.toLowerCase() === itemName.toLowerCase()
  );

  if (existingIdx >= 0) {
    const existing = liveBrandPreferences[existingIdx];
    const isNewBrand = existing.preferredBrand !== selectedBrand;
    const newTimesChosen = isNewBrand ? 1 : existing.timesChosen + 1;
    const newTotalChoices = existing.totalChoices + 1;
    const newConfidence = Math.min(0.98, Number((newTimesChosen / newTotalChoices).toFixed(2)) + 0.1);

    const updated: BrandPreference = {
      ...existing,
      preferredBrand: selectedBrand,
      previousBrand: isNewBrand ? existing.preferredBrand : existing.previousBrand,
      timesChosen: newTimesChosen,
      totalChoices: newTotalChoices,
      confidence: newConfidence,
    };

    liveBrandPreferences[existingIdx] = updated;
    return updated;
  } else {
    const newPref: BrandPreference = {
      itemName,
      preferredBrand: selectedBrand,
      timesChosen: 1,
      totalChoices: 1,
      confidence: 0.85,
    };
    liveBrandPreferences.unshift(newPref);
    return newPref;
  }
}

/** GET /memory/substitution-history */
export async function getSubstitutionHistory(): Promise<SubstitutionRecord[]> {
  await delay(MOCK_DELAY);
  return [...liveSubstitutionRecords];
}

/** Record a product substitution choice when preferred item is unavailable */
export async function recordSubstitution(
  itemName: string,
  originalBrand: string,
  substitutedBrand: string
): Promise<SubstitutionRecord> {
  await delay(MOCK_DELAY);
  const newRec: SubstitutionRecord = {
    id: `sr-${Date.now()}`,
    itemName,
    originalBrand,
    substitutedBrand,
    timesSubstituted: 1,
    isNowDefault: false,
    date: new Date().toISOString(),
  };
  liveSubstitutionRecords.unshift(newRec);
  return newRec;
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
