import {
  SignalDirection,
  SignalStatus,
  SignalStrengthCategory,
  MarketTrend,
  VolatilityLevel,
  Timeframe,
  NewsImpact,
  UserRole,
  SubscriptionTier,
  ContentType,
  DestinationType,
  MarketDataStatus,
  SLTPMethod
} from './enums.ts';

export interface Candle {
  timestamp: number; // epoch ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketTick {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  timestamp: number;
  status: MarketDataStatus;
}

export interface ValidationResult {
  isValid: boolean;
  status: MarketDataStatus;
  errors: string[];
  freshnessMs: number;
}

export interface TechnicalIndicators {
  symbol: string;
  timeframe: Timeframe;
  timestamp: number;
  ema20: number;
  ema50: number;
  ema200: number;
  sma50: number;
  sma200: number;
  rsi: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
    isBullishCrossover: boolean;
    isBearishCrossover: boolean;
  };
  atr: number;
  adx: {
    adx: number;
    plusDI: number;
    minusDI: number;
    trendStrength: 'WEAK' | 'MODERATE' | 'STRONG';
  };
  bollingerBands: {
    upper: number;
    middle: number;
    lower: number;
    bandwidth: number;
    percentB: number;
  };
  stochastic: {
    k: number;
    d: number;
    isOverbought: boolean;
    isOversold: boolean;
  };
  pivotPoints: {
    pivot: number;
    r1: number;
    r2: number;
    r3: number;
    s1: number;
    s2: number;
    s3: number;
  };
  trend: MarketTrend;
  volatility: VolatilityLevel;
  emaAlignment: 'BULLISH' | 'BEARISH' | 'MIXED';
}

export interface MarketStructure {
  symbol: string;
  timeframe: Timeframe;
  swingHighs: { price: number; timestamp: number }[];
  swingLows: { price: number; timestamp: number }[];
  supports: number[];
  resistances: number[];
  nearestSupport: number;
  nearestResistance: number;
  isBreakOfStructure: boolean;
  breakOfStructureType?: 'BULLISH_BOS' | 'BEARISH_BOS';
  isChangeOfCharacter: boolean;
  changeOfCharacterType?: 'BULLISH_CHOCH' | 'BEARISH_CHOCH';
  structureTrend: MarketTrend;
}

export interface TimeframeAnalysisResult {
  timeframe: Timeframe;
  trend: MarketTrend;
  trendScore: number; // 0 - 100
  momentum: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  keySupport: number;
  keyResistance: number;
  alignmentWithHigherTF: boolean;
}

export interface MultiTimeframeAnalysis {
  symbol: string;
  timestamp: number;
  overallTrend: MarketTrend;
  alignmentScore: number; // 0 - 100
  timeframes: {
    h4?: TimeframeAnalysisResult;
    h1?: TimeframeAnalysisResult;
    m15?: TimeframeAnalysisResult;
    m5?: TimeframeAnalysisResult;
  };
}

export interface SignalScoreBreakdown {
  trendScore: number;         // Max 20
  marketStructureScore: number;// Max 20
  momentumScore: number;       // Max 15
  supportResistanceScore: number;// Max 15
  emaAlignmentScore: number;   // Max 10
  rsiMacdScore: number;        // Max 10
  volatilityScore: number;     // Max 5
  newsFilterScore: number;     // Max 5
  totalScore: number;          // Max 100
}

export interface StrategySignalResult {
  symbol: string;
  timeframe: Timeframe;
  direction: SignalDirection;
  score: number;
  scoreCategory: SignalStrengthCategory;
  breakdown: SignalScoreBreakdown;
  qualifies: boolean;
  reason: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  riskRewardRatio1: number;
  riskRewardRatio2: number;
  riskRewardRatio3: number;
  sltpMethod: SLTPMethod;
  indicatorsSnapshot: TechnicalIndicators;
  marketStructure: MarketStructure;
  multiTimeframe: MultiTimeframeAnalysis;
}

export interface RiskFilterConfig {
  minRiskReward: number; // e.g. 1.5
  maxSpreadPips: number;
  maxDailySignalsPerPair: number;
  maxDailySignalsTotal: number;
  cooldownMinutesPerPair: number;
  newsBlackoutMinutesBefore: number;
  newsBlackoutMinutesAfter: number;
  allowTradingSessions: ('LONDON' | 'NEW_YORK' | 'TOKYO' | 'SYDNEY')[];
  maxVolatilityLevel: VolatilityLevel;
}

export interface RiskEvaluationResult {
  passed: boolean;
  rejectionReasons: string[];
  spreadPips: number;
  currentSession: string;
  newsBlackoutActive: boolean;
  upcomingHighImpactNews?: EconomicEvent;
}

export interface EconomicEvent {
  id: string;
  currency: string;
  event: string;
  impact: NewsImpact;
  scheduledTime: Date;
  actual?: string | null;
  forecast?: string | null;
  previous?: string | null;
}

export interface AIStructuredExplanation {
  summary: string;
  marketBias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  keyFactors: string[];
  riskFactors: string[];
  technicalConfluence: string[];
  caption: string;
  disclaimer: string;
  tokensUsed?: number;
  modelUsed?: string;
}

export interface TelegramDestinationConfig {
  id: string;
  name: string;
  chatId: string;
  type: DestinationType;
  enabled: boolean;
  signalsEnabled: boolean;
  analysisEnabled: boolean;
  newsEnabled: boolean;
  dailyReportEnabled: boolean;
  resultUpdatesEnabled: boolean;
}

export interface BrandingConfig {
  brandName: string;
  logoUrl?: string;
  website: string;
  telegramHandle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  disclaimerText: string;
}

export interface BacktestRequest {
  strategyId?: string;
  symbol: string;
  timeframe: Timeframe;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  riskPercentagePerTrade: number;
  minScoreToQualify: number;
}

export interface BacktestTradeResult {
  id: string;
  symbol: string;
  direction: SignalDirection;
  entryTime: Date;
  exitTime: Date;
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  outcome: 'TP1' | 'TP2' | 'TP3' | 'SL' | 'EXPIRED';
  pips: number;
  profitAmount: number;
  profitPercentage: number;
  score: number;
}

export interface BacktestSummary {
  symbol: string;
  timeframe: Timeframe;
  totalTrades: number;
  wins: number;
  losses: number;
  winRate: number;
  profitFactor: number;
  maxDrawdownPips: number;
  maxDrawdownPercentage: number;
  netProfit: number;
  netProfitPercentage: number;
  averageRiskReward: number;
  averageTradePips: number;
  largestWinPips: number;
  largestLossPips: number;
  trades: BacktestTradeResult[];
}

export interface SystemHealthReport {
  status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
  timestamp: string;
  uptimeSeconds: number;
  services: {
    api: { status: 'UP' | 'DOWN'; latencyMs: number };
    database: { status: 'UP' | 'DOWN'; latencyMs: number };
    redis: { status: 'UP' | 'DOWN'; latencyMs: number };
    marketData: { status: 'UP' | 'DOWN' | 'STALE'; provider: string; pairsActive: number };
    openai: { status: 'UP' | 'DOWN' | 'BUDGET_EXCEEDED'; model: string; dailySpendUsd: number };
    telegram: { status: 'UP' | 'DOWN'; destinationsCount: number };
    workers: { status: 'UP' | 'DOWN'; activeJobs: number; failedJobs: number };
  };
}
