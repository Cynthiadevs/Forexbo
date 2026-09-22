'use client';

import React, { useState, useEffect } from 'react';
import { Layers, Search, Filter, Zap, ArrowUpRight, ArrowDownRight, Eye, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function SignalsPage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<any | null>(null);
  const [directionFilter, setDirectionFilter] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchSignals();
  }, []);

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
          takeProfit3: 2690.00,
          riskRewardRatio1: 1.2,
          riskRewardRatio2: 1.96,
          riskRewardRatio3: 3.16,
          score: 84,
          scoreCategory: 'VERY_STRONG',
          sltpMethod: 'ATR_DYNAMIC',
          createdAt: new Date(),
          aiExplanation: {
            summary: 'Bullish orderblock defense combined with clean 4H/1H trend alignment and rising RSI momentum.',
            marketBias: 'BULLISH',
            keyFactors: ['Strong 4H/1H structural uptrend', 'Bullish MACD histogram expansion', 'Bounce at 2648 key institutional support'],
            riskFactors: ['Strict stop loss below 2638', 'Upcoming US Session volatility'],
            caption: '🟢 XAUUSD BUY SIGNAL\n\n📌 Entry: 2650.50\n🛑 Stop Loss: 2638.00\n🎯 TP1: 2665.50\n🎯 TP2: 2675.00\n🎯 TP3: 2690.00'
          }
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
          takeProfit3: 1.0775,
          riskRewardRatio1: 1.0,
          riskRewardRatio2: 2.0,
          riskRewardRatio3: 3.0,
          score: 78,
          scoreCategory: 'STRONG',
          sltpMethod: 'STRUCTURE_LEVEL',
          createdAt: new Date(Date.now() - 7200000),
          aiExplanation: {
            summary: 'Bearish liquidity sweep of session high followed by Bearish Break of Structure (BOS).',
            marketBias: 'BEARISH',
            keyFactors: ['Bearish BOS on 15M', 'Rejection at 1.0890 resistance', 'EMA 20/50 bearish crossover'],
            riskFactors: ['Monitor ECB speaker headlines'],
            caption: '🔴 EURUSD SELL SIGNAL\n\n📌 Entry: 1.0865\n🛑 Stop Loss: 1.0895\n🎯 TP1: 1.0835\n🎯 TP2: 1.0805'
          }
        },
        {
          id: 'sig-gbp-3',
          symbol: 'GBPUSD',
          timeframe: '1h',
          direction: 'BUY',
          status: 'TP1_HIT',
          entryPrice: 1.2910,
          stopLoss: 1.2865,
          takeProfit1: 1.2965,
          takeProfit2: 1.3000,
          takeProfit3: 1.3050,
          riskRewardRatio1: 1.22,
          riskRewardRatio2: 2.0,
          riskRewardRatio3: 3.11,
          score: 81,
          scoreCategory: 'VERY_STRONG',
          sltpMethod: 'ATR_DYNAMIC',
          createdAt: new Date(Date.now() - 14400000),
          aiExplanation: {
            summary: 'Institutional accumulation pattern above key demand zone with MACD bullish crossover.',
            marketBias: 'BULLISH',
            keyFactors: ['Daily higher low formed', 'Strong ADX 32 trend strength', 'EMA stack aligned bullish'],
            riskFactors: ['High volatility during London close'],
            caption: '🟢 GBPUSD BUY SIGNAL\n\n📌 Entry: 1.2910\n🛑 Stop Loss: 1.2865\n🎯 TP1: 1.2965'
          }
        }
      ]);
    }
  };

  const handleGenerateSignal = async (symbol = 'EURUSD') => {
    setIsGenerating(true);
    try {
      const res = await fetch('http://localhost:4000/signals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, timeframe: '15m' })
      });
      const data = await res.json();
      if (data.success) {
        await fetchSignals();
        setSelectedSignal(data.data);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredSignals = signals.filter(s => {
    const matchesDir = directionFilter === 'ALL' || s.direction === directionFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    const matchesSearch = s.symbol.toLowerCase().includes(search.toLowerCase());
    return matchesDir && matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-primary" />
            Verified Signal Hub
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            Historical and active trade setups generated by quantitative multi-timeframe engines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleGenerateSignal('XAUUSD')}
            disabled={isGenerating}
            className="px-4 py-2 rounded-xl bg-primary text-background font-bold text-xs hover:bg-primary-light transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Evaluating Market...' : 'Generate New Signal'}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by pair..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card border border-border rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary w-48"
            />
          </div>

          <div className="flex bg-card p-1 rounded-xl border border-border">
            {(['ALL', 'BUY', 'SELL'] as const).map(dir => (
              <button
                key={dir}
                onClick={() => setDirectionFilter(dir)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  directionFilter === dir ? 'bg-primary text-background' : 'text-text-secondary hover:text-white'
                }`}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="TP1_HIT">TP1 HIT</option>
            <option value="TP2_HIT">TP2 HIT</option>
            <option value="TP3_HIT">TP3 HIT</option>
            <option value="SL_HIT">SL HIT</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/80 text-text-muted font-semibold">
                <th className="pb-3">ID</th>
                <th className="pb-3">ASSET</th>
                <th className="pb-3">TF</th>
                <th className="pb-3">DIRECTION</th>
                <th className="pb-3">ENTRY</th>
                <th className="pb-3">STOP LOSS</th>
                <th className="pb-3">TP1 / TP2 / TP3</th>
                <th className="pb-3">STRENGTH</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right">INSPECT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {filteredSignals.map((sig) => {
                const isBuy = sig.direction === 'BUY';
                const isSell = sig.direction === 'SELL';
                const isTpWin = sig.status.includes('TP');
                const isSlLoss = sig.status.includes('SL');

                return (
                  <tr key={sig.id} className="hover:bg-card/40 transition-colors">
                    <td className="py-3 font-mono text-text-muted text-[10px]">{sig.id}</td>
                    <td className="py-3 font-extrabold text-white">{sig.symbol}</td>
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
                    <td className="py-3 font-mono text-emerald-400">
                      {sig.takeProfit1} / {sig.takeProfit2 || '-'} / {sig.takeProfit3 || '-'}
                    </td>
                    <td className="py-3 font-mono font-bold text-primary">
                      {sig.score}/100
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
                      <button
                        onClick={() => setSelectedSignal(sig)}
                        className="px-3 py-1 rounded bg-card-hover hover:bg-primary hover:text-background text-text-secondary font-bold text-xs transition-all inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Detail View */}
      {selectedSignal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0C1222] border border-border/80 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex justify-between items-start border-b border-border/80 pb-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-white">{selectedSignal.symbol}</span>
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black ${
                    selectedSignal.direction === 'BUY' ? 'bg-primary text-background' : 'bg-red-500 text-white'
                  }`}>
                    {selectedSignal.direction}
                  </span>
                  <span className="text-xs text-text-muted font-mono uppercase">{selectedSignal.timeframe}</span>
                </div>
                <span className="text-xs text-text-muted mt-1 block">ID: {selectedSignal.id}</span>
              </div>

              <button
                onClick={() => setSelectedSignal(null)}
                className="w-8 h-8 rounded-full bg-card flex items-center justify-center text-text-muted hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Price Levels Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-card p-3 rounded-xl border border-border/60">
                <span className="text-[10px] text-text-muted block uppercase font-bold">Entry Price</span>
                <span className="text-base font-extrabold font-mono text-white">{selectedSignal.entryPrice}</span>
              </div>
              <div className="bg-card p-3 rounded-xl border border-border/60">
                <span className="text-[10px] text-red-400 block uppercase font-bold">Stop Loss</span>
                <span className="text-base font-extrabold font-mono text-red-400">{selectedSignal.stopLoss}</span>
              </div>
              <div className="bg-card p-3 rounded-xl border border-border/60">
                <span className="text-[10px] text-emerald-400 block uppercase font-bold">Target 1 (TP1)</span>
                <span className="text-base font-extrabold font-mono text-emerald-400">{selectedSignal.takeProfit1}</span>
              </div>
              <div className="bg-card p-3 rounded-xl border border-border/60">
                <span className="text-[10px] text-emerald-400 block uppercase font-bold">Target 2 (TP2)</span>
                <span className="text-base font-extrabold font-mono text-emerald-400">{selectedSignal.takeProfit2 || '-'}</span>
              </div>
            </div>

            {/* Score Breakdown & AI Explanation */}
            {selectedSignal.aiExplanation && (
              <div className="bg-[#0E172B] p-5 rounded-2xl border border-primary/20 space-y-3">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  AI Quantitative Reasoning
                </h4>
                <p className="text-xs text-white leading-relaxed">
                  {selectedSignal.aiExplanation.summary}
                </p>
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <span className="text-[10px] text-text-muted uppercase font-bold">Key Confluences:</span>
                  {selectedSignal.aiExplanation.keyFactors?.map((k: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-text-secondary">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{k}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Telegram Caption Box */}
            {selectedSignal.aiExplanation?.caption && (
              <div className="space-y-2">
                <span className="text-[10px] text-text-muted uppercase font-bold">Telegram Caption Preview:</span>
                <pre className="p-4 rounded-2xl bg-card border border-border text-xs text-text-secondary font-mono whitespace-pre-wrap">
                  {selectedSignal.aiExplanation.caption}
                </pre>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
