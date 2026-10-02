// ============================================================================
// HomeSense — App Configuration
// ============================================================================
// Central config file. Change API_BASE_URL when backend is ready.
// Feature flags control which features are visible in the UI.
// ============================================================================

export const APP_CONFIG = {
  name: 'HomeSense',
  tagline: 'Intelligent Household Replenishment',
  version: '0.1.0',

  // ── API Configuration ──
  // Change this when your backend is ready
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1',
    timeout: 10000, // ms
    useMockData: process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false', // defaults to true
  },

  // ── Feature Flags ──
  // Toggle features on/off for hackathon demo or phased rollout
  features: {
    weatherIntegration: true,
    marketplaceSync: true,
    alexaVoice: false, // Phase 6
    smartSavings: true,
    anomalyDetection: true,
    coPurchase: true,
    forgottenItems: true,
    budgetGuard: true,
    notifications: true,
    analytics: true,
  },

  // ── Default Values ──
  defaults: {
    currency: 'INR',
    currencySymbol: '₹',
    monthlyBudget: 5000,
    predictionWindowDays: 7, // show items running low within N days
    maxActionCards: 3, // max smart action cards on dashboard
  },

  // ── Thresholds ──
  thresholds: {
    runningLowDays: 3,        // 🔴 status if ≤ N days remaining
    upcomingDays: 7,          // 🟡 status if ≤ N days remaining
    budgetWarningPercent: 70, // 🟡 budget at 70%
    budgetDangerPercent: 90,  // 🔴 budget at 90%
    anomalyThresholdPercent: 40, // flag if consumption is 40%+ faster than baseline
    autoSuppressSuggestionAfter: 4, // stop suggesting items skipped N+ times
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
