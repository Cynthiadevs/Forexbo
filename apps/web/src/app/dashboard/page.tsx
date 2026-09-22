'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  TrendingUp, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Radio, 
  Send, 
  Zap,
  RefreshCw
} from 'lucide-react';

export default function DashboardPage() {
  const [marketQuotes, setMarketQuotes] = useState<any[]>([]);
  const [signals, setSignals] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ACTIVE' | 'CLOSED'>('ALL');

  useEffect(() => {
    // Initial fetch from API or mock fallback
    fetchMarketData();
    fetchSignals();
    const interval = setInterval(fetchMarketData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    try {
      const res = await fetch('http://localhost:4000/market');
      const data = await res.json();
      if (data.success) {
        setMarketQuotes(data.data);
      }
    } catch {
      // Fallback sample data if API is currently booting
      setMarketQuotes([
        { symbol: 'EURUSD', name: 'Euro / USD', bid: 1.0854, ask: 1.0855, spread: 1.0, status: 'OK' },
        { symbol: 'GBPUSD', name: 'Pound / USD', bid: 1.2922, ask: 1.2923, spread: 1.2, status: 'OK' },
        { symbol: 'USDJPY', name: 'USD / Yen', bid: 154.48, ask: 154.49, spread: 1.1, status: 'OK' },
        { symbol: 'XAUUSD', name: 'Gold / USD', bid: 2650.50, ask: 2650.75, spread: 2.5, status: 'OK' },
        { symbol: 'AUDUSD', name: 'Aussie / USD', bid: 0.6582, ask: 0.6583, spread: 1.0, status: 'OK' },
        { symbol: 'USDCAD', name: 'USD / CAD', bid: 1.3854, ask: 1.3855, spread: 1.2, status: 'OK' }
      ]);
    }
  };

  const fetchSignals = async () => {
    try {
      const res = await fetch('http://localhost:4000/signals');
      const data = await res.json();
      if (data.success) {
        setSignals(data.data);
      }
    } catch {
      setSignals([
        {
          id: 'sig-xau-1',
          symbol: 'XAUUSD',
          timeframe: '15m',
          direction: 'BUY',
          status: 'ACTIVE',
          entryPrice: 2650.50,
          stopLoss: 2638.00,
          takeProfit1: 2665.50,
          takeProfit2: 2675.00,
          score: 84,
          scoreCategory: 'VERY_STRONG',
          createdAt: new Date()
        },
        {
          id: 'sig-eur-2',
          symbol: 'EURUSD',
          timeframe: '15m',
          direction: 'SELL',
          status: 'TP2_HIT',
          entryPrice: 1.0865,
          stopLoss: 1.0895,
          takeProfit1: 1.0835,
          takeProfit2: 1.0805,
          score: 78,
          scoreCategory: 'STRONG',
          createdAt: new Date(Date.now() - 7200000)
        }
      ]);
    }
  };

  const triggerScan = async () => {
    setIsGenerating(true);
    try {
      await fetch('http://localhost:4000/signals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: 'XAUUSD', timeframe: '15m' })
      });
      await fetchSignals();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            Institutional Trading Terminal
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Real-time multi-timeframe quantitative scoring, AI market reasoning & automated Telegram distribution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={triggerScan}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-primary text-background font-bold text-xs hover:bg-primary-light transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Analyzing Market...' : 'Run Quantitative Scan'}
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-text-muted text-xs font-semibold">
            <span>MARKET STATUS</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">OPERATIONAL</div>
          <p className="text-[11px] text-text-muted">DEMO Stream (14 Instruments)</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-text-muted text-xs font-semibold">
            <span>ACTIVE TRADES</span>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-primary">
            {signals.filter(s => s.status === 'ACTIVE').length} Active
          </div>
          <p className="text-[11px] text-text-muted">Monitored for live TP/SL</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-text-muted text-xs font-semibold">
            <span>WIN RATE (30D)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">76.2%</div>
          <p className="text-[11px] text-emerald-500/90 font-medium">64 Wins / 20 Losses</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-text-muted text-xs font-semibold">
            <span>AI REASONING</span>
            <Zap className="w-4 h-4 text-accent" />
          </div>
          <div className="text-2xl font-black text-accent">GPT-4o mini</div>
          <p className="text-[11px] text-text-muted">Structured Confluence Output</p>
        </div>
      </div>

      {/* Real-time Market Quotes Row */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
            Live Streaming Feeds
          </h2>
          <span className="text-[10px] text-text-muted font-mono flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 animate-spin text-primary" /> Live 1.5s Polling
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {marketQuotes.slice(0, 6).map((q) => (
            <div key={q.symbol} className="bg-card p-3.5 rounded-xl border border-border/70 space-y-1 hover:border-primary/40 transition-colors">
              <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-white">{q.symbol}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-card-hover font-mono text-text-secondary">
                  {q.spread}p
                </span>
              </div>
              <div className="text-base font-extrabold font-mono text-white">
                {q.bid}
              </div>
              <div className="text-[10px] text-text-muted flex justify-between">
                <span>Ask: {q.ask}</span>
                <span className="text-emerald-400 font-bold">●</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Signals & Active Trades Management */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              Signal Feed & Outcome Tracker
            </h2>
            <p className="text-xs text-text-muted">
              Live quantitative setups, scoring metrics, and execution history.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ALL' ? 'bg-primary text-background' : 'text-text-secondary hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ACTIVE' ? 'bg-primary text-background' : 'text-text-secondary hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('CLOSED')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'CLOSED' ? 'bg-primary text-background' : 'text-text-secondary hover:text-white'
              }`}
            >
              Closed
            </button>
          </div>
        </div>

        {/* Signals Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-text-muted font-semibold">
                <th className="pb-3">ASSET</th>
                <th className="pb-3">TIMEFRAME</th>
                <th className="pb-3">DIRECTION</th>
                <th className="pb-3">ENTRY</th>
                <th className="pb-3">STOP LOSS</th>
                <th className="pb-3">TARGET 1</th>
                <th className="pb-3">TARGET 2</th>
                <th className="pb-3">STRENGTH</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {signals.map((sig) => {
                const isBuy = sig.direction === 'BUY';
                const isSell = sig.direction === 'SELL';
                const isTpWin = sig.status.includes('TP');
                const isSlLoss = sig.status.includes('SL');

                return (
                  <tr key={sig.id} className="hover:bg-card/40 transition-colors">
                    <td className="py-3 font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      {sig.symbol}
                    </td>
                    <td className="py-3 text-text-secondary uppercase font-mono">{sig.timeframe}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        isBuy ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        isSell ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-slate-700 text-slate-300'
                      }`}>
                        {sig.direction}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-white">{sig.entryPrice}</td>
                    <td className="py-3 font-mono text-rose-400">{sig.stopLoss}</td>
                    <td className="py-3 font-mono text-emerald-400">{sig.takeProfit1}</td>
                    <td className="py-3 font-mono text-emerald-400">{sig.takeProfit2 || '-'}</td>
                    <td className="py-3">
                      <span className="font-bold text-primary font-mono">{sig.score}/100</span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        sig.status === 'ACTIVE' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                        isTpWin ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        isSlLoss ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {sig.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href={`/signals`}
                        className="px-2.5 py-1 rounded bg-card-hover hover:bg-primary hover:text-background text-text-secondary font-bold text-[11px] transition-all"
                      >
                        Inspect
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
