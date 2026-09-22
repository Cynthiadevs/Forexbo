export const SignalDirection = {
  BUY: 'BUY',
  SELL: 'SELL',
  WAIT: 'WAIT'
} as const;
export type SignalDirection = (typeof SignalDirection)[keyof typeof SignalDirection];

export const SignalStatus = {
  GENERATED: 'GENERATED',
  PUBLISHED: 'PUBLISHED',
  ACTIVE: 'ACTIVE',
  TP1_HIT: 'TP1_HIT',
  TP2_HIT: 'TP2_HIT',
  TP3_HIT: 'TP3_HIT',
  SL_HIT: 'SL_HIT',
  BREAKEVEN: 'BREAKEVEN',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
} as const;
export type SignalStatus = (typeof SignalStatus)[keyof typeof SignalStatus];

export const SignalStrengthCategory = {
  NO_TRADE: 'NO_TRADE',
  WEAK: 'WEAK',
  MODERATE: 'MODERATE',
  STRONG: 'STRONG',
  VERY_STRONG: 'VERY_STRONG'
} as const;
export type SignalStrengthCategory = (typeof SignalStrengthCategory)[keyof typeof SignalStrengthCategory];

export const MarketTrend = {
  STRONG_BULLISH: 'STRONG_BULLISH',
  BULLISH: 'BULLISH',
  NEUTRAL: 'NEUTRAL',
  BEARISH: 'BEARISH',
  STRONG_BEARISH: 'STRONG_BEARISH'
} as const;
export type MarketTrend = (typeof MarketTrend)[keyof typeof MarketTrend];

export const VolatilityLevel = {
  LOW: 'LOW',
  MODERATE: 'MODERATE',
  HIGH: 'HIGH',
  EXTREME: 'EXTREME'
} as const;
export type VolatilityLevel = (typeof VolatilityLevel)[keyof typeof VolatilityLevel];

export const Timeframe = {
  M1: '1m',
  M5: '5m',
  M15: '15m',
  M30: '30m',
  H1: '1h',
  H4: '4h',
  D1: '1d'
} as const;
export type Timeframe = (typeof Timeframe)[keyof typeof Timeframe];

export const NewsImpact = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH'
} as const;
export type NewsImpact = (typeof NewsImpact)[keyof typeof NewsImpact];

export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  ANALYST: 'ANALYST',
  EDITOR: 'EDITOR',
  USER: 'USER'
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const SubscriptionTier = {
  FREE: 'FREE',
  PRO: 'PRO',
  VIP: 'VIP',
  ENTERPRISE: 'ENTERPRISE'
} as const;
export type SubscriptionTier = (typeof SubscriptionTier)[keyof typeof SubscriptionTier];

export const ContentType = {
  MARKET_OUTLOOK: 'MARKET_OUTLOOK',
  FOREX_EDUCATION: 'FOREX_EDUCATION',
  TRADING_PSYCHOLOGY: 'TRADING_PSYCHOLOGY',
  ECONOMIC_NEWS: 'ECONOMIC_NEWS',
  WEEKLY_RECAP: 'WEEKLY_RECAP',
  DAILY_RECAP: 'DAILY_RECAP',
  MARKET_SUMMARY: 'MARKET_SUMMARY'
} as const;
export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export const DestinationType = {
  CHANNEL: 'CHANNEL',
  GROUP: 'GROUP',
  SUPERGROUP: 'SUPERGROUP',
  PRIVATE: 'PRIVATE'
} as const;
export type DestinationType = (typeof DestinationType)[keyof typeof DestinationType];

export const MarketDataStatus = {
  OK: 'OK',
  STALE: 'STALE',
  OUTAGE: 'OUTAGE',
  INVALID: 'INVALID'
} as const;
export type MarketDataStatus = (typeof MarketDataStatus)[keyof typeof MarketDataStatus];

export const SLTPMethod = {
  ATR_DYNAMIC: 'ATR_DYNAMIC',
  STRUCTURE_LEVEL: 'STRUCTURE_LEVEL',
  FIXED_RR: 'FIXED_RR',
  PIVOT_POINT: 'PIVOT_POINT'
} as const;
export type SLTPMethod = (typeof SLTPMethod)[keyof typeof SLTPMethod];
