'use client';

import { HouseholdProvider } from '@/context/HouseholdContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <HouseholdProvider>{children}</HouseholdProvider>;
}
