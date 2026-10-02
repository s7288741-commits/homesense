'use client';

import React, { useState, useEffect } from 'react';
import InventoryHealth from '@/components/dashboard/InventoryHealth';
import SmartActionCards from '@/components/dashboard/SmartActionCards';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import PlanOverview from '@/components/dashboard/PlanOverview';
import QuickAnalytics from '@/components/dashboard/QuickAnalytics';
import {
  getDashboardHealthSummary,
  getActionCards,
  getDashboardBudget,
  getDashboardWeather,
  getDashboardPlanOverview,
  getAnalyticsSummary,
  dismissActionCard,
} from '@/services/dashboard.service';
import type {
  InventoryHealthSummary,
  SmartActionCard,
  ShoppingWindow,
  HouseholdBudget,
  MonthlySpending,
  PlanStatus,
} from '@/types';
import { Sparkles } from 'lucide-react';

export default function DashboardPage() {
  // ── State ──
  const [healthSummary, setHealthSummary] = useState<InventoryHealthSummary | null>(null);
  const [actionCards, setActionCards] = useState<SmartActionCard[]>([]);
  const [budget, setBudget] = useState<HouseholdBudget | null>(null);
  const [weather, setWeather] = useState<ShoppingWindow | null>(null);
  const [planOverview, setPlanOverview] = useState<{
    id: string; monthYear: string; status: PlanStatus; totalEstimate: number; generatedAt: string; itemCount: number;
  } | null>(null);
  const [analytics, setAnalytics] = useState<{
    spentThisMonth: number; itemsPurchased: number; shoppingTrips: number; savedThisMonth: number;
    categoryBreakdown: MonthlySpending['categoryBreakdown'];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // ── Fetch all dashboard data in parallel ──
  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const [health, cards, budgetData, weatherData, plan, analyticsData] = await Promise.all([
          getDashboardHealthSummary(),
          getActionCards(),
          getDashboardBudget(),
          getDashboardWeather(),
          getDashboardPlanOverview(),
          getAnalyticsSummary(),
        ]);

        setHealthSummary(health);
        setActionCards(cards);
        setBudget(budgetData);
        setWeather(weatherData);
        setPlanOverview(plan);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  // ── Handlers ──
  const handleDismissCard = async (cardId: string) => {
    // Optimistic update
    setActionCards((prev) => prev.filter((c) => c.id !== cardId));
    await dismissActionCard(cardId);
  };

  const handleCardAction = (cardId: string, actionId: string) => {
    // Route to the appropriate action
    console.log(`Action: ${actionId} on card: ${cardId}`);
    // In a real app, this would navigate to the relevant page or open a modal
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-violet-400" />
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
        </div>
        <p className="mt-1 text-sm text-white/40">
          Your household at a glance — powered by HomeSense intelligence
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column — Inventory Health + Weather */}
        <div className="col-span-12 space-y-4 lg:col-span-4">
          <InventoryHealth data={healthSummary} isLoading={isLoading} />
          <WeatherWidget data={weather} isLoading={isLoading} />
        </div>

        {/* Center Column — Smart Action Cards + Plan Overview */}
        <div className="col-span-12 space-y-4 lg:col-span-4">
          <SmartActionCards
            cards={actionCards}
            maxVisible={3}
            onDismiss={handleDismissCard}
            onAction={handleCardAction}
            isLoading={isLoading}
          />
          <PlanOverview
            data={planOverview}
            budget={budget ? { monthlyTarget: budget.monthlyTarget, remaining: budget.remaining } : null}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column — Quick Analytics */}
        <div className="col-span-12 lg:col-span-4">
          <QuickAnalytics data={analytics} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
