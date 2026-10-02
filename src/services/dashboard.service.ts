// ============================================================================
// HomeSense — Dashboard Service
// ============================================================================
import { delay } from '@/lib/utils';
import { mockActionCards, mockShoppingWindow, mockNotifications } from '@/data/mock/dashboard.mock';
import { mockBudget } from '@/data/mock/household.mock';
import { mockInventoryHealthSummary } from '@/data/mock/inventory.mock';
import { mockShoppingPlan } from '@/data/mock/shopping-plan.mock';
import { mockMonthlySpending } from '@/data/mock/memory.mock';
import type {
  SmartActionCard,
  ShoppingWindow,
  AppNotification,
  InventoryHealthSummary,
  ShoppingPlan,
  MonthlySpending,
} from '@/types';
import type { HouseholdBudget } from '@/types';

const MOCK_DELAY = 300;

/** GET /dashboard/health-summary */
export async function getDashboardHealthSummary(): Promise<InventoryHealthSummary> {
  await delay(MOCK_DELAY);
  return { ...mockInventoryHealthSummary };
}

/** GET /dashboard/action-cards */
export async function getActionCards(): Promise<SmartActionCard[]> {
  await delay(MOCK_DELAY);
  return mockActionCards
    .filter((c) => !c.isDismissed)
    .sort((a, b) => a.priority - b.priority);
}

/** POST /dashboard/action-cards/{id}/dismiss */
export async function dismissActionCard(cardId: string): Promise<void> {
  await delay(200);
  // In real API, logs the dismissal to Memory Engine
}

/** GET /dashboard/budget */
export async function getDashboardBudget(): Promise<HouseholdBudget> {
  await delay(MOCK_DELAY);
  return { ...mockBudget };
}

/** GET /dashboard/weather */
export async function getDashboardWeather(): Promise<ShoppingWindow> {
  await delay(MOCK_DELAY);
  return { ...mockShoppingWindow };
}

/** GET /dashboard/plan-overview */
export async function getDashboardPlanOverview(): Promise<Pick<ShoppingPlan, 'id' | 'monthYear' | 'status' | 'totalEstimate' | 'generatedAt'> & { itemCount: number }> {
  await delay(MOCK_DELAY);
  return {
    id: mockShoppingPlan.id,
    monthYear: mockShoppingPlan.monthYear,
    status: mockShoppingPlan.status,
    totalEstimate: mockShoppingPlan.totalEstimate,
    generatedAt: mockShoppingPlan.generatedAt,
    itemCount: mockShoppingPlan.items.length,
  };
}

/** GET /dashboard/notifications */
export async function getNotifications(): Promise<AppNotification[]> {
  await delay(MOCK_DELAY);
  return [...mockNotifications];
}

/** GET /dashboard/analytics-summary */
export async function getAnalyticsSummary(): Promise<{
  spentThisMonth: number;
  itemsPurchased: number;
  shoppingTrips: number;
  savedThisMonth: number;
  categoryBreakdown: MonthlySpending['categoryBreakdown'];
}> {
  await delay(MOCK_DELAY);
  const currentMonth = mockMonthlySpending[mockMonthlySpending.length - 1];
  return {
    spentThisMonth: currentMonth.totalSpent,
    itemsPurchased: 34,
    shoppingTrips: 3,
    savedThisMonth: 440,
    categoryBreakdown: currentMonth.categoryBreakdown,
  };
}
