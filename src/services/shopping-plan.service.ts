// ============================================================================
// HomeSense — Shopping Plan Service
// ============================================================================
import { delay } from '@/lib/utils';
import {
  mockShoppingPlan,
  mockBudgetGuard,
  mockSmartSavings,
  mockForgottenItems,
  mockCoPurchaseSuggestions,
  mockSubstitutions,
} from '@/data/mock/shopping-plan.mock';
import type {
  ShoppingPlan,
  PlanItem,
  BudgetGuardInfo,
  SmartSavingsInfo,
  ForgottenItem,
  CoPurchaseSuggestion,
  SubstitutionOption,
  PlanStatus,
} from '@/types';

const MOCK_DELAY = 400;

/** GET /shopping-plan/current */
export async function getCurrentPlan(): Promise<ShoppingPlan> {
  await delay(MOCK_DELAY);
  return { ...mockShoppingPlan, items: [...mockShoppingPlan.items] };
}

/** POST /shopping-plan/generate */
export async function generatePlan(): Promise<ShoppingPlan> {
  await delay(1500); // plan generation takes longer
  return { ...mockShoppingPlan, items: [...mockShoppingPlan.items] };
}

/** PUT /shopping-plan/{id}/items/{itemId} */
export async function updatePlanItem(planId: string, itemId: string, updates: Partial<PlanItem>): Promise<PlanItem> {
  await delay(300);
  const item = mockShoppingPlan.items.find((i) => i.id === itemId);
  if (!item) throw new Error(`Plan item ${itemId} not found`);
  return { ...item, ...updates };
}

/** DELETE /shopping-plan/{id}/items/{itemId} */
export async function removePlanItem(planId: string, itemId: string): Promise<void> {
  await delay(200);
}

/** POST /shopping-plan/{id}/items */
export async function addPlanItem(planId: string, item: Omit<PlanItem, 'id' | 'planId'>): Promise<PlanItem> {
  await delay(300);
  return { ...item, id: `pi-${Date.now()}`, planId };
}

/** POST /shopping-plan/{id}/approve */
export async function approvePlan(planId: string): Promise<ShoppingPlan> {
  await delay(500);
  return { ...mockShoppingPlan, status: 'APPROVED' as PlanStatus, approvedAt: new Date().toISOString() };
}

/** GET /shopping-plan/{id}/budget-guard */
export async function getBudgetGuard(planId: string): Promise<BudgetGuardInfo> {
  await delay(MOCK_DELAY);
  return { ...mockBudgetGuard };
}

/** GET /shopping-plan/{id}/smart-savings */
export async function getSmartSavings(planId: string): Promise<SmartSavingsInfo> {
  await delay(MOCK_DELAY);
  return { ...mockSmartSavings };
}

/** GET /shopping-plan/{id}/forgotten-items */
export async function getForgottenItems(planId: string): Promise<ForgottenItem[]> {
  await delay(MOCK_DELAY);
  return [...mockForgottenItems];
}

/** GET /shopping-plan/{id}/co-suggestions */
export async function getCoPurchaseSuggestions(planId: string): Promise<CoPurchaseSuggestion[]> {
  await delay(MOCK_DELAY);
  return [...mockCoPurchaseSuggestions];
}

/** GET /shopping-plan/{id}/substitutions */
export async function getSubstitutions(planId: string): Promise<SubstitutionOption[]> {
  await delay(MOCK_DELAY);
  return [...mockSubstitutions];
}
