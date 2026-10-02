'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { SmartActionCard } from '@/types';
import { ActionCardType } from '@/types';
import { AlertTriangle, Lightbulb, Link2, Clock, CalendarDays, X } from 'lucide-react';

interface SmartActionCardsProps {
  cards: SmartActionCard[];
  maxVisible?: number;
  onDismiss: (cardId: string) => void;
  onAction: (cardId: string, actionId: string) => void;
  isLoading: boolean;
}

const CARD_TYPE_CONFIG: Record<ActionCardType, { icon: React.ElementType; gradient: string; iconBg: string }> = {
  [ActionCardType.ANOMALY_ALERT]: {
    icon: AlertTriangle,
    gradient: 'from-red-500/10 to-orange-500/5',
    iconBg: 'bg-red-500/15 text-red-400',
  },
  [ActionCardType.FORGOTTEN_ITEM]: {
    icon: Lightbulb,
    gradient: 'from-amber-500/10 to-yellow-500/5',
    iconBg: 'bg-amber-500/15 text-amber-400',
  },
  [ActionCardType.CO_PURCHASE]: {
    icon: Link2,
    gradient: 'from-blue-500/10 to-cyan-500/5',
    iconBg: 'bg-blue-500/15 text-blue-400',
  },
  [ActionCardType.BUY_NOW_VS_WAIT]: {
    icon: Clock,
    gradient: 'from-emerald-500/10 to-teal-500/5',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
  },
  [ActionCardType.EVENT_REMINDER]: {
    icon: CalendarDays,
    gradient: 'from-purple-500/10 to-violet-500/5',
    iconBg: 'bg-purple-500/15 text-purple-400',
  },
};

export default function SmartActionCards({ cards, maxVisible = 3, onDismiss, onAction, isLoading }: SmartActionCardsProps) {
  const [showAll, setShowAll] = React.useState(false);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="skeleton mb-2 h-4 w-36" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="skeleton h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const visibleCards = showAll ? cards : cards.slice(0, maxVisible);
  const hiddenCount = cards.length - maxVisible;

  if (cards.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center rounded-2xl px-5 py-8 text-center">
        <span className="text-3xl">✨</span>
        <p className="mt-2 text-sm font-medium text-white/60">All caught up!</p>
        <p className="text-[11px] text-white/30">No actions needed right now</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Smart Insights</h2>
        <span className="text-[11px] text-white/30">{cards.length} active</span>
      </div>

      <div className="stagger-children space-y-2.5">
        {visibleCards.map((card) => {
          const config = CARD_TYPE_CONFIG[card.type];
          const Icon = config.icon;

          return (
            <div
              key={card.id}
              className={cn(
                'group relative rounded-2xl border border-white/[0.06] bg-gradient-to-r p-4 transition-all hover:border-white/10',
                config.gradient
              )}
            >
              {/* Dismiss button */}
              <button
                onClick={() => onDismiss(card.id)}
                className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-lg text-white/20 opacity-0 transition-all hover:bg-white/[0.08] hover:text-white/50 group-hover:opacity-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <div className="flex gap-3">
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', config.iconBg)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-white/90">{card.title}</h3>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-white/45">{card.message}</p>
                  <div className="mt-2.5 flex gap-2">
                    {card.actions.map((action) => (
                      <button
                        key={action.actionId}
                        onClick={() => onAction(card.id, action.actionId)}
                        className={cn(
                          'rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all',
                          action.variant === 'primary'
                            ? 'bg-white/10 text-white hover:bg-white/15'
                            : action.variant === 'secondary'
                            ? 'bg-white/[0.05] text-white/60 hover:bg-white/[0.08] hover:text-white/80'
                            : 'text-white/40 hover:text-white/60'
                        )}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more / less toggle */}
      {hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 w-full rounded-xl py-2 text-[11px] font-medium text-white/30 transition-all hover:bg-white/[0.03] hover:text-white/50"
        >
          {showAll ? 'Show less' : `Show ${hiddenCount} more`}
        </button>
      )}
    </div>
  );
}
