'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  InventoryItem,
  ItemStatus,
  ItemCategory,
  ItemUnit,
  ShoppingPlan,
  PlanItem,
  PlanItemSource,
  UrgencyLevel,
  Marketplace,
  BrandPreference,
  Anomaly,
  AnomalyReason,
  HouseholdBudget,
  AppNotification,
  NotificationType,
  SmartActionCard,
  MemberRole,
} from '@/types';
import { mockInventoryItems } from '@/data/mock/inventory.mock';
import { mockShoppingPlan } from '@/data/mock/shopping-plan.mock';
import { mockBrandPreferences, mockAnomalies } from '@/data/mock/memory.mock';
import { mockHousehold } from '@/data/mock/household.mock';
import { mockActionCards } from '@/data/mock/dashboard.mock';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'amber' | 'error';
}

interface HouseholdContextType {
  // State
  inventoryItems: InventoryItem[];
  shoppingPlan: ShoppingPlan;
  selectedStore: Marketplace;
  brandPreferences: BrandPreference[];
  anomalies: Anomaly[];
  budget: HouseholdBudget;
  notifications: AppNotification[];
  actionCards: SmartActionCard[];
  toasts: ToastMessage[];

  // Actions
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Inventory Actions
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'remainingDaysMin' | 'remainingDaysMax' | 'consumptionVelocity' | 'coPurchaseItems' | 'hasAnomaly' | 'lastRestockedBy'> & { expectedDurationDays?: number | null }) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  restockInventoryItem: (id: string, quantity: number, unit: ItemUnit, pricePaid?: number | null, brand?: string | null) => void;
  markInventoryItemLow: (id: string) => void;
  deleteInventoryItem: (id: string) => void;

  // Shopping Plan Actions
  autoPreparePlan: () => void;
  addItemToPlan: (item: { name: string; brand?: string; quantity: number; unit: ItemUnit; unitPrice: number; category?: string }) => void;
  removeItemFromPlan: (itemId: string) => void;
  applySubstitution: () => void;
  approvePlan: () => void;
  setSelectedStore: (store: Marketplace) => void;

  // Memory Actions
  recordBrandPreference: (itemName: string, brand: string, member: string) => void;
  resolveAnomaly: (id: string) => void;
  logAnomaly: (itemName: string, reasonDetail: string) => void;

  // Settings Actions
  updateBudget: (newLimit: number) => void;

  // Dashboard Actions
  dismissActionCard: (cardId: string) => void;
  markNotificationRead: (id: string) => void;
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  INVENTORY: 'homesense_inventory_items',
  PLAN: 'homesense_shopping_plan',
  PREFS: 'homesense_brand_prefs',
  ANOMALIES: 'homesense_anomalies',
  BUDGET: 'homesense_budget',
  CARDS: 'homesense_action_cards',
};

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  // Toast notifications state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Inventory State
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.INVENTORY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return mockInventoryItems;
  });

  // Shopping Plan State
  const [shoppingPlan, setShoppingPlan] = useState<ShoppingPlan>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PLAN);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return mockShoppingPlan;
  });

  const [selectedStore, setSelectedStore] = useState<Marketplace>(Marketplace.BLINKIT);

  // Memory & Preferences State
  const [brandPreferences, setBrandPreferences] = useState<BrandPreference[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PREFS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return mockBrandPreferences;
  });

  const [anomalies, setAnomalies] = useState<Anomaly[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ANOMALIES);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return mockAnomalies;
  });

  // Budget State
  const [budget, setBudget] = useState<HouseholdBudget>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.BUDGET);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return {
      monthlyTarget: mockHousehold.monthlyBudget,
      spentThisMonth: 1850,
      remaining: mockHousehold.monthlyBudget - 1850,
      percentUsed: Math.round((1850 / mockHousehold.monthlyBudget) * 100),
      status: 'HEALTHY',
    };
  });

  // Dashboard Cards
  const [actionCards, setActionCards] = useState<SmartActionCard[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CARDS);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return mockActionCards;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Cooking Oil Running Low',
      message: 'Estimated exhaustion in 2 days. Added to restock queue.',
      type: NotificationType.RUNNING_LOW,
      createdAt: '10 mins ago',
      isRead: false,
    },
    {
      id: 'notif-2',
      title: 'Rain Forecast Alert',
      message: 'Morning monsoon showers expected. Blinkit 12-min delivery slot open.',
      type: NotificationType.WEATHER_ALERT,
      createdAt: '1 hour ago',
      isRead: false,
    },
  ]);

  // Persist state updates to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEYS.INVENTORY, JSON.stringify(inventoryItems));
    }
  }, [inventoryItems]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PLAN, JSON.stringify(shoppingPlan));
    }
  }, [shoppingPlan]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PREFS, JSON.stringify(brandPreferences));
    }
  }, [brandPreferences]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ANOMALIES, JSON.stringify(anomalies));
    }
  }, [anomalies]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEYS.BUDGET, JSON.stringify(budget));
    }
  }, [budget]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CARDS, JSON.stringify(actionCards));
    }
  }, [actionCards]);

  // --- Inventory Handlers ---
  const addInventoryItem = (
    itemData: Omit<InventoryItem, 'id' | 'remainingDaysMin' | 'remainingDaysMax' | 'consumptionVelocity' | 'coPurchaseItems' | 'hasAnomaly' | 'lastRestockedBy'> & { expectedDurationDays?: number | null }
  ) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
      status: ItemStatus.NORMAL,
      remainingDaysMin: itemData.expectedDurationDays ? itemData.expectedDurationDays : 14,
      remainingDaysMax: itemData.expectedDurationDays ? itemData.expectedDurationDays + 3 : 18,
      consumptionVelocity: 0.1,
      coPurchaseItems: [],
      hasAnomaly: false,
      lastRestockedBy: 'Prakash',
    };

    setInventoryItems((prev) => [newItem, ...prev]);
    addToast(`Added "${newItem.name}" to Household Inventory!`, 'success');
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventoryItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          const updated = { ...i, ...updates };
          return updated;
        }
        return i;
      })
    );
    addToast('Inventory item updated successfully!', 'info');
  };

  const restockInventoryItem = (
    id: string,
    quantity: number,
    unit: ItemUnit,
    pricePaid?: number | null,
    brand?: string | null
  ) => {
    let itemName = '';
    setInventoryItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          itemName = i.name;
          const newQty = i.quantity + quantity;
          return {
            ...i,
            quantity: newQty,
            unit: unit || i.unit,
            purchaseDate: new Date().toISOString(),
            status: ItemStatus.NORMAL,
            typicalPrice: pricePaid ?? i.typicalPrice,
            preferredBrand: brand ?? i.preferredBrand,
            remainingDaysMin: i.expectedDurationDays || 14,
            remainingDaysMax: (i.expectedDurationDays || 14) + 4,
          };
        }
        return i;
      })
    );
    addToast(`Restocked ${quantity} ${unit} of "${itemName || 'item'}"! Status reset to Normal 🟢`, 'success');
  };

  const markInventoryItemLow = (id: string) => {
    let itemName = '';
    setInventoryItems((prev) =>
      prev.map((i) => {
        if (i.id === id) {
          itemName = i.name;
          return {
            ...i,
            status: ItemStatus.RUNNING_LOW,
            remainingDaysMin: 2,
            remainingDaysMax: 3,
          };
        }
        return i;
      })
    );
    addToast(`Marked "${itemName || 'item'}" as Running Low 🔴`, 'amber');
  };

  const deleteInventoryItem = (id: string) => {
    let itemName = '';
    setInventoryItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) itemName = item.name;
      return prev.filter((i) => i.id !== id);
    });
    addToast(`Removed "${itemName || 'item'}" from inventory`, 'info');
  };

  // --- Shopping Plan Handlers ---
  const autoPreparePlan = () => {
    const lowItems = inventoryItems.filter(
      (i) => i.status === ItemStatus.RUNNING_LOW || i.status === ItemStatus.UPCOMING
    );

    const existingNames = new Set(shoppingPlan.items.map((i) => i.name.toLowerCase()));

    const newPlanItems: PlanItem[] = [...shoppingPlan.items];

    lowItems.forEach((item) => {
      if (!existingNames.has(item.name.toLowerCase())) {
        newPlanItems.push({
          id: `plan-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          planId: shoppingPlan.id,
          inventoryItemId: item.id,
          name: item.name,
          brand: item.preferredBrand || 'Standard',
          packSize: item.preferredPackSize || null,
          quantity: item.quantity || 1,
          unit: item.unit,
          unitPrice: item.typicalPrice || 180,
          totalPrice: (item.quantity || 1) * (item.typicalPrice || 180),
          source: PlanItemSource.PREDICTION,
          urgency: UrgencyLevel.BUY_NOW,
          isSubstitution: false,
          remainingDays: item.remainingDaysMin || 2,
        });
      }
    });

    const newTotal = newPlanItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

    setShoppingPlan({
      ...shoppingPlan,
      items: newPlanItems,
      totalEstimate: newTotal,
    });

    addToast('Shopping Plan updated with all urgent items!', 'success');
  };

  const addItemToPlan = (itemData: {
    name: string;
    brand?: string;
    quantity: number;
    unit: ItemUnit;
    unitPrice: number;
    category?: string;
  }) => {
    const newItem: PlanItem = {
      id: `plan-item-${Date.now()}`,
      planId: shoppingPlan.id,
      inventoryItemId: null,
      name: itemData.name,
      brand: itemData.brand || 'Preferred',
      packSize: null,
      quantity: itemData.quantity,
      unit: itemData.unit,
      unitPrice: itemData.unitPrice,
      totalPrice: itemData.quantity * itemData.unitPrice,
      source: PlanItemSource.MANUAL,
      urgency: UrgencyLevel.CAN_WAIT,
      isSubstitution: false,
      remainingDays: 5,
    };

    const updatedItems = [newItem, ...shoppingPlan.items];
    const newTotal = updatedItems.reduce((sum, i) => sum + (i.totalPrice || 0), 0);

    setShoppingPlan({
      ...shoppingPlan,
      items: updatedItems,
      totalEstimate: newTotal,
    });

    addToast(`Added "${newItem.name}" to Shopping Plan!`, 'success');
  };

  const removeItemFromPlan = (itemId: string) => {
    const updatedItems = shoppingPlan.items.filter((i) => i.id !== itemId);
    const newTotal = updatedItems.reduce((sum, i) => sum + (i.totalPrice || 0), 0);

    setShoppingPlan({
      ...shoppingPlan,
      items: updatedItems,
      totalEstimate: newTotal,
    });

    addToast('Item removed from Shopping Plan', 'info');
  };

  const applySubstitution = () => {
    const updatedItems = shoppingPlan.items.map((item) => {
      if (item.name.toLowerCase().includes('detergent') || item.name.toLowerCase().includes('surf')) {
        return {
          ...item,
          name: 'Genteel Liquid Detergent 2L (Substituted)',
          brand: 'Genteel',
          unitPrice: 340,
          totalPrice: 340,
          isSubstitution: true,
          originalBrand: 'Surf Excel',
        };
      }
      return item;
    });

    const newTotal = updatedItems.reduce((sum, i) => sum + (i.totalPrice || 0), 0);

    setShoppingPlan({
      ...shoppingPlan,
      items: updatedItems,
      totalEstimate: newTotal,
    });

    recordBrandPreference('Detergent Powder', 'Genteel', 'Mom');
    addToast('Applied Substitution! Genteel Detergent selected (Saved ₹230)', 'success');
  };

  const approvePlan = () => {
    setShoppingPlan((prev) => ({
      ...prev,
      status: 'APPROVED' as any,
    }));

    // Update budget spent
    const planTotal = shoppingPlan.totalEstimate || 1850;
    setBudget((prev) => {
      const newSpent = prev.spentThisMonth + planTotal;
      return {
        ...prev,
        spentThisMonth: newSpent,
        remaining: Math.max(0, prev.monthlyTarget - newSpent),
        percentUsed: Math.min(100, Math.round((newSpent / prev.monthlyTarget) * 100)),
        status: newSpent > prev.monthlyTarget ? 'OVER' : 'HEALTHY',
      };
    });

    addToast('Shopping Plan Approved! Order sent to dispatch.', 'success');
  };

  // --- Memory Handlers ---
  const recordBrandPreference = (itemName: string, brand: string, member: string) => {
    setBrandPreferences((prev) => {
      const existingIdx = prev.findIndex((p) => p.itemName.toLowerCase() === itemName.toLowerCase());
      if (existingIdx >= 0) {
        const updated = [...prev];
        const current = updated[existingIdx];
        updated[existingIdx] = {
          ...current,
          preferredBrand: brand,
          timesChosen: current.timesChosen + 1,
          totalChoices: current.totalChoices + 1,
          confidence: Math.min(0.99, Number((current.confidence + 0.05).toFixed(2))),
          lastChosenBy: member,
        };
        return updated;
      } else {
        return [
          {
            itemName,
            preferredBrand: brand,
            confidence: 0.85,
            timesChosen: 3,
            totalChoices: 3,
            lastChosenBy: member,
          },
          ...prev,
        ];
      }
    });

    addToast(`Recorded ${member}'s preference for "${brand}" (${itemName})`, 'success');
  };

  const resolveAnomaly = (id: string) => {
    setAnomalies((prev) => prev.filter((a) => a.id !== id));
    addToast('Consumption anomaly marked as resolved', 'info');
  };

  const logAnomaly = (itemName: string, reasonDetail: string) => {
    const newAnomaly: Anomaly = {
      id: `anom-${Date.now()}`,
      itemId: `inv-${Date.now()}`,
      itemName,
      normalDurationDays: 14,
      actualDurationDays: 4,
      detectedAt: new Date().toISOString(),
      reason: AnomalyReason.GUESTS,
      reasonDetail,
      action: 'PENDING',
    };

    setAnomalies((prev) => [newAnomaly, ...prev]);
    addToast(`Logged consumption anomaly for "${itemName}"`, 'amber');
  };

  // --- Settings Handlers ---
  const updateBudget = (newLimit: number) => {
    setBudget((prev) => ({
      ...prev,
      monthlyTarget: newLimit,
      remaining: Math.max(0, newLimit - prev.spentThisMonth),
      percentUsed: Math.min(100, Math.round((prev.spentThisMonth / newLimit) * 100)),
      status: prev.spentThisMonth > newLimit ? 'OVER' : 'HEALTHY',
    }));
    addToast(`Updated monthly target budget to ₹${newLimit}`, 'success');
  };

  const dismissActionCard = (cardId: string) => {
    setActionCards((prev) => prev.filter((c) => c.id !== cardId));
    addToast('Recommendation card dismissed', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  return (
    <HouseholdContext.Provider
      value={{
        inventoryItems,
        shoppingPlan,
        selectedStore,
        brandPreferences,
        anomalies,
        budget,
        notifications,
        actionCards,
        toasts,
        addToast,
        removeToast,
        addInventoryItem,
        updateInventoryItem,
        restockInventoryItem,
        markInventoryItemLow,
        deleteInventoryItem,
        autoPreparePlan,
        addItemToPlan,
        removeItemFromPlan,
        applySubstitution,
        approvePlan,
        setSelectedStore,
        recordBrandPreference,
        resolveAnomaly,
        logAnomaly,
        updateBudget,
        dismissActionCard,
        markNotificationRead,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error('useHousehold must be used within a HouseholdProvider');
  }
  return context;
}
