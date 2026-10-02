// ============================================================================
// HomeSense — Household Types
// ============================================================================
// Defines: Household, Member, Role, and household-level preferences.
// Used across ALL pages for context and permissions.
// ============================================================================

export enum MemberRole {
  ADMIN = 'ADMIN',       // Can approve plans, manage members, full access
  MEMBER = 'MEMBER',     // Can add/edit inventory, modify plans
  VIEWER = 'VIEWER',     // Read-only access
}

export interface HouseholdMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatarUrl?: string;
  joinedAt: string; // ISO date
}

export interface DietaryRestriction {
  id: string;
  label: string;
  isActive: boolean;
}

export interface BrandRestriction {
  id: string;
  brandName: string;
  category?: string; // applies to specific category, or null for all
  type: 'PREFERRED' | 'AVOIDED';
}

export interface Household {
  id: string;
  name: string;
  members: HouseholdMember[];
  monthlyBudget: number;
  currency: string; // e.g., "INR", "USD"
  currencySymbol: string; // e.g., "₹", "$"
  dietaryRestrictions: DietaryRestriction[];
  brandRestrictions: BrandRestriction[];
  createdAt: string; // ISO date
}

export interface HouseholdBudget {
  monthlyTarget: number;
  spentThisMonth: number;
  remaining: number;
  percentUsed: number; // 0-100
  status: 'HEALTHY' | 'WARNING' | 'OVER'; // green, yellow, red
}
