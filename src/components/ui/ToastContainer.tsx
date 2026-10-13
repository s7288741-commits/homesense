'use client';

import React from 'react';
import { useHousehold } from '@/context/HouseholdContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useHousehold();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success' || !toast.type;
        const isAmber = toast.type === 'amber';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-2xl backdrop-blur-xl transition-all duration-300 animate-slide-up ${
              isSuccess
                ? 'border-emerald-500/30 bg-[#0F1D1A]/95 text-emerald-200'
                : isAmber
                ? 'border-amber-500/30 bg-[#241A0E]/95 text-amber-200'
                : 'border-violet-500/30 bg-[#161426]/95 text-violet-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
              {isAmber && <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />}
              {!isSuccess && !isAmber && <Info className="h-4 w-4 text-violet-400 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
