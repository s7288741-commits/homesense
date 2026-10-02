// ============================================================================
// HomeSense — Mock Household Data
// ============================================================================
// Swap this with real API calls in household.service.ts when backend is ready.
// ============================================================================

import { Household, HouseholdBudget, MemberRole } from '@/types';

export const mockHousehold: Household = {
  id: 'hh-001',
  name: 'Marathe Household',
  members: [
    {
      id: 'mem-001',
      name: 'Prakash',
      email: 'prakash@example.com',
      role: MemberRole.ADMIN,
      avatarUrl: undefined,
      joinedAt: '2026-03-15T00:00:00Z',
    },
    {
      id: 'mem-002',
      name: 'Mom',
      email: 'mom@example.com',
      role: MemberRole.MEMBER,
      avatarUrl: undefined,
      joinedAt: '2026-03-15T00:00:00Z',
    },
    {
      id: 'mem-003',
      name: 'Dad',
      email: 'dad@example.com',
      role: MemberRole.MEMBER,
      avatarUrl: undefined,
      joinedAt: '2026-03-15T00:00:00Z',
    },
    {
      id: 'mem-004',
      name: 'Hreyal',
      email: 'hreyal@example.com',
      role: MemberRole.MEMBER,
      avatarUrl: undefined,
      joinedAt: '2026-04-01T00:00:00Z',
    },
  ],
  monthlyBudget: 5000,
  currency: 'INR',
  currencySymbol: '₹',
  dietaryRestrictions: [
    { id: 'dr-001', label: 'Vegetarian', isActive: true },
    { id: 'dr-002', label: 'No Nuts', isActive: false },
  ],
  brandRestrictions: [],
  createdAt: '2026-03-15T00:00:00Z',
};

export const mockBudget: HouseholdBudget = {
  monthlyTarget: 5000,
  spentThisMonth: 3240,
  remaining: 1760,
  percentUsed: 64.8,
  status: 'HEALTHY',
};
