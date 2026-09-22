'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  BarChart3, 
  Sliders, 
  Globe, 
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function LandingPage() {
  const [selectedPair, setSelectedPair] = useState('XAUUSD');

  const pricingPlans = [
    {
      name: 'Free Starter',
      tier: 'FREE',
      price: '$0',
      period: 'forever',
      description: 'Explore automated signals on major pairs.',
      features: [
        '2 Signals per day',
        'EURUSD & GBPUSD access',
        'Public Telegram channel alerts',
        'Standard SL / TP levels',
        'Community support'
      ],
      cta: 'Start Free',
      popular: false
    },
    {
      name: 'Pro Quantitative',
      tier: 'PRO',
      price: '$49',
      period: '/month',
      description: 'For active traders demanding high-confluence setups.',
      features: [
        '10 Signals per day',
        'All Major Forex + Gold (XAUUSD)',
        'AI Confluence explanations',
        'Branded signal card images',
        'Multi-timeframe breakdown (4H, 1H, 15M)',
        'Historical backtesting lab'
      ],
      cta: 'Upgrade to Pro',
      popular: true
    },
    {
      name: 'VIP Institutional',
      tier: 'VIP',
      price: '$99',
      period: '/month',
      description: 'Complete automation for signals, Telegram channels, and funds.',
      features: [
        'Unlimited verified signals',
        'All 14 Forex & Metal instruments',
        'Direct Telegram Bot & Channel integration',
        'Real-time TP/SL trailing outcome alerts',
        'Daily institutional morning briefings',
        'Custom risk & scoring parameter overrides'
      ],
      cta: 'Get VIP Access',
      popular: false
    }
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-primary/30 text-primary text-xs font-semibold mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Institutional Forex AI & Automation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
          AI-POWERED <br />
          <span className="bg-gradient-to-r from-primary via-emerald-300 to-accent bg-clip-text text-transparent">
            FOREX INTELLIGENCE
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
          Analyze financial markets in real-time. Calculate multi-timeframe quantitative setups. Generate institutional AI reasoning and automatically publish branded signals to Telegram channels.
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-8 py-3.5 rounded-xl bg-primary text-background font-black text-sm hover:bg-primary-light transition-all flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105"
          >
            Launch Terminal
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/signals"
            className="px-8 py-3.5 rounded-xl glass-panel text-white font-bold text-sm hover:bg-card-hover transition-all border border-border flex items-center gap-2"
          >
            View Live Signals
          </Link>
        </div>

        {/* Highlights Bar */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-panel p-4 rounded-2xl">
            <span className="block text-2xl sm:text-3xl font-black text-primary">76.2%</span>
            <span className="text-xs text-text-muted font-medium">30-Day Win Rate</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <span className="block text-2xl sm:text-3xl font-black text-accent">1:2.35</span>
            <span className="text-xs text-text-muted font-medium">Average Risk:Reward</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <span className="block text-2xl sm:text-3xl font-black text-white">0-100</span>
            <span className="text-xs text-text-muted font-medium">Quantitative Scoring</span>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <span className="block text-2xl sm:text-3xl font-black text-primary">&lt; 200ms</span>
            <span className="text-xs text-text-muted font-medium">Signal Dispatch Latency</span>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (ARCHITECTURE PIPELINE) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-primary font-bold">Deterministic Quantitative Architecture</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">Never Trust Blind Prompts</p>
          <p className="mt-4 text-sm text-text-secondary">
            Unlike superficial bots that ask ChatGPT to guess prices, Alpha Quant FX executes rigorous quantitative algorithms first. AI is only used to interpret verified data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-2xl relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black">
              1
            </div>
            <h3 className="font-bold text-lg text-white">Market Ingestion</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Continuous tick ingestion across 14 Forex pairs and Metals with freshness validation, spread filtering, and candle integrity checks.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-black">
              2
            </div>
            <h3 className="font-bold text-lg text-white">Multi-Timeframe Engine</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Scans 4H trend, 1H structure, 15M setup, and 5M trigger to detect Break of Structure (BOS), EMA stack, and support/resistance confluences.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black">
              3
            </div>
            <h3 className="font-bold text-lg text-white">AI Reasoning Layer</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              When score reaches 70+, OpenAI synthesizes market context into structured JSON, explaining the trade setup with strict risk guidelines.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl relative space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black">
              4
            </div>
            <h3 className="font-bold text-lg text-white">Telegram & Outcome</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Renders branded social graphics and automatically publishes to Telegram. Monitors active trade ticks until TP1, TP2, TP3, or SL is triggered.
            </p>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SIGNAL SHOWCASE */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-border/80">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            
            {/* Left Description */}
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                Live Setup Breakdown
              </div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                Institutional Signal Cards with High-Res Social Graphics
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Every trade generated features precise ATR stop loss, tiered take profits (TP1, TP2, TP3), full risk/reward calculations, and AI confluence breakdown.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>ATR Dynamic & Structural Key Level Stop Loss</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>0–100 Quantitative Score with Full 8-Factor Breakdown</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Automated Breakeven Shifts upon TP1 Reach</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Link
                  href="/signals"
                  className="px-6 py-2.5 rounded-xl bg-primary text-background font-bold text-xs hover:bg-primary-light transition-all"
                >
                  Explore Signal Feed
                </Link>
                <Link
                  href="/backtesting"
                  className="px-6 py-2.5 rounded-xl bg-card-hover text-white font-bold text-xs hover:bg-card transition-all border border-border"
                >
                  Run Backtest
                </Link>
              </div>
            </div>

            {/* Right Graphic Preview Card */}
            <div className="w-full lg:w-[480px] bg-[#0A0E1A] p-6 rounded-2xl border border-primary/30 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-border/80 pb-4">
                <div>
                  <span className="text-2xl font-black text-white">XAUUSD</span>
                  <span className="block text-[11px] text-text-muted font-mono">GOLD / US DOLLAR • 15M</span>
                </div>
                <span className="px-3 py-1 rounded-xl bg-primary text-background font-black text-xs">
                  ▲ BUY SIGNAL
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card p-3 rounded-xl border border-border/60">
                  <span className="text-[10px] text-text-muted font-bold block uppercase">Entry Price</span>
                  <span className="text-xl font-bold font-mono text-white">2650.50</span>
                </div>
                <div className="bg-card p-3 rounded-xl border border-border/60">
                  <span className="text-[10px] text-red-400 font-bold block uppercase">Stop Loss</span>
                  <span className="text-xl font-bold font-mono text-red-400">2638.00</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-card p-2.5 rounded-xl border border-border/60 text-center">
                  <span className="text-[9px] text-primary font-bold block">TP1 (1:1.2)</span>
                  <span className="text-xs font-mono font-bold text-white">2665.50</span>
                </div>
                <div className="bg-card p-2.5 rounded-xl border border-border/60 text-center">
                  <span className="text-[9px] text-primary font-bold block">TP2 (1:2.0)</span>
                  <span className="text-xs font-mono font-bold text-white">2675.00</span>
                </div>
                <div className="bg-card p-2.5 rounded-xl border border-border/60 text-center">
                  <span className="text-[9px] text-primary font-bold block">TP3 (1:3.2)</span>
                  <span className="text-xs font-mono font-bold text-white">2690.00</span>
                </div>
              </div>

              <div className="bg-[#0C1424] p-3.5 rounded-xl border border-border/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-secondary font-medium">Signal Strength Score</span>
                  <span className="font-extrabold text-primary font-mono">84 / 100 [VERY STRONG]</span>
                </div>
                <div className="w-full h-2 bg-card rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent w-[84%]" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. PRICING PLANS */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-mono uppercase tracking-widest text-primary font-bold">Subscription Tiers</h2>
          <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-white">Choose Your Trading Edge</p>
          <p className="mt-4 text-sm text-text-secondary">
            Transparent pricing with zero hidden fees. Scale up as your trading strategy and Telegram audience grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.tier}
              className={`glass-panel p-8 rounded-3xl relative flex flex-col justify-between transition-all ${
                plan.popular ? 'border-primary/50 ring-2 ring-primary/30 shadow-2xl shadow-primary/10' : ''
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-background font-black text-[10px] uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-text-secondary mt-1">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-text-muted">{plan.period}</span>
                </div>

                <ul className="space-y-3 pt-4 border-t border-border/80 text-xs text-text-secondary">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/dashboard"
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                    plan.popular
                      ? 'bg-primary text-background hover:bg-primary-light shadow-md shadow-primary/20'
                      : 'bg-card-hover text-white hover:bg-card border border-border'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
