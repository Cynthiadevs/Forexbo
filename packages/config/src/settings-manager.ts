import fs from 'fs';
import path from 'path';
import { AppConfig, DEFAULT_BRANDING, DEFAULT_RISK_CONFIG } from './index.ts';

export interface PlatformSettings {
  // Telegram & Channels
  telegramBotToken: string;
  telegramChannelId: string;
  telegramGroupId: string;
  telegramWebhookSecret?: string;

  // AI & OpenAI
  openaiApiKey: string;
  openaiModel: string;
  openaiMaxDailyBudget: number;
  aiFallbackToTemplates: boolean;

  // Market Feed & Demo Mode
  demoMode: boolean;
  marketDataProvider: 'DEMO' | 'POLYGON';
  marketDataApiKey: string;
  marketPollingIntervalMs: number;

  // Branding
  brandName: string;
  brandWebsite: string;
  brandTelegram: string;
  disclaimerText: string;

  // Post & Automation Controls
  autoPostingEnabled: boolean;
  maxDailyPosts: number;
  postsSentToday: number;
  lastPostDate: string;
  postScheduleType: 'ON_SIGNAL' | 'SCHEDULED_HOURS' | 'INTERVAL_HOURLY';
  scheduledHoursUtc: number[]; // e.g. [7, 8, 13, 14, 15]
  minScoreToPost: number; // e.g. 70
  includePhoto: boolean;
  photoStyle: 'BRANDED_SIGNAL_CARD' | 'INFORMATIONAL_ANALYSIS_CARD' | 'TEXT_ONLY';
  includeAiExplanation: boolean;
  includeRiskDisclaimer: boolean;

  // Admin Credentials
  adminEmail: string;
  adminPasswordHash?: string;
  jwtSecret: string;
}

const SETTINGS_FILE_PATH = path.resolve(process.cwd(), 'storage', 'settings.json');

export class SettingsManager {
  private static instance: SettingsManager;
  private settings: PlatformSettings;

  private constructor() {
    this.settings = this.loadInitialSettings();
    this.syncToAppConfig();
  }

  public static getInstance(): SettingsManager {
    if (!SettingsManager.instance) {
      SettingsManager.instance = new SettingsManager();
    }
    return SettingsManager.instance;
  }

  private loadInitialSettings(): PlatformSettings {
    const today = new Date().toISOString().split('T')[0];

    const defaults: PlatformSettings = {
      telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
      telegramChannelId: process.env.TELEGRAM_DEFAULT_CHANNEL_ID || '@AlphaQuantFX',
      telegramGroupId: process.env.TELEGRAM_GROUP_ID || '@AlphaQuantPublic',
      telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET || 'dev_secret',

      openaiApiKey: process.env.OPENAI_API_KEY || '',
      openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      openaiMaxDailyBudget: parseFloat(process.env.OPENAI_MAX_DAILY_BUDGET_USD || '10.00'),
      aiFallbackToTemplates: (process.env.AI_FALLBACK_TO_TEMPLATES || 'true') === 'true',

      demoMode: (process.env.DEMO_MODE || 'true') === 'true',
      marketDataProvider: (process.env.MARKET_DATA_PROVIDER || 'DEMO').toUpperCase() as any,
      marketDataApiKey: process.env.MARKET_DATA_API_KEY || '',
      marketPollingIntervalMs: parseInt(process.env.MARKET_POLLING_INTERVAL_MS || '5000', 10),

      brandName: process.env.BRAND_NAME || 'ALPHA QUANT FX',
      brandWebsite: process.env.BRAND_WEBSITE || 'https://alphaquantfx.io',
      brandTelegram: process.env.BRAND_TELEGRAM || '@AlphaQuantFX',
      disclaimerText: process.env.BRAND_DISCLAIMER || 'For educational and analysis purposes only. Forex trading involves risk.',

      autoPostingEnabled: true,
      maxDailyPosts: 8,
      postsSentToday: 0,
      lastPostDate: today,
      postScheduleType: 'ON_SIGNAL',
      scheduledHoursUtc: [7, 8, 9, 12, 13, 14, 15, 16], // London & New York session hours
      minScoreToPost: 70,
      includePhoto: true,
      photoStyle: 'BRANDED_SIGNAL_CARD',
      includeAiExplanation: true,
      includeRiskDisclaimer: true,

      adminEmail: process.env.ADMIN_EMAIL || 'admin@alphaquantfx.io',
      jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_change_in_production_123456789'
    };

    try {
      if (fs.existsSync(SETTINGS_FILE_PATH)) {
        const raw = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        return { ...defaults, ...parsed };
      }
    } catch (err) {
      console.warn('[SettingsManager] Could not read settings file, using defaults:', err);
    }

    return defaults;
  }

  public getSettings(): PlatformSettings {
    const today = new Date().toISOString().split('T')[0];
    if (this.settings.lastPostDate !== today) {
      this.settings.postsSentToday = 0;
      this.settings.lastPostDate = today;
      this.persist();
    }
    return { ...this.settings };
  }

  public updateSettings(partial: Partial<PlatformSettings>): PlatformSettings {
    this.settings = { ...this.settings, ...partial };
    this.syncToAppConfig();
    this.persist();
    return { ...this.settings };
  }

  public canPostToday(): boolean {
    const s = this.getSettings();
    if (!s.autoPostingEnabled) return false;
    if (s.postsSentToday >= s.maxDailyPosts) return false;

    if (s.postScheduleType === 'SCHEDULED_HOURS') {
      const currentUtcHour = new Date().getUTCHours();
      if (!s.scheduledHoursUtc.includes(currentUtcHour)) {
        return false;
      }
    }

    return true;
  }

  public recordPostSent(): void {
    const today = new Date().toISOString().split('T')[0];
    if (this.settings.lastPostDate !== today) {
      this.settings.postsSentToday = 1;
      this.settings.lastPostDate = today;
    } else {
      this.settings.postsSentToday += 1;
    }
    this.persist();
  }

  private syncToAppConfig(): void {
    AppConfig.telegram.botToken = this.settings.telegramBotToken;
    AppConfig.telegram.defaultChannelId = this.settings.telegramChannelId;
    AppConfig.openai.apiKey = this.settings.openaiApiKey;
    AppConfig.openai.model = this.settings.openaiModel;
    AppConfig.openai.maxDailyBudgetUsd = this.settings.openaiMaxDailyBudget;
    AppConfig.isDemoMode = this.settings.demoMode;
    AppConfig.branding.brandName = this.settings.brandName;
    AppConfig.branding.website = this.settings.brandWebsite;
    AppConfig.branding.telegramHandle = this.settings.brandTelegram;
  }

  private persist(): void {
    try {
      const dir = path.dirname(SETTINGS_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(this.settings, null, 2), 'utf-8');
    } catch (err) {
      console.error('[SettingsManager] Failed to persist settings to disk:', err);
    }
  }
}
