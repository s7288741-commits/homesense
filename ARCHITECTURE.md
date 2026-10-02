# HomeSense — Frontend Architecture Guide

> **For the team**: Read this before touching any code. It explains WHY files are where they are.

## Core Principle: Service Layer Pattern

```
Page (UI) → Hook (data logic) → Service (API calls) → Mock Data (swappable)
```

When backend APIs are ready, you ONLY change files in `/src/services/`. Everything else stays the same.

## Folder Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (sidebar, header)
│   ├── page.tsx            # Dashboard (landing page)
│   ├── inventory/          # Inventory page
│   ├── shopping-plan/      # Shopping Plan page
│   └── household-memory/   # Household Memory page
│
├── components/             # All React components
│   ├── layout/             # App shell: Sidebar, Header
│   ├── ui/                 # Reusable primitives: Button, Modal, Badge, Card
│   ├── dashboard/          # Dashboard-specific widgets
│   ├── inventory/          # Inventory-specific components
│   ├── shopping-plan/      # Shopping Plan components
│   └── memory/             # Household Memory components
│
├── types/                  # TypeScript interfaces & enums
│   ├── household.ts        # Household, Member, Role types
│   ├── inventory.ts        # InventoryItem, Category, Status types
│   ├── shopping-plan.ts    # Plan, PlanItem, Substitution types
│   ├── memory.ts           # Analytics, Patterns, Anomaly types
│   └── index.ts            # Re-exports everything
│
├── services/               # API service layer (swap mock → real here)
│   ├── api.ts              # Base HTTP client config
│   ├── inventory.service.ts
│   ├── dashboard.service.ts
│   ├── shopping-plan.service.ts
│   ├── memory.service.ts
│   └── household.service.ts
│
├── data/                   # Mock data (remove when APIs are ready)
│   └── mock/
│       ├── inventory.mock.ts
│       ├── dashboard.mock.ts
│       ├── shopping-plan.mock.ts
│       ├── memory.mock.ts
│       └── household.mock.ts
│
├── hooks/                  # Custom React hooks (data fetching + logic)
│   ├── useInventory.ts
│   ├── useDashboard.ts
│   ├── useShoppingPlan.ts
│   ├── useMemory.ts
│   └── useHousehold.ts
│
├── lib/                    # Utilities & helpers
│   ├── utils.ts            # General utilities (cn, formatCurrency, etc.)
│   └── formatters.ts       # Date, currency, quantity formatters
│
└── config/                 # App configuration & constants
    ├── app.config.ts       # Feature flags, API base URL
    ├── navigation.ts       # Sidebar nav items
    └── categories.ts       # Item categories, units, status enums
```

## How to Swap Mock Data for Real APIs

1. Open the service file (e.g., `src/services/inventory.service.ts`)
2. Replace the mock import with an API call:

```typescript
// BEFORE (mock):
import { mockInventoryItems } from '@/data/mock/inventory.mock';
export const getInventoryItems = async () => mockInventoryItems;

// AFTER (real API):
export const getInventoryItems = async () => {
  const res = await apiClient.get('/inventory/items');
  return res.data;
};
```

3. That's it. No component changes needed.

## How to Add a New Feature

1. Define types in `src/types/`
2. Add mock data in `src/data/mock/`
3. Create service function in `src/services/`
4. Create custom hook in `src/hooks/`
5. Build component in `src/components/<section>/`
6. Wire it into the page in `src/app/`

## Naming Conventions

- Components: `PascalCase.tsx` (e.g., `ItemCard.tsx`)
- Hooks: `camelCase.ts` with `use` prefix (e.g., `useInventory.ts`)
- Services: `kebab-case.service.ts` (e.g., `inventory.service.ts`)
- Types: `PascalCase` for interfaces, `UPPER_CASE` for enums
- Mock data: `kebab-case.mock.ts`
