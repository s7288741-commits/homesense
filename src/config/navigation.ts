// ============================================================================
// HomeSense — Navigation Configuration
// ============================================================================
// Single source of truth for sidebar navigation items.
// Add new pages here and they automatically appear in the sidebar.
// ============================================================================

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Brain,
  Settings,
  Users,
  Bell,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number; // notification count
  section: 'main' | 'settings';
}

export const NAVIGATION_ITEMS: NavItem[] = [
  // ── Main Pages ──
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    section: 'main',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    href: '/inventory',
    icon: Package,
    section: 'main',
  },
  {
    id: 'shopping-plan',
    label: 'Shopping Plan',
    href: '/shopping-plan',
    icon: ShoppingCart,
    section: 'main',
  },
  {
    id: 'household-memory',
    label: 'Household Memory',
    href: '/household-memory',
    icon: Brain,
    section: 'main',
  },

  // ── Settings Pages ──
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/notifications',
    icon: Bell,
    section: 'settings',
  },
  {
    id: 'members',
    label: 'Members',
    href: '/members',
    icon: Users,
    section: 'settings',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    section: 'settings',
  },
];

export const getMainNavItems = () => NAVIGATION_ITEMS.filter((item) => item.section === 'main');
export const getSettingsNavItems = () => NAVIGATION_ITEMS.filter((item) => item.section === 'settings');
