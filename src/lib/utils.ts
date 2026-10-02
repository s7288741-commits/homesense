// ============================================================================
// HomeSense — Utility Functions
// ============================================================================
// General-purpose utilities used across the entire app.
// ============================================================================

import { type ClassValue, clsx } from 'clsx';

/**
 * Merge Tailwind classes safely (handles conflicts).
 * Usage: cn('px-4 py-2', isActive && 'bg-blue-500', className)
 */
export function cn(...inputs: ClassValue[]): string {
  // Simple implementation without tailwind-merge to keep deps minimal
  return clsx(inputs);
}

/**
 * Format currency with the household's currency symbol.
 * formatCurrency(3240, '₹') → "₹3,240"
 */
export function formatCurrency(amount: number, symbol: string = '₹'): string {
  return `${symbol}${amount.toLocaleString('en-IN')}`;
}

/**
 * Format a date string to a readable format.
 * formatDate('2026-09-01') → "1 Sept 2026"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Get relative time from now.
 * getRelativeTime('2026-09-28') → "3 days ago"
 */
export function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Format remaining days as a range string.
 * formatRemainingDays(3, 5) → "3-5 days"
 * formatRemainingDays(1, 1) → "1 day"
 * formatRemainingDays(null, null) → "Unknown"
 */
export function formatRemainingDays(min: number | null, max: number | null): string {
  if (min === null || max === null) return 'Unknown';
  if (min === max) return `${min} day${min !== 1 ? 's' : ''}`;
  return `${min}-${max} days`;
}

/**
 * Format quantity with unit.
 * formatQuantity(5, 'kg') → "5 kg"
 * formatQuantity(2.5, 'L') → "2.5 L"
 */
export function formatQuantity(quantity: number, unit: string): string {
  return `${quantity} ${unit}`;
}

/**
 * Calculate percentage, clamped to 0-100.
 */
export function calcPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
}

/**
 * Generate a simple unique ID (for mock data / local state).
 * In production, IDs come from the backend.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Delay helper for simulating API latency in mock mode.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely parse a numeric string, returning null if invalid.
 */
export function safeParseNumber(value: string): number | null {
  const num = parseFloat(value);
  return isNaN(num) ? null : num;
}
