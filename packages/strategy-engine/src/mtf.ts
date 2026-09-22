import type { Candle, Timeframe, MultiTimeframeAnalysis, TimeframeAnalysisResult, MarketTrend } from '../../shared/src/index.ts';
import { TechnicalIndicatorsCalculator } from './indicators.ts';
import { MarketStructureAnalyzer } from './structure.ts';

export class MultiTimeframeAnalyzer {
  public static analyze(
    symbol: string,
    candlesByTimeframe: {
      h4?: Candle[];
      h1?: Candle[];
      m15?: Candle[];
      m5?: Candle[];
    }
  ): MultiTimeframeAnalysis {
    const timeframes: MultiTimeframeAnalysis['timeframes'] = {};

    let totalWeight = 0;
    let weightedScore = 0;
    let bullishWeight = 0;
    let bearishWeight = 0;

    // 4H Analysis (Weight: 35)
    if (candlesByTimeframe.h4 && candlesByTimeframe.h4.length >= 20) {
      const snap = TechnicalIndicatorsCalculator.compileSnapshot(symbol, '4h', candlesByTimeframe.h4);
      const struct = MarketStructureAnalyzer.analyze(symbol, '4h', candlesByTimeframe.h4);
      const isBull = snap.trend === 'BULLISH' || snap.trend === 'STRONG_BULLISH';
      const isBear = snap.trend === 'BEARISH' || snap.trend === 'STRONG_BEARISH';

      timeframes.h4 = {
        timeframe: '4h',
        trend: snap.trend,
        trendScore: isBull ? 85 : isBear ? 15 : 50,
        momentum: snap.macd.histogram > 0 ? 'BULLISH' : 'BEARISH',
        keySupport: struct.nearestSupport,
        keyResistance: struct.nearestResistance,
        alignmentWithHigherTF: true
      };

      const w = 35;
      totalWeight += w;
      if (isBull) bullishWeight += w;
      if (isBear) bearishWeight += w;
      weightedScore += timeframes.h4.trendScore * (w / 100);
    }

    // 1H Analysis (Weight: 30)
    if (candlesByTimeframe.h1 && candlesByTimeframe.h1.length >= 20) {
      const snap = TechnicalIndicatorsCalculator.compileSnapshot(symbol, '1h', candlesByTimeframe.h1);
      const struct = MarketStructureAnalyzer.analyze(symbol, '1h', candlesByTimeframe.h1);
      const isBull = snap.trend === 'BULLISH' || snap.trend === 'STRONG_BULLISH';
      const isBear = snap.trend === 'BEARISH' || snap.trend === 'STRONG_BEARISH';

      timeframes.h1 = {
        timeframe: '1h',
        trend: snap.trend,
        trendScore: isBull ? 85 : isBear ? 15 : 50,
        momentum: snap.macd.histogram > 0 ? 'BULLISH' : 'BEARISH',
        keySupport: struct.nearestSupport,
        keyResistance: struct.nearestResistance,
        alignmentWithHigherTF: (timeframes.h4?.trend === snap.trend)
      };

      const w = 30;
      totalWeight += w;
      if (isBull) bullishWeight += w;
      if (isBear) bearishWeight += w;
      weightedScore += timeframes.h1.trendScore * (w / 100);
    }

    // 15M Analysis (Weight: 25)
    if (candlesByTimeframe.m15 && candlesByTimeframe.m15.length >= 20) {
      const snap = TechnicalIndicatorsCalculator.compileSnapshot(symbol, '15m', candlesByTimeframe.m15);
      const struct = MarketStructureAnalyzer.analyze(symbol, '15m', candlesByTimeframe.m15);
      const isBull = snap.trend === 'BULLISH' || snap.trend === 'STRONG_BULLISH';
      const isBear = snap.trend === 'BEARISH' || snap.trend === 'STRONG_BEARISH';

      timeframes.m15 = {
        timeframe: '15m',
        trend: snap.trend,
        trendScore: isBull ? 85 : isBear ? 15 : 50,
        momentum: snap.macd.histogram > 0 ? 'BULLISH' : 'BEARISH',
        keySupport: struct.nearestSupport,
        keyResistance: struct.nearestResistance,
        alignmentWithHigherTF: (timeframes.h1?.trend === snap.trend)
      };

      const w = 25;
      totalWeight += w;
      if (isBull) bullishWeight += w;
      if (isBear) bearishWeight += w;
      weightedScore += timeframes.m15.trendScore * (w / 100);
    }

    // 5M Analysis (Weight: 10)
    if (candlesByTimeframe.m5 && candlesByTimeframe.m5.length >= 20) {
      const snap = TechnicalIndicatorsCalculator.compileSnapshot(symbol, '5m', candlesByTimeframe.m5);
      const struct = MarketStructureAnalyzer.analyze(symbol, '5m', candlesByTimeframe.m5);
      const isBull = snap.trend === 'BULLISH' || snap.trend === 'STRONG_BULLISH';
      const isBear = snap.trend === 'BEARISH' || snap.trend === 'STRONG_BEARISH';

      timeframes.m5 = {
        timeframe: '5m',
        trend: snap.trend,
        trendScore: isBull ? 85 : isBear ? 15 : 50,
        momentum: snap.macd.histogram > 0 ? 'BULLISH' : 'BEARISH',
        keySupport: struct.nearestSupport,
        keyResistance: struct.nearestResistance,
        alignmentWithHigherTF: (timeframes.m15?.trend === snap.trend)
      };

      const w = 10;
      totalWeight += w;
      if (isBull) bullishWeight += w;
      if (isBear) bearishWeight += w;
      weightedScore += timeframes.m5.trendScore * (w / 100);
    }

    let overallTrend: MarketTrend = 'NEUTRAL';
    let alignmentScore = 50;

    if (totalWeight > 0) {
      if (bullishWeight / totalWeight >= 0.65) {
        overallTrend = 'BULLISH';
        alignmentScore = Math.round((bullishWeight / totalWeight) * 100);
      } else if (bearishWeight / totalWeight >= 0.65) {
        overallTrend = 'BEARISH';
        alignmentScore = Math.round((bearishWeight / totalWeight) * 100);
      } else {
        alignmentScore = Math.round(50 - Math.abs(bullishWeight - bearishWeight));
      }
    }

    return {
      symbol,
      timestamp: Date.now(),
      overallTrend,
      alignmentScore,
      timeframes
    };
  }
}
