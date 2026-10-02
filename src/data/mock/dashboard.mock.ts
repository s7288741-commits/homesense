// ============================================================================
// HomeSense — Mock Dashboard Data
// ============================================================================
// Smart action cards, weather, and notification data for the Dashboard.
// ============================================================================

import {
  SmartActionCard,
  ActionCardType,
  WeatherForecast,
  ShoppingWindow,
  AppNotification,
  NotificationType,
} from '@/types';

export const mockActionCards: SmartActionCard[] = [
  {
    id: 'ac-001',
    type: ActionCardType.ANOMALY_ALERT,
    priority: 1,
    title: 'Unusual Consumption: Detergent',
    message: 'Detergent Powder consumed 43% faster than usual (17 days vs 30 days baseline).',
    actions: [
      { label: 'Explain Why', variant: 'primary', actionId: 'explain-anomaly-inv-011' },
      { label: 'Dismiss', variant: 'ghost', actionId: 'dismiss-ac-001' },
    ],
    isDismissed: false,
    relatedItemIds: ['inv-011'],
  },
  {
    id: 'ac-002',
    type: ActionCardType.FORGOTTEN_ITEM,
    priority: 5,
    title: '2 Items Missing from Your Cycle',
    message: 'Toothpaste and Floor Cleaner were expected in your last shopping cycle but weren\'t purchased.',
    actions: [
      { label: 'Add to Plan', variant: 'primary', actionId: 'add-forgotten-items' },
      { label: 'Not Needed', variant: 'ghost', actionId: 'dismiss-ac-002' },
    ],
    isDismissed: false,
    relatedItemIds: ['inv-014', 'inv-012'],
  },
  {
    id: 'ac-003',
    type: ActionCardType.EVENT_REMINDER,
    priority: 4,
    title: 'Diwali Gathering in 13 Days',
    message: '6 guests expected for 3 days. Review additional household requirements?',
    actions: [
      { label: 'Review Suggestions', variant: 'primary', actionId: 'review-event-evt-001' },
      { label: 'Dismiss', variant: 'ghost', actionId: 'dismiss-ac-003' },
    ],
    isDismissed: false,
  },
  {
    id: 'ac-004',
    type: ActionCardType.CO_PURCHASE,
    priority: 6,
    title: 'Usually Bought Together',
    message: 'Rice is in your plan. You usually also buy Dal and Oil together.',
    actions: [
      { label: 'Add Dal', variant: 'primary', actionId: 'add-co-dal' },
      { label: 'Not This Time', variant: 'ghost', actionId: 'dismiss-ac-004' },
    ],
    isDismissed: false,
    relatedItemIds: ['inv-001'],
  },
  {
    id: 'ac-005',
    type: ActionCardType.BUY_NOW_VS_WAIT,
    priority: 3,
    title: 'Oil Can Wait',
    message: 'Cooking Oil has 7-9 days remaining. Next shopping window is in 5 days — no rush.',
    actions: [
      { label: 'Buy Now Anyway', variant: 'secondary', actionId: 'buy-now-inv-003' },
      { label: 'Wait', variant: 'ghost', actionId: 'dismiss-ac-005' },
    ],
    isDismissed: false,
    relatedItemIds: ['inv-003'],
  },
];

export const mockWeatherForecast: WeatherForecast[] = [
  {
    date: '2026-10-02T00:00:00Z',
    condition: 'HEAVY_RAIN',
    temperature: 28,
    icon: '⛈️',
    description: 'Heavy rain 5-8 PM',
  },
  {
    date: '2026-10-03T00:00:00Z',
    condition: 'CLOUDY',
    temperature: 29,
    icon: '⛅',
    description: 'Partly cloudy',
  },
  {
    date: '2026-10-04T00:00:00Z',
    condition: 'CLEAR',
    temperature: 31,
    icon: '☀️',
    description: 'Clear & sunny',
  },
  {
    date: '2026-10-05T00:00:00Z',
    condition: 'CLEAR',
    temperature: 30,
    icon: '☀️',
    description: 'Mostly clear',
  },
  {
    date: '2026-10-06T00:00:00Z',
    condition: 'RAIN',
    temperature: 27,
    icon: '🌧️',
    description: 'Light showers',
  },
];

export const mockShoppingWindow: ShoppingWindow = {
  suggestedDate: '2026-10-04T00:00:00Z',
  suggestedTimeSlot: 'Saturday morning',
  reasoning: 'Clear weather, 3 items running low, aligns with weekend availability',
  weatherForecast: mockWeatherForecast,
};

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-001',
    type: NotificationType.RUNNING_LOW,
    title: 'Rice Running Low',
    message: 'Basmati Rice may run out in 2-3 days. Add to shopping plan?',
    isRead: false,
    createdAt: '2026-10-02T08:00:00Z',
    actionUrl: '/inventory',
    actionLabel: 'View in Inventory',
  },
  {
    id: 'notif-002',
    type: NotificationType.ANOMALY,
    title: 'Unusual Detergent Consumption',
    message: 'Detergent consumed 43% faster than baseline. Tap to explain why.',
    isRead: false,
    createdAt: '2026-10-01T18:00:00Z',
    actionUrl: '/inventory',
    actionLabel: 'Explain',
  },
  {
    id: 'notif-003',
    type: NotificationType.MONTHLY_PLAN,
    title: 'October Plan Ready',
    message: 'Your October shopping plan is ready for review. 12 items, est. ₹3,680.',
    isRead: false,
    createdAt: '2026-10-01T09:00:00Z',
    actionUrl: '/shopping-plan',
    actionLabel: 'Review Plan',
  },
  {
    id: 'notif-004',
    type: NotificationType.EVENT_REMINDER,
    title: 'Diwali Gathering Approaching',
    message: 'Your Diwali gathering is in 13 days. Review additional items for 6 guests.',
    isRead: true,
    createdAt: '2026-09-30T09:00:00Z',
    actionUrl: '/household-memory',
    actionLabel: 'Review',
  },
  {
    id: 'notif-005',
    type: NotificationType.WEATHER_ALERT,
    title: 'Rain Alert',
    message: 'Heavy rain expected today 5-8 PM. Consider shopping tomorrow morning.',
    isRead: true,
    createdAt: '2026-10-02T06:00:00Z',
  },
];
