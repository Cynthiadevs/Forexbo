'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Activity, 
  TrendingUp, 
  Layers, 
  BarChart2, 
  History, 
  Send, 
  ShieldCheck, 
  Sparkles,
  Radio
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Overview', icon: Sparkles },
    { href: '/dashboard', label: 'Dashboard', icon: Activity },
    { href: '/market', label: 'Live Market', icon: TrendingUp },
    { href: '/signals', label: 'Signals', icon: Layers },
    { href: '/performance', label: 'Performance', icon: BarChart2 },
    { href: '/backtesting', label: 'Backtest Lab', icon: History },
    { href: '/telegram', label: 'Telegram', icon: Send },
    { href: '/health', label: 'System Health', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-wider text-white bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              ALPHA QUANT <span className="text-primary font-black">FX</span>
            </span>
            <span className="block text-[10px] text-text-muted tracking-widest uppercase font-mono">
              AI FOREX INTELLIGENCE
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-card-hover text-primary border border-primary/20 shadow-sm'
                    : 'text-text-secondary hover:text-white hover:bg-card/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Status Indicator & Live Demo Pill */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>ENGINE LIVE</span>
          </div>

          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-lg bg-primary text-background font-bold text-xs hover:bg-primary-light transition-all shadow-md hover:shadow-primary/20"
          >
            Launch Terminal
          </Link>
        </div>
      </div>
    </header>
  );
}
