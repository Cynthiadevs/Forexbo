import type {
  Candle,
  Timeframe,
  SignalDirection,
  SignalStrengthCategory,
  MarketTrend,
  VolatilityLevel,
  StrategySignalResult,
  SignalScoreBreakdown,
  SLTPMethod,
  EconomicEvent
} from '../../shared/src/index.ts';
import { TechnicalIndicatorsCalculator } from './indicators.ts';
import { MarketStructureAnalyzer } from './structure.ts';
import { MultiTimeframeAnalyzer } from './mtf.ts';
import { SLTPCalculator } from './sltp.ts';

export interface StrategyConfigOptions {
  weightTrend?: number;
  weightStructure?: number;
  weightMomentum?: number;
  weightSupportResistance?: number;
  weightEmaAlignment?: number;
  weightRsiMacd?: number;
  weightVolatility?: number;
  weightNewsFilter?: number;
  minScoreToQualify?: number;
  pipDecimal?: number;
}

export class QuantitativeSignalEngine {
  weights: Required<StrategyConfigOptions>;

  constructor(options: StrategyConfigOptions = {}) {
    this.weights = {
      weightTrend: options.weightTrend ?? 20,
      weightStructure: options.weightStructure ?? 20,
      weightMomentum: options.weightMomentum ?? 15,
      weightSupportResistance: options.weightSupportResistance ?? 15,
      weightEmaAlignment: options.weightEmaAlignment ?? 10,
      weightRsiMacd: options.weightRsiMacd ?? 10,
      weightVolatility: options.weightVolatility ?? 5,
      weightNewsFilter: options.weightNewsFilter ?? 5,
      minScoreToQualify: options.minScoreToQualify ?? 70,
      pipDecimal: options.pipDecimal ?? 4
    };
  }

