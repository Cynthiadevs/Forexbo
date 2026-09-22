import path from 'path';
import type { BrandingConfig, RiskFilterConfig } from '../../shared/src/index.ts';
import { Timeframe, VolatilityLevel } from '../../shared/src/index.ts';

export const SUPPORTED_PAIRS = [
  // Major Forex
  { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'FOREX', baseCurrency: 'EUR', quoteCurrency: 'USD', pipDecimal: 4, minSpread: 0.8, typicalVolatility: 0.005 },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', category: 'FOREX', baseCurrency: 'GBP', quoteCurrency: 'USD', pipDecimal: 4, minSpread: 1.2, typicalVolatility: 0.007 },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'FOREX', baseCurrency: 'USD', quoteCurrency: 'JPY', pipDecimal: 2, minSpread: 0.9, typicalVolatility: 0.006 },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', category: 'FOREX', baseCurrency: 'USD', quoteCurrency: 'CHF', pipDecimal: 4, minSpread: 1.1, typicalVolatility: 0.005 },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', category: 'FOREX', baseCurrency: 'AUD', quoteCurrency: 'USD', pipDecimal: 4, minSpread: 1.0, typicalVolatility: 0.006 },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', category: 'FOREX', baseCurrency: 'NZD', quoteCurrency: 'USD', pipDecimal: 4, minSpread: 1.3, typicalVolatility: 0.006 },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', category: 'FOREX', baseCurrency: 'USD', quoteCurrency: 'CAD', pipDecimal: 4, minSpread: 1.2, typicalVolatility: 0.005 },
  // Crosses
  { symbol: 'EURGBP', name: 'Euro / British Pound', category: 'FOREX', baseCurrency: 'EUR', quoteCurrency: 'GBP', pipDecimal: 4, minSpread: 1.2, typicalVolatility: 0.004 },
  { symbol: 'EURJPY', name: 'Euro / Japanese Yen', category: 'FOREX', baseCurrency: 'EUR', quoteCurrency: 'JPY', pipDecimal: 2, minSpread: 1.4, typicalVolatility: 0.007 },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', category: 'FOREX', baseCurrency: 'GBP', quoteCurrency: 'JPY', pipDecimal: 2, minSpread: 1.8, typicalVolatility: 0.009 },
  { symbol: 'GBPCHF', name: 'British Pound / Swiss Franc', category: 'FOREX', baseCurrency: 'GBP', quoteCurrency: 'CHF', pipDecimal: 4, minSpread: 1.7, typicalVolatility: 0.007 },
  { symbol: 'AUDJPY', name: 'Australian Dollar / Japanese Yen', category: 'FOREX', baseCurrency: 'AUD', quoteCurrency: 'JPY', pipDecimal: 2, minSpread: 1.5, typicalVolatility: 0.007 },
  // Metals
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', category: 'METALS', baseCurrency: 'XAU', quoteCurrency: 'USD', pipDecimal: 2, minSpread: 2.0, typicalVolatility: 0.015 },
  { symbol: 'XAGUSD', name: 'Silver / US Dollar', category: 'METALS', baseCurrency: 'XAG', quoteCurrency: 'USD', pipDecimal: 3, minSpread: 2.5, typicalVolatility: 0.020 },
];

export const DEFAULT_RISK_CONFIG: RiskFilterConfig = {
  minRiskReward: 1.8,
  maxSpreadPips: 3.5,
  maxDailySignalsPerPair: 3,
  maxDailySignalsTotal: 15,
  cooldownMinutesPerPair: 45,
  newsBlackoutMinutesBefore: 15,
  newsBlackoutMinutesAfter: 30,
  allowTradingSessions: ['LONDON', 'NEW_YORK', 'TOKYO', 'SYDNEY'],
  maxVolatilityLevel: VolatilityLevel.HIGH
};

export const DEFAULT_BRANDING: BrandingConfig = {
  brandName: process.env.BRAND_NAME || 'ALPHA QUANT FX',
  logoUrl: '/brand/logo.svg',
  website: process.env.BRAND_WEBSITE || 'https://alphaquantfx.io',
  telegramHandle: process.env.BRAND_TELEGRAM || '@AlphaQuantFX',
  primaryColor: process.env.BRAND_PRIMARY_COLOR || '#00E676',
  secondaryColor: process.env.BRAND_SECONDARY_COLOR || '#0A0F1D',
  accentColor: process.env.BRAND_ACCENT_COLOR || '#00B0FF',
  fontFamily: 'Inter, system-ui, sans-serif',
  disclaimerText: process.env.BRAND_DISCLAIMER || 'For educational and analysis purposes only. Forex trading involves significant financial risk.'
};

export const AppConfig = {
  env: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isDemoMode: (process.env.DEMO_MODE || 'true') === 'true',
  port: parseInt(process.env.PORT || '4000', 10),
  apiUrl: process.env.API_URL || 'http://localhost:4000',
  webUrl: process.env.WEB_URL || 'http://localhost:3000',

  db: {
    url: process.env.DATABASE_URL || 'postgresql://forex_user:forex_password@localhost:5432/forex_ai_db?schema=public'
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    maxDailyBudgetUsd: parseFloat(process.env.OPENAI_MAX_DAILY_BUDGET_USD || '10.00'),
    fallbackToTemplates: (process.env.AI_FALLBACK_TO_TEMPLATES || 'true') === 'true'
  },

  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    webhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET || 'dev_secret',
    defaultChannelId: process.env.TELEGRAM_DEFAULT_CHANNEL_ID || '@AlphaQuantFX'
  },

  marketData: {
    provider: (process.env.MARKET_DATA_PROVIDER || 'DEMO').toUpperCase(),
    apiKey: process.env.MARKET_DATA_API_KEY || '',
    apiUrl: process.env.MARKET_DATA_API_URL || 'https://api.polygon.io/v2',
    pollingIntervalMs: parseInt(process.env.MARKET_POLLING_INTERVAL_MS || '5000', 10),
    supportedTimeframes: [Timeframe.M1, Timeframe.M5, Timeframe.M15, Timeframe.M30, Timeframe.H1, Timeframe.H4, Timeframe.D1]
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production_123456789',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_jwt_key_change_in_production_987654321',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  branding: DEFAULT_BRANDING,
  risk: DEFAULT_RISK_CONFIG
};
