'use client';

import './landing/landing.css';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles, Brain, ShoppingCart, BarChart3, Shield, Zap,
  ArrowRight, ChevronDown, Package, Eye, TrendingUp,
  RefreshCw, Menu, X, Star, Check, Clock
} from 'lucide-react';

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
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navOpacity = Math.min(scrollY / 200, 0.95);

  const featureTabs = [
    {
      id: 'predict',
      label: 'Smart Predictions',
      icon: Brain,
      image: '/images/feature-intelligence.png',
      heading: 'AI That Learns Your Household Rhythm',
      text: 'HomeSense observes purchase patterns, consumption velocity, and seasonal variations. It doesn\'t just track — it understands. Before you realize you\'re running low on cooking oil, HomeSense has already added it to your plan.',
      highlights: ['Consumption velocity tracking', 'Seasonal pattern recognition', 'Multi-member preference learning'],
    },
    {
      id: 'analytics',
      label: 'Deep Analytics',
      icon: BarChart3,
      image: '/images/feature-analytics.png',
      heading: 'Understand Your Household Like Never Before',
      text: 'Visual consumption trends, spending breakdowns, frequently purchased and forgotten items, shopping frequency insights — everything you need to optimize how your household runs.',
      highlights: ['Monthly spending heatmaps', 'Forgotten item detection', 'Category-wise consumption trends'],
    },
    {
      id: 'plan',
      label: 'Smart Shopping',
      icon: ShoppingCart,
      image: '/images/dashboard-mockup.png',
      heading: 'One-Tap Intelligent Shopping Plans',
      text: 'HomeSense compiles a shopping plan optimized for price, freshness, and delivery window. Compare across Blinkit, Zepto, and BigBasket — and approve with a single tap.',
      highlights: ['Multi-platform price comparison', 'Weather-aware delivery scheduling', 'Budget-optimized recommendations'],
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
          <Link href="/" className="landing-brand">
            <div className="landing-brand-icon">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="landing-brand-text">HomeSense</span>
          </Link>

          <div className="landing-nav-links">
            <a href="#features" className="landing-nav-link">Features</a>
            <a href="#how-it-works" className="landing-nav-link">How It Works</a>
            <a href="#preview" className="landing-nav-link">Preview</a>
            <Link href="/dashboard" className="landing-nav-cta">
              Enter Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <button
            className="landing-mobile-toggle"
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
            <a href="#preview" className="landing-mobile-link" onClick={() => setMobileMenuOpen(false)}>Preview</a>
            <Link href="/dashboard" className="landing-mobile-cta" onClick={() => setMobileMenuOpen(false)}>
              Enter Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
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
            <span>AI-Powered Household Intelligence</span>
          </div>

          <h1 className="landing-hero-title">
            Your Kitchen
            <span className="landing-hero-gradient"> Knows What </span>
            It Needs
          </h1>

          <p className="landing-hero-subtitle">
            HomeSense remembers every household pattern, predicts what will run low,
            and prepares a smart shopping plan — before you even realize something&apos;s missing.
          </p>

          <div className="landing-hero-actions">
            <Link href="/dashboard" className="landing-btn-primary">
              <span>Enter Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="#features" className="landing-btn-secondary">
              Explore Features
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </a>
          </div>

          <div className="landing-hero-stats">
            <AnimatedCounter end={12} label="Items Tracked" suffix="+" />
            <div className="landing-stat-divider" />
            <AnimatedCounter end={95} label="Prediction Accuracy" suffix="%" />
            <div className="landing-stat-divider" />
            <AnimatedCounter end={40} label="Time Saved" suffix="%" />
          </div>
        </div>

        <div
          className="landing-hero-image-wrap"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        >
          <Image
            src="/images/hero-bg.png"
            alt="HomeSense holographic household items"
            width={900}
            height={600}
            className="landing-hero-image"
            priority
          />
          <div className="landing-hero-image-glow" />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="landing-features-section">
        <div className="landing-section-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">
              <Zap className="w-3.5 h-3.5" /> Core Capabilities
            </span>
            <h2 className="landing-section-title">
              Intelligence That <span className="text-violet-400">Runs Your Home</span>
            </h2>
            <p className="landing-section-subtitle">
              Six powerful modules working together to keep your household running smoothly
            </p>
          </div>

          <div className="landing-features-grid">
            <FeatureCard
              icon={Eye}
              title="Real-Time Inventory"
              description="Track every household item with depletion rates, days remaining, and automatic restock alerts."
              gradient="linear-gradient(135deg, #7C3AED, #4F46E5)"
              delay={0}
            />
            <FeatureCard
              icon={Brain}
              title="Preference Learning"
              description="Mom picks Brand B over Brand A? The system learns and remembers every family member's preferences."
              gradient="linear-gradient(135deg, #EC4899, #8B5CF6)"
              delay={100}
            />
            <FeatureCard
              icon={RefreshCw}
              title="Smart Substitution"
              description="Preferred detergent unavailable? HomeSense suggests alternatives — similar size, 40% cheaper, available now."
              gradient="linear-gradient(135deg, #06B6D4, #3B82F6)"
              delay={200}
            />
            <FeatureCard
              icon={TrendingUp}
              title="Consumption Analytics"
              description="Frequently purchased, frequently forgotten, spending trends, shopping frequency — all in one dashboard."
              gradient="linear-gradient(135deg, #F59E0B, #EF4444)"
              delay={300}
            />
            <FeatureCard
              icon={ShoppingCart}
              title="AI Shopping Plans"
              description="Price-optimized across Blinkit, Zepto, BigBasket. Weather-aware delivery scheduling built in."
              gradient="linear-gradient(135deg, #10B981, #059669)"
              delay={400}
            />
            <FeatureCard
              icon={Shield}
              title="Household Memory"
              description="Every purchase, every preference, every pattern — stored and analyzed to serve your home better."
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
                  className={`landing-showcase-tab ${idx === activeFeatureTab ? 'active' : ''}`}
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
              <Link href="/dashboard" className="landing-showcase-cta">
                Try It Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="landing-showcase-image-wrap">
              <Image
                src={activeTab.image}
                alt={activeTab.heading}
                width={560}
                height={400}
                className="landing-showcase-image"
              />
              <div className="landing-showcase-image-glow" />
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="landing-workflow-section">
        <div className="landing-section-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">
              <Clock className="w-3.5 h-3.5" /> Continuous Loop
            </span>
            <h2 className="landing-section-title">
              How <span className="text-violet-400">HomeSense</span> Works
            </h2>
            <p className="landing-section-subtitle">
              A continuous intelligence loop that keeps your household running without friction
            </p>
          </div>

          <div className="landing-workflow-grid">
            <WorkflowStep step={1} title="Remember" description="Tracks every item, every purchase, every preference across all household members." icon={Package} delay={0} />
            <WorkflowStep step={2} title="Predict" description="AI analyzes consumption velocity, seasonal trends, and multi-member patterns." icon={Brain} delay={150} />
            <WorkflowStep step={3} title="Explain" description="Every recommendation comes with a clear reason — no black box decisions." icon={Eye} delay={300} />
            <WorkflowStep step={4} title="Recommend" description="Auto-generates optimized shopping plans. You approve, we handle the rest." icon={ShoppingCart} delay={450} />
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
              See the <span className="text-violet-400">Dashboard</span> in Action
            </h2>
          </div>

          <div className="landing-preview-wrap">
            <Image
              src="/images/dashboard-mockup.png"
              alt="HomeSense Dashboard Preview"
              width={1000}
              height={650}
              className="landing-preview-image"
            />
            <div className="landing-preview-glow" />
          </div>

          <div className="landing-preview-cta-wrap">
            <Link href="/dashboard" className="landing-btn-primary landing-btn-lg">
              <span>Open Live Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="landing-final-cta">
        <div className="landing-final-cta-glow" />
        <div className="landing-section-container landing-final-cta-inner">
          <h2 className="landing-final-title">
            Ready to Make Your Home <span className="text-violet-300">Intelligent</span>?
          </h2>
          <p className="landing-final-subtitle">
            Stop running out of essentials. Let HomeSense handle the thinking.
          </p>
          <Link href="/dashboard" className="landing-btn-primary landing-btn-lg">
            <span>Enter Dashboard — It&apos;s Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-section-container">
          <div className="landing-footer-inner">
            <div className="landing-footer-brand">
              <div className="landing-brand-icon">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="landing-brand-text">HomeSense</span>
            </div>
            <p className="landing-footer-text">
              Built with ❤️ for the Hackathon. AI-Powered Household Intelligence System.
            </p>
            <div className="landing-footer-links">
              <Link href="/dashboard" className="landing-footer-link">Dashboard</Link>
              <Link href="/inventory" className="landing-footer-link">Inventory</Link>
              <Link href="/shopping-plan" className="landing-footer-link">Shopping Plan</Link>
              <Link href="/household-memory" className="landing-footer-link">Analytics</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