  public evaluate(
    symbol: string,
    timeframe: Timeframe,
    candlesByTimeframe: {
      h4?: Candle[];
      h1?: Candle[];
      m15?: Candle[];
      m5?: Candle[];
    },
    economicEvents: EconomicEvent[] = []
  ): StrategySignalResult {
    const currentCandles = (candlesByTimeframe as any)[timeframe === '4h' ? 'h4' : timeframe === '1h' ? 'h1' : timeframe === '5m' ? 'm5' : 'm15'] || candlesByTimeframe.m15;

    if (!currentCandles || currentCandles.length < 20) {
      throw new Error(`Insufficient candle history for ${symbol} on ${timeframe}`);
    }

    const currentPrice = currentCandles[currentCandles.length - 1].close;

    const indicators = TechnicalIndicatorsCalculator.compileSnapshot(symbol, timeframe, currentCandles);
    const structure = MarketStructureAnalyzer.analyze(symbol, timeframe, currentCandles);
    const mtf = MultiTimeframeAnalyzer.analyze(symbol, candlesByTimeframe);

    const isBullishBias = mtf.overallTrend === 'BULLISH' || indicators.trend === 'BULLISH' || structure.structureTrend === 'BULLISH';
    const isBearishBias = mtf.overallTrend === 'BEARISH' || indicators.trend === 'BEARISH' || structure.structureTrend === 'BEARISH';

    let targetDirection: SignalDirection = 'WAIT';
    if (isBullishBias && !isBearishBias) {
      targetDirection = 'BUY';
    } else if (isBearishBias && !isBullishBias) {
      targetDirection = 'SELL';
    } else if (mtf.alignmentScore >= 50) {
      targetDirection = mtf.overallTrend === 'BEARISH' ? 'SELL' : 'BUY';
    } else {
      targetDirection = indicators.rsi >= 50 ? 'BUY' : 'SELL';
    }

    let trendScore = 0;
    if (targetDirection === 'BUY') {
      if (indicators.trend === 'STRONG_BULLISH') trendScore = 20;
      else if (indicators.trend === 'BULLISH') trendScore = 16;
      else if (indicators.trend === 'NEUTRAL') trendScore = 8;
    } else if (targetDirection === 'SELL') {
      if (indicators.trend === 'STRONG_BEARISH') trendScore = 20;
      else if (indicators.trend === 'BEARISH') trendScore = 16;
      else if (indicators.trend === 'NEUTRAL') trendScore = 8;
    }
    trendScore = (trendScore / 20) * this.weights.weightTrend;

    let structureScore = 0;
    if (targetDirection === 'BUY') {
      if (structure.breakOfStructureType === 'BULLISH_BOS') structureScore = 20;
      else if (structure.changeOfCharacterType === 'BULLISH_CHOCH') structureScore = 18;
      else if (structure.structureTrend === 'BULLISH') structureScore = 14;
      else structureScore = 6;
    } else if (targetDirection === 'SELL') {
      if (structure.breakOfStructureType === 'BEARISH_BOS') structureScore = 20;
      else if (structure.changeOfCharacterType === 'BEARISH_CHOCH') structureScore = 18;
      else if (structure.structureTrend === 'BEARISH') structureScore = 14;
      else structureScore = 6;
    }
    structureScore = (structureScore / 20) * this.weights.weightStructure;

    let momentumScore = 0;
    if (targetDirection === 'BUY') {
      if (indicators.macd.isBullishCrossover) momentumScore = 15;
      else if (indicators.macd.histogram > 0 && indicators.rsi > 50 && indicators.rsi < 68) momentumScore = 13;
      else if (indicators.rsi > 45 && indicators.rsi <= 65) momentumScore = 9;
      else momentumScore = 4;
    } else if (targetDirection === 'SELL') {
      if (indicators.macd.isBearishCrossover) momentumScore = 15;
      else if (indicators.macd.histogram < 0 && indicators.rsi < 50 && indicators.rsi > 32) momentumScore = 13;
      else if (indicators.rsi < 55 && indicators.rsi >= 35) momentumScore = 9;
      else momentumScore = 4;
    }
    momentumScore = (momentumScore / 15) * this.weights.weightMomentum;

    let srScore = 8;
    const distToSupport = Math.abs(currentPrice - structure.nearestSupport);
    const distToResistance = Math.abs(structure.nearestResistance - currentPrice);

    if (targetDirection === 'BUY') {
      if (distToSupport < distToResistance && currentPrice >= structure.nearestSupport) {
        srScore = 15;
      } else if (distToResistance > distToSupport * 2) {
        srScore = 12;
      }
    } else if (targetDirection === 'SELL') {
      if (distToResistance < distToSupport && currentPrice <= structure.nearestResistance) {
        srScore = 15;
      } else if (distToSupport > distToResistance * 2) {
        srScore = 12;
      }
    }
    srScore = (srScore / 15) * this.weights.weightSupportResistance;

    let emaScore = 0;
    if (targetDirection === 'BUY') {
      if (indicators.emaAlignment === 'BULLISH') emaScore = 10;
      else if (currentPrice > indicators.ema50) emaScore = 6;
      else emaScore = 2;
    } else if (targetDirection === 'SELL') {
      if (indicators.emaAlignment === 'BEARISH') emaScore = 10;
      else if (currentPrice < indicators.ema50) emaScore = 6;
      else emaScore = 2;
    }
    emaScore = (emaScore / 10) * this.weights.weightEmaAlignment;

    let rsiMacdScore = 5;
    if (targetDirection === 'BUY') {
      if (indicators.rsi >= 50 && indicators.rsi <= 65 && indicators.macd.histogram > 0 && !indicators.stochastic.isOverbought) {
        rsiMacdScore = 10;
      } else if (indicators.stochastic.isOversold && indicators.macd.histogram > 0) {
        rsiMacdScore = 8;
      }
    } else if (targetDirection === 'SELL') {
      if (indicators.rsi <= 50 && indicators.rsi >= 35 && indicators.macd.histogram < 0 && !indicators.stochastic.isOversold) {
        rsiMacdScore = 10;
      } else if (indicators.stochastic.isOverbought && indicators.macd.histogram < 0) {
        rsiMacdScore = 8;
      }
    }
    rsiMacdScore = (rsiMacdScore / 10) * this.weights.weightRsiMacd;

    let volScore = 5;
    if (indicators.volatility === 'EXTREME') volScore = 1;
    else if (indicators.volatility === 'LOW') volScore = 3;
    else volScore = 5;
    volScore = (volScore / 5) * this.weights.weightVolatility;

    let newsScore = 5;
    if (economicEvents.length > 0) {
      const hasHighImpactSoon = economicEvents.some(e => e.impact === 'HIGH');
      if (hasHighImpactSoon) newsScore = 2;
    }
    newsScore = (newsScore / 5) * this.weights.weightNewsFilter;

    const totalRaw = trendScore + structureScore + momentumScore + srScore + emaScore + rsiMacdScore + volScore + newsScore;
    const totalScore = Math.min(100, Math.max(0, Math.round(totalRaw)));

    let scoreCategory: SignalStrengthCategory = 'NO_TRADE';
    if (totalScore >= 80) scoreCategory = 'VERY_STRONG';
    else if (totalScore >= 70) scoreCategory = 'STRONG';
    else if (totalScore >= 60) scoreCategory = 'MODERATE';
    else if (totalScore >= 40) scoreCategory = 'WEAK';

    const qualifies = totalScore >= this.weights.minScoreToQualify && targetDirection !== 'WAIT';

    const sltp = SLTPCalculator.calculate(
      targetDirection,
      currentPrice,
      indicators,
      structure,
      this.weights.pipDecimal,
      'ATR_DYNAMIC'
    );

    const breakdown: SignalScoreBreakdown = {
      trendScore: Math.round(trendScore),
      marketStructureScore: Math.round(structureScore),
      momentumScore: Math.round(momentumScore),
      supportResistanceScore: Math.round(srScore),
      emaAlignmentScore: Math.round(emaScore),
      rsiMacdScore: Math.round(rsiMacdScore),
      volatilityScore: Math.round(volScore),
      newsFilterScore: Math.round(newsScore),
      totalScore
    };

    const reason = qualifies
      ? `Strong confluence identified: MTF alignment score ${mtf.alignmentScore}%, ${structure.structureTrend} market structure, and ${indicators.emaAlignment} EMA alignment.`
      : `Score of ${totalScore}/100 does not meet the minimum qualification threshold of ${this.weights.minScoreToQualify}.`;

    return {
      symbol,
      timeframe,
      direction: qualifies ? targetDirection : 'WAIT',
      score: totalScore,
      scoreCategory,
      breakdown,
      qualifies,
      reason,
      entryPrice: sltp.entryPrice,
      stopLoss: sltp.stopLoss,
      takeProfit1: sltp.takeProfit1,
      takeProfit2: sltp.takeProfit2,
      takeProfit3: sltp.takeProfit3,
      riskRewardRatio1: sltp.riskRewardRatio1,
      riskRewardRatio2: sltp.riskRewardRatio2,
      riskRewardRatio3: sltp.riskRewardRatio3,
      sltpMethod: sltp.method,
      indicatorsSnapshot: indicators,
      marketStructure: structure,
      multiTimeframe: mtf
    };
  }
}
