'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Activity, Search, RefreshCw, BarChart2, Zap } from 'lucide-react';

export default function MarketPage() {
  const [pairs, setPairs] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'FOREX' | 'METALS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPairAnalysis, setSelectedPairAnalysis] = useState<any | null>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  useEffect(() => {
    fetchMarketList();
    const interval = setInterval(fetchMarketList, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketList = async () => {
    try {
      const res = await fetch('http://localhost:4000/market');
      const data = await res.json();
      if (data.success) {
        setPairs(data.data);
      }
    } catch {
      // Fallback
      setPairs([
        { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'FOREX', bid: 1.0850, ask: 1.0851, spread: 1.0, status: 'OK' },
        { symbol: 'GBPUSD', name: 'British Pound / US Dollar', category: 'FOREX', bid: 1.2920, ask: 1.2921, spread: 1.2, status: 'OK' },
        { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'FOREX', bid: 154.50, ask: 154.51, spread: 1.1, status: 'OK' },
        { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', category: 'FOREX', bid: 0.8850, ask: 0.8851, spread: 1.2, status: 'OK' },
        { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', category: 'FOREX', bid: 0.6580, ask: 0.6581, spread: 1.0, status: 'OK' },
        { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', category: 'FOREX', bid: 1.3850, ask: 1.3851, spread: 1.3, status: 'OK' },
        { symbol: 'XAUUSD', name: 'Gold / US Dollar', category: 'METALS', bid: 2650.50, ask: 2650.75, spread: 2.5, status: 'OK' },
        { symbol: 'XAGUSD', name: 'Silver / US Dollar', category: 'METALS', bid: 31.85, ask: 31.87, spread: 2.2, status: 'OK' }
      ]);
    }
  };

  const handleInspectAnalysis = async (symbol: string) => {
    setIsLoadingAnalysis(true);
    try {
      const res = await fetch(`http://localhost:4000/market/${symbol}/analysis`);
      const data = await res.json();
      if (data.success) {
        setSelectedPairAnalysis(data.data);
      }
    } catch {
      setSelectedPairAnalysis({
        symbol,
        indicators: {
          trend: 'BULLISH',
          rsi: 61.4,
          emaAlignment: 'BULLISH',
          volatility: 'MODERATE',
          adx: { adx: 28.5, trendStrength: 'MODERATE' }
        },
        structure: {
          nearestSupport: 2645.0,
          nearestResistance: 2662.0,
          structureTrend: 'BULLISH'
        },
        mtf: {
          overallTrend: 'BULLISH',
          alignmentScore: 82
        }
      });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const filtered = pairs.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = p.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Live Market Scanner
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real-time bid, ask, spread, and institutional structure across all monitored instruments.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border border-border rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary w-48"
            />
          </div>

          <div className="flex bg-card p-1 rounded-xl border border-border">
            {(['ALL', 'FOREX', 'METALS'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat ? 'bg-primary text-background' : 'text-text-secondary hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of pairs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((pair) => (
          <div
            key={pair.symbol}
            className="glass-panel p-5 rounded-2xl border border-border hover:border-primary/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-lg font-black text-white">{pair.symbol}</span>
                <span className="block text-[11px] text-text-muted">{pair.name}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                {pair.category}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-card p-3 rounded-xl border border-border/60">
              <div>
                <span className="text-[10px] text-text-muted block">BID</span>
                <span className="text-base font-extrabold font-mono text-white">{pair.bid}</span>
              </div>
              <div>
                <span className="text-[10px] text-text-muted block">ASK</span>
                <span className="text-base font-extrabold font-mono text-white">{pair.ask}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
              <span className="text-text-muted">Spread: <strong className="text-text-secondary font-mono">{pair.spread} pips</strong></span>
              <button
                onClick={() => handleInspectAnalysis(pair.symbol)}
                className="px-3 py-1 rounded-lg bg-card-hover hover:bg-primary hover:text-background text-text-secondary font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3 h-3" />
                Analyze
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Technical Confluence Drawer/Modal if clicked */}
      {selectedPairAnalysis && (
        <div className="glass-panel p-6 rounded-3xl border border-primary/40 space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex justify-between items-center border-b border-border/80 pb-3">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-primary" />
              Quantitative Confluence Breakdown: {selectedPairAnalysis.symbol}
            </h3>
            <button
              onClick={() => setSelectedPairAnalysis(null)}
              className="text-xs text-text-muted hover:text-white"
            >
              ✕ Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-xl border border-border/60 space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-bold">Multi-Timeframe Alignment</span>
              <div className="text-xl font-extrabold text-primary font-mono">
                {selectedPairAnalysis.mtf?.alignmentScore || 80}% Agreement
              </div>
              <p className="text-xs text-text-secondary">Bias: {selectedPairAnalysis.mtf?.overallTrend}</p>
            </div>

            <div className="bg-card p-4 rounded-xl border border-border/60 space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-bold">Key Institutional Zones</span>
              <div className="text-xs font-mono text-white space-y-1 pt-1">
                <div>Support: <strong className="text-primary">{selectedPairAnalysis.structure?.nearestSupport}</strong></div>
                <div>Resistance: <strong className="text-accent">{selectedPairAnalysis.structure?.nearestResistance}</strong></div>
              </div>
            </div>

            <div className="bg-card p-4 rounded-xl border border-border/60 space-y-1">
              <span className="text-[10px] text-text-muted uppercase font-bold">Momentum / Oscillators</span>
              <div className="text-xs font-mono text-white space-y-1 pt-1">
                <div>RSI (14): <strong>{selectedPairAnalysis.indicators?.rsi}</strong></div>
                <div>EMA Stack: <strong className="text-primary">{selectedPairAnalysis.indicators?.emaAlignment}</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
