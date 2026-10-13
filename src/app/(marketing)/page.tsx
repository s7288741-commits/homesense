'use client';

import './landing/landing.css';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles, Brain, ShoppingCart, BarChart3, Shield, Zap,
  ArrowRight, ChevronDown, Package, Eye, TrendingUp,
  RefreshCw, Menu, X, Star, Check, Clock, Lock, KeyRound, User, Home, FastForward, AlertTriangle, ShieldCheck, Activity
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import HomeSenseLogo from '@/components/ui/HomeSenseLogo';
import { useHousehold } from '@/context/HouseholdContext';
import { signInAccount, registerAccount } from '@/lib/auth';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsInView(true); },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

function AnimatedCounter({ end, label, suffix = '' }: { end: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, isInView } = useInView(0.3);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, end]);

  return (
    <div ref={ref} className="landing-stat-item">
      <span className="landing-stat-number">{count}{suffix}</span>
      <span className="landing-stat-label">{label}</span>
    </div>
  );
}

function seededRandom(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PARTICLE_DATA = (() => {
  const rand = seededRandom(42);
  return Array.from({ length: 35 }).map(() => ({
    left: rand() * 100,
    top: rand() * 100,
    width: 2 + rand() * 4,
    height: 2 + rand() * 4,
    animationDelay: rand() * 8,
    animationDuration: 6 + rand() * 10,
    opacity: 0.15 + rand() * 0.35,
  }));
})();

function ParticleField() {
  return (
    <div className="landing-particles" aria-hidden="true">
      {PARTICLE_DATA.map((p, i) => (
        <div
          key={i}
          className="landing-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            animationDelay: `${p.animationDelay}s`,
            animationDuration: `${p.animationDuration}s`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  delay: number;
}) {
  const { ref, isInView } = useInView(0.2);
  return (
    <div
      ref={ref}
      className="landing-feature-card"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="landing-feature-icon" style={{ background: gradient }}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="landing-feature-title">{title}</h3>
      <p className="landing-feature-desc">{description}</p>
    </div>
  );
}

function WorkflowStep({
  step,
  title,
  description,
  icon: Icon,
  delay,
}: {
  step: number;
  title: string;
  description: string;
  icon: React.ElementType;
  delay: number;
}) {
  const { ref, isInView } = useInView(0.25);
  return (
    <div
      ref={ref}
      className="landing-workflow-step"
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="landing-workflow-number">
        <span>{step}</span>
      </div>
      <div className="landing-workflow-icon-ring">
        <Icon className="w-7 h-7 text-violet-300" />
      </div>
      <h4 className="landing-workflow-title">{title}</h4>
      <p className="landing-workflow-desc">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const { login, addMember, updateHouseholdName } = useHousehold();

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'register'>('signin');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [householdName, setHouseholdName] = useState('');
  const [memberName, setMemberName] = useState('');

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navOpacity = Math.min(scrollY / 200, 0.95);

  const openAuth = (tab: 'signin' | 'register' = 'signin') => {
    setAuthTab(tab);
    setAuthError(null);
    setEmail('');
    setPassword('');
    setMemberName('');
    setHouseholdName('');
    setShowAuthModal(true);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsAuthenticating(true);

    setTimeout(() => {
      if (authTab === 'signin') {
        const result = signInAccount(email, password);
        if (!result.ok) {
          setAuthError(result.error);
          setIsAuthenticating(false);
          return;
        }
        // Find matching context member by email, or fall back to first member
        login(undefined);
        setIsAuthenticating(false);
        setShowAuthModal(false);
        router.push('/dashboard');
      } else {
        if (!memberName.trim()) {
          setAuthError('Please enter your name.');
          setIsAuthenticating(false);
          return;
        }
        if (password.length < 6) {
          setAuthError('Password must be at least 6 characters.');
          setIsAuthenticating(false);
          return;
        }
        const result = registerAccount(email, password, memberName, householdName);
        if (!result.ok) {
          setAuthError(result.error);
          setIsAuthenticating(false);
          return;
        }
        // Add to household context and update household name
        addMember({ name: result.account.name, email: result.account.email });
        if (householdName.trim()) {
          updateHouseholdName(result.account.householdName);
        }
        setIsAuthenticating(false);
        setShowAuthModal(false);
        router.push('/dashboard');
      }
    }, 800);
  };

  const featureTabs = [
    {
      id: 'predict',
      label: 'Smart Tracking',
      icon: Brain,
      heading: 'Know What You Need Before You Run Out',
      text: 'HomeSense monitors how fast your family uses milk, oil, or detergent. It calculates run-out dates in real-time and builds restock lists automatically—saving you from last-minute grocery runs.',
      highlights: ['Calculates exact usage speed', 'Adapts to seasonal family changes', 'Remembers everyone’s preferred brands'],
    },
    {
      id: 'analytics',
      label: 'Spending Insights',
      icon: BarChart3,
      heading: 'Clear Insights Into Household Expenses',
      text: 'See where your money goes every month, track budget health, and catch forgotten essential items before your pantry runs empty.',
      highlights: ['Visual monthly spending heatmaps', 'Forgotten item probability alerts', 'Easy budget compliance tracking'],
    },
    {
      id: 'plan',
      label: 'One-Tap Ordering',
      icon: ShoppingCart,
      heading: 'Instant Restock Plan & Quick Delivery',
      text: 'HomeSense builds a smart restock list matched with store prices, availability, and optimal delivery slots across Blinkit, Zepto, and Instamart.',
      highlights: ['Real-time store price comparison', 'Rain & weather slot recommendations', 'Zero-waste budget enforcement'],
    },
  ];

  const activeTab = featureTabs[activeFeatureTab];

  return (
    <div className="landing-root">
      {/* Floating Navbar */}
      <nav
        className="landing-nav"
        style={{ backgroundColor: `rgba(5, 6, 9, ${navOpacity})` }}
      >
        <div className="landing-nav-inner">
          {/* Nav Left: Capabilities Links */}
          <div className="landing-nav-left">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#how-it-works" className="landing-nav-link">How It Works</a>
            <a href="#preview" className="landing-nav-link">Dashboard Preview</a>
          </div>



          {/* Nav Right: Portal Actions */}
          <div className="landing-nav-right">
            <button
              onClick={() => openAuth('signin')}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => openAuth('register')}
              className="landing-nav-cta cursor-pointer"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            className="landing-mobile-toggle cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="landing-mobile-menu">
            <a href="#features" className="landing-mobile-link" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="landing-mobile-link" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <a href="#preview" className="landing-mobile-link" onClick={() => setMobileMenuOpen(false)}>Dashboard Preview</a>
            <button onClick={() => { setMobileMenuOpen(false); openAuth('signin'); }} className="landing-mobile-link text-left">Sign In</button>
            <button onClick={() => { setMobileMenuOpen(false); openAuth('register'); }} className="landing-mobile-cta">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="landing-hero" ref={heroRef}>
        <ParticleField />

        <div className="landing-hero-mesh" aria-hidden="true" />

        <div
          className="landing-hero-glow"
          aria-hidden="true"
          style={{ transform: `translateY(${scrollY * 0.15}px)` }}
        />

        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SMART HOUSEHOLD ASSISTANT</span>
          </div>

          <h1 className="landing-hero-title">
            Your Home Essentials,
            <span className="landing-hero-gradient"> Always in Sync.</span>
          </h1>

          <p className="landing-hero-subtitle">
            HomeSense automatically tracks your supplies, learns usage patterns, and predicts what you need before you run out. Never write a manual grocery list again.
          </p>

          <div className="landing-hero-actions">
            <button onClick={() => openAuth('signin')} className="landing-btn-primary cursor-pointer">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <a href="#features" className="landing-btn-secondary">
              See How It Works
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </a>
          </div>

          <div className="landing-hero-stats">
            <AnimatedCounter end={12} label="Items Tracked" suffix="+" />
            <div className="landing-stat-divider" />
            <AnimatedCounter end={98} label="Usage Precision" suffix="%" />
            <div className="landing-stat-divider" />
            <AnimatedCounter end={100} label="Fewer Emergency Store Runs" suffix="%" />
          </div>
        </div>

        {/* ── Native UI Telemetry Console ── */}
        <div
          className="mx-auto mt-12 max-w-4xl rounded-3xl border border-violet-500/30 bg-[#0D111A]/90 p-6 shadow-2xl backdrop-blur-2xl text-left text-xs text-white space-y-4"
          style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold tracking-wider text-slate-300 uppercase text-[11px]">
                LIVE HOUSEHOLD STATUS FEED
              </span>
            </div>
            <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-300 border border-violet-500/30">
              SMART AUTO-TRACKING
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-xs">Cooking Oil</span>
                <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400">
                  ~2 Days Left
                </span>
              </div>
              <p className="text-[11px] text-slate-300">Stock: 0.5L · Usage speed +15%</p>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-red-500 w-[20%]" />
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-xs">Basmati Rice</span>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                  ~4 Days Left
                </span>
              </div>
              <p className="text-[11px] text-slate-300">Stock: 1.2kg · 5kg bag preferred</p>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-amber-500 w-[35%]" />
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-xs">Liquid Detergent</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  Smart Swap 🟢
                </span>
              </div>
              <p className="text-[11px] text-slate-300">Genteel 2L (Saved ₹230)</p>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full bg-emerald-500 w-[85%]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="landing-features-section">
        <div className="landing-section-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">
              <Zap className="w-3.5 h-3.5" /> Smart Features
            </span>
            <h2 className="landing-section-title">
              Everything You Need for a <span className="text-violet-400">Seamless Home</span>
            </h2>
            <p className="landing-section-subtitle">
              Six smart tools working together so you never run out of groceries or household supplies again.
            </p>
          </div>

          <div className="landing-features-grid">
            <FeatureCard
              icon={Eye}
              title="Smart Stock Predictions"
              description="Tracks consumption speed and estimates exact depletion dates so you are never caught off guard."
              gradient="linear-gradient(135deg, #7C3AED, #4F46E5)"
              delay={0}
            />
            <FeatureCard
              icon={Brain}
              title="Family & Member Preferences"
              description="Remembers brand choices and dietary needs for everyone in your household automatically."
              gradient="linear-gradient(135deg, #EC4899, #8B5CF6)"
              delay={100}
            />
            <FeatureCard
              icon={RefreshCw}
              title="Money-Saving Suggestions"
              description="Recommends budget-friendly brand alternatives when preferred items are out of stock."
              gradient="linear-gradient(135deg, #06B6D4, #3B82F6)"
              delay={200}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Household Spending Insights"
              description="Clear spending breakdowns, monthly budget targets, and alerts for forgotten supplies."
              gradient="linear-gradient(135deg, #F59E0B, #EF4444)"
              delay={300}
            />
            <FeatureCard
              icon={ShoppingCart}
              title="One-Tap Restock Plans"
              description="Auto-builds shopping lists optimized for Blinkit, Zepto, and Instamart with fast delivery."
              gradient="linear-gradient(135deg, #10B981, #059669)"
              delay={400}
            />
            <FeatureCard
              icon={Shield}
              title="Private Local Storage"
              description="All household patterns and supply levels stay saved locally on your device for complete privacy."
              gradient="linear-gradient(135deg, #6366F1, #A855F7)"
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* SHOWCASE SECTION */}
      <section className="landing-showcase-section">
        <div className="landing-section-container">
          <div className="landing-showcase-tabs">
            {featureTabs.map((tab, idx) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`landing-showcase-tab cursor-pointer ${idx === activeFeatureTab ? 'active' : ''}`}
                  onClick={() => setActiveFeatureTab(idx)}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="landing-showcase-content" key={activeTab.id}>
            <div className="landing-showcase-text">
              <h3 className="landing-showcase-heading">{activeTab.heading}</h3>
              <p className="landing-showcase-desc">{activeTab.text}</p>
              <ul className="landing-showcase-highlights">
                {activeTab.highlights.map((h, i) => (
                  <li key={i}>
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => openAuth('signin')} className="landing-showcase-cta cursor-pointer">
                Open Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* ── Native UI Showcase Card ── */}
            <div className="rounded-3xl border border-white/10 bg-[#121722] p-6 shadow-2xl space-y-4 text-xs text-left w-full max-w-md mx-auto">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="font-bold text-white text-sm">{activeTab.label} Overview</span>
                <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300">
                  REAL-TIME PREVIEW
                </span>
              </div>

              {activeFeatureTab === 0 && (
                <div className="space-y-3">
                  <div className="rounded-xl bg-white/5 p-3 space-y-1">
                    <span className="text-slate-400 block text-[11px]">Usage Speed Change</span>
                    <strong className="text-emerald-400 text-sm">Sunflower Oil (-0.2L / day)</strong>
                  </div>
                  <div className="rounded-xl bg-white/5 p-3 space-y-1">
                    <span className="text-slate-400 block text-[11px]">Learned Family Loyalty</span>
                    <strong className="text-violet-400 text-sm">94% Confidence (Mom & Prakash)</strong>
                  </div>
                </div>
              )}

              {activeFeatureTab === 1 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-white">
                    <span>Monthly Budget: ₹5,000</span>
                    <span className="text-emerald-400 font-bold">₹1,850 Spent</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full bg-violet-600 w-[37%]" />
                  </div>
                  <p className="text-[11px] text-slate-400">Budget target on track. 63% buffer remaining.</p>
                </div>
              )}

              {activeFeatureTab === 2 && (
                <div className="space-y-3">
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 space-y-1">
                    <span className="font-bold text-emerald-300">Blinkit Order Ready</span>
                    <p className="text-slate-300 text-[11px]">12-min delivery slot reserved ahead of morning rain forecast.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="landing-workflow-section">
        <div className="landing-section-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">
              <Clock className="w-3.5 h-3.5" /> Simple 4-Step Process
            </span>
            <h2 className="landing-section-title">
              How <span className="text-violet-400">HomeSense Works</span>
            </h2>
            <p className="landing-section-subtitle">
              A seamless system that keeps your home stocked effortlessly.
            </p>
          </div>

          <div className="landing-workflow-grid">
            <WorkflowStep step={1} title="Track & Remember" description="Stores your supplies, preferred brands, and typical restocking schedules automatically." icon={Package} delay={0} />
            <WorkflowStep step={2} title="Predict Depletion" description="Calculates usage speed and alerts you days before items run out." icon={Brain} delay={150} />
            <WorkflowStep step={3} title="Smart Suggestions" description="Explains why items are flagged and suggests money-saving brand alternatives." icon={Eye} delay={300} />
            <WorkflowStep step={4} title="One-Tap Restock" description="Generates a ready-to-order shopping list. You review, approve, and done!" icon={ShoppingCart} delay={450} />
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="preview" className="landing-preview-section">
        <div className="landing-section-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">
              <Star className="w-3.5 h-3.5" /> Live Preview
            </span>
            <h2 className="landing-section-title">
              Your Household <span className="text-violet-400">Dashboard</span>
            </h2>
          </div>

          {/* ── Native UI Dashboard Preview Card ── */}
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-[#121722] p-6 shadow-2xl text-left text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Activity className="h-4 w-4 text-violet-400" />
                <span>Household Essentials Overview</span>
              </div>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1 text-[10px] font-bold text-emerald-300">
                12 ITEMS TRACKED · ALL STOCKED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                <span className="text-slate-400 text-[11px]">Stock Status</span>
                <div className="text-lg font-bold text-emerald-400">Normal 🟢</div>
                <p className="text-[10px] text-slate-400">8 items adequately stocked</p>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                <span className="text-slate-400 text-[11px]">Active Shopping Plan</span>
                <div className="text-lg font-bold text-white">8 Items (₹1,850)</div>
                <p className="text-[10px] text-violet-300">Ready for review</p>
              </div>

              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-1">
                <span className="text-slate-400 text-[11px]">Remaining Budget</span>
                <div className="text-lg font-bold text-emerald-400">₹3,150 Left</div>
                <p className="text-[10px] text-slate-400">Monthly limit: ₹5,000</p>
              </div>
            </div>
          </div>

          <div className="landing-preview-cta-wrap mt-8">
            <button onClick={() => openAuth('signin')} className="landing-btn-primary landing-btn-lg cursor-pointer">
              <span>Open Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="landing-final-cta">
        <div className="landing-final-cta-glow" />
        <div className="landing-section-container landing-final-cta-inner">
          <h2 className="landing-final-title">
            Ready for a <span className="text-violet-300">Stress-Free Home?</span>
          </h2>
          <p className="landing-final-subtitle">
            Never worry about forgotten groceries again. Let HomeSense organize your household essentials.
          </p>
          <button onClick={() => openAuth('register')} className="landing-btn-primary landing-btn-lg cursor-pointer">
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-section-container">
          <div className="landing-footer-inner">
            <HomeSenseLogo size="md" layout="stacked" href="/" />
            
            <p className="landing-footer-text font-mono text-xs text-violet-300/80 tracking-wider text-center">
              Smart Essentials Tracking · Never Run Out · Stress-Free Home Management
            </p>

            <div className="landing-footer-links">
              <button onClick={() => openAuth('signin')} className="landing-footer-link cursor-pointer">Dashboard</button>
              <button onClick={() => openAuth('signin')} className="landing-footer-link cursor-pointer">Inventory</button>
              <button onClick={() => openAuth('signin')} className="landing-footer-link cursor-pointer">Shopping Plan</button>
              <button onClick={() => openAuth('signin')} className="landing-footer-link cursor-pointer">Analytics</button>
            </div>
          </div>
        </div>
      </footer>

      {/* AUTHENTICATION MODAL */}
      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title=""
        subtitle=""
      >
        <div className="space-y-4 text-xs">
          <div className="flex flex-col items-center justify-center py-2 text-center border-b border-white/10">
            <h3 className="text-base font-extrabold text-white">
              {authTab === 'signin' ? 'Sign In to HomeSense' : 'Set Up Your Household'}
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-400">
              {authTab === 'signin'
                ? 'Access your smart household dashboard'
                : 'Set up your household name & member preferences'}
            </p>
          </div>
          <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setAuthTab('signin')}
              className={`flex-1 rounded-lg py-2 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === 'signin'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" /> Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthTab('register')}
              className={`flex-1 rounded-lg py-2 font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === 'register'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Home className="h-3.5 w-3.5" /> Create Account
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-3 pt-1">
            {authTab === 'register' && (
              <div>
                <label className="mb-1 block font-semibold text-slate-300">Household Name *</label>
                <div className="relative">
                  <Home className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={householdName}
                    onChange={(e) => setHouseholdName(e.target.value)}
                    placeholder="e.g. Marathe Household"
                    className="w-full rounded-xl border border-white/10 bg-[#121722] py-2 pl-9 pr-3 text-white focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {authTab === 'register' && (
              <div>
                <label className="mb-1 block font-semibold text-slate-300">Your Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="e.g. Prakash"
                    className="w-full rounded-xl border border-white/10 bg-[#121722] py-2 pl-9 pr-3 text-white focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1 block font-semibold text-slate-300">Account Email *</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="prakash@household.com"
                  className="w-full rounded-xl border border-white/10 bg-[#121722] py-2 pl-9 pr-3 text-white focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block font-semibold text-slate-300">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-white/10 bg-[#121722] py-2 pl-9 pr-3 text-white focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>

            {authError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-[11px] text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full rounded-xl bg-violet-600 py-3 text-xs font-bold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isAuthenticating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>{authTab === 'signin' ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : (
                <>
                  <span>{authTab === 'signin' ? 'Sign In' : 'Create Household Account'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
