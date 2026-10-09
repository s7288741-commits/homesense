'use client';

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { HouseholdProvider, useHousehold } from "@/context/HouseholdContext";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { cn } from "@/lib/utils";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useHousehold();

  return (
    <div className="flex h-full bg-[#080A0F] text-slate-100 dark min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area — Dynamically expands when sidebar collapses */}
      <div
        className={cn(
          "flex flex-1 flex-col min-h-screen transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "pl-[72px]" : "pl-[260px]"
        )}
      >
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-6">
            {children}
          </div>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <HouseholdProvider>
      <DashboardContent>{children}</DashboardContent>
    </HouseholdProvider>
  );
}
