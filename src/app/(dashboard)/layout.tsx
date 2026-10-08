'use client';

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { HouseholdProvider } from "@/context/HouseholdContext";
import { ToastContainer } from "@/components/ui/ToastContainer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <HouseholdProvider>
      <div className="flex h-full bg-[#080A0F] text-slate-100 dark">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col pl-[260px] transition-all duration-300">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-7xl px-6 py-6">
              {children}
            </div>
          </main>
        </div>
        <ToastContainer />
      </div>
    </HouseholdProvider>
  );
}

