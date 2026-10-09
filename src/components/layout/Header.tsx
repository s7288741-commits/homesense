'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  ChevronDown,
  Check,
  LogOut,
  Settings,
  Brain,
  ShieldCheck,
  LogIn,
  Users,
  X,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { mockHousehold } from '@/data/mock/household.mock';
import { useHousehold } from '@/context/HouseholdContext';

export default function Header() {
  const {
    householdName,
    householdMembers,
    budget,
    notifications,
    markNotificationRead,
    currentUser,
    isLoggedIn,
    switchUser,
    logout,
    login,
  } = useHousehold();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getInitials = (name?: string) => {
    if (!name) return 'PM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const activeUser = currentUser || mockHousehold.members[0];

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#080A0F]/90 px-6 backdrop-blur-xl">
        {/* Left: Household Info & Budget */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏠</span>
            <div>
              <h1 className="text-sm font-bold text-white">{householdName}</h1>
              <p className="text-[11px] text-slate-400">{householdMembers.length} members active</p>
            </div>
          </div>

          {/* Budget Bar */}
          {mounted && budget && (
            <div className="ml-4 hidden items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#121722] px-4 py-1.5 shadow-sm md:flex">
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Monthly Budget</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-white">{formatCurrency(budget.spentThisMonth)}</span>
                  <span className="text-[11px] text-slate-400">/ {formatCurrency(budget.monthlyTarget)}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold text-emerald-400">
                  {formatCurrency(budget.remaining)} left
                </span>
                <div className="h-1.5 w-24 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-violet-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, budget.percentUsed)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 shadow-sm transition-all hover:bg-white/10 hover:text-white"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white shadow-md shadow-violet-600/30">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-white/10 bg-[#121722] p-3 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="mb-2 px-3 py-1 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-white">Notifications</h3>
                      <p className="text-[11px] text-slate-400">{unreadCount} unread</p>
                    </div>
                  </div>
                  <div className="max-h-80 space-y-1 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={cn(
                          'cursor-pointer rounded-xl px-3 py-2.5 transition-all hover:bg-white/5 flex items-start justify-between gap-2',
                          !notif.isRead && 'bg-violet-500/10 border-l-2 border-violet-500'
                        )}
                      >
                        <div>
                          <p className="text-xs font-semibold text-white">{notif.title}</p>
                          <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-2">{notif.message}</p>
                        </div>
                        {!notif.isRead && <Check className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" />}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown or Sign In */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-left shadow-sm transition-all hover:border-violet-500/40 hover:bg-white/10 focus:outline-none cursor-pointer"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-500/20 text-violet-300 font-bold text-xs ring-1 ring-violet-500/30">
                  {getInitials(activeUser.name)}
                </div>
                <span className="text-xs font-semibold text-slate-200">{activeUser.name}</span>
                <ChevronDown
                  className={cn(
                    'h-3.5 w-3.5 text-slate-400 transition-transform duration-200',
                    showProfileMenu && 'rotate-180 text-violet-400'
                  )}
                />
              </button>

              {/* Profile Dropdown Content */}
              {showProfileMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-white/10 bg-[#121722] p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* User Card Header */}
                    <div className="rounded-xl border border-white/5 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 p-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white font-bold text-sm shadow-md shadow-violet-600/30">
                          {getInitials(activeUser.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate">{activeUser.name}</h4>
                          <p className="text-[11px] text-slate-400 truncate">{activeUser.email}</p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-md bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-500/30">
                              <ShieldCheck className="h-3 w-3" />
                              {activeUser.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Member Switcher */}
                    <div className="mb-2 space-y-0.5">
                      <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                        <Users className="h-3 w-3 text-violet-400" />
                        Switch Member Profile
                      </div>
                      {householdMembers.map((member) => {
                        const isSelected = member.id === activeUser.id;
                        return (
                          <button
                            key={member.id}
                            onClick={() => {
                              switchUser(member.id);
                              setShowProfileMenu(false);
                            }}
                            className={cn(
                              'w-full flex items-center justify-between rounded-xl px-3 py-1.5 text-xs transition-all text-left cursor-pointer',
                              isSelected
                                ? 'bg-violet-500/20 text-white font-bold border border-violet-500/30'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  'h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold',
                                  isSelected
                                    ? 'bg-violet-600 text-white'
                                    : 'bg-white/10 text-slate-300'
                                )}
                              >
                                {getInitials(member.name)}
                              </div>
                              <span>{member.name}</span>
                            </div>
                            {isSelected && <Check className="h-3.5 w-3.5 text-violet-400" />}
                          </button>
                        );
                      })}
                    </div>

                    <div className="h-px bg-white/5 my-1" />

                    {/* Navigation Options */}
                    <div className="space-y-0.5">
                      <Link
                        href="/settings"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                      >
                        <Settings className="h-4 w-4 text-violet-400" />
                        <span>Settings & Budget</span>
                      </Link>
                      <Link
                        href="/household-memory"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-all"
                      >
                        <Brain className="h-4 w-4 text-emerald-400" />
                        <span>Memory & AI Insights</span>
                      </Link>
                    </div>

                    <div className="h-px bg-white/5 my-1" />

                    {/* Logout Option */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowLogoutModal(true);
                      }}
                      className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all text-left cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-600/30 hover:bg-violet-500 transition-all cursor-pointer"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#121722] p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto">
              <LogOut className="h-6 w-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Log out of HomeSense?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You are currently signed in as <strong className="text-white">{activeUser.name}</strong>. Logging out will pause your session view until you log back in.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setShowLogoutModal(false);
                }}
                className="flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 transition-all cursor-pointer"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign In Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#121722] p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mx-auto">
              <LogIn className="h-6 w-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-white">Sign In to HomeSense</h3>
              <p className="text-xs text-slate-400">Select a household profile to resume:</p>
            </div>

            <div className="space-y-2 pt-1">
              {householdMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => {
                    login(member.id);
                    setShowLoginModal(false);
                  }}
                  className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200 hover:border-violet-500/50 hover:bg-violet-500/10 transition-all text-left group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white font-bold text-xs shadow-sm">
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-violet-300">{member.name}</p>
                      <p className="text-[10px] text-slate-400">{member.email}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                    {member.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
