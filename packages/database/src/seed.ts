import { PrismaClient, UserRoleEnum, SubscriptionTierEnum, DestinationTypeEnum } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SUPPORTED_PAIRS, DEFAULT_RISK_CONFIG, DEFAULT_BRANDING } from '@forex/config';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Roles & Permissions
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Full system access and master controls' },
    { name: 'ADMIN', description: 'System administration and management' },
    { name: 'ANALYST', description: 'Market analysis and signal review' },
    { name: 'EDITOR', description: 'Content and prompt editing' },
    { name: 'USER', description: 'Standard subscriber user' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  // 2. Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@alphaquantfx.io';
  const rawPassword = process.env.ADMIN_PASSWORD || 'AdminSecurePassword123!';
  const passwordHash = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: UserRoleEnum.SUPER_ADMIN },
    create: {
      email: adminEmail,
      name: 'Super Administrator',
      passwordHash,
      role: UserRoleEnum.SUPER_ADMIN,
      isActive: true,
    },
  });
  console.log(`👤 Created/Verified Super Admin: ${admin.email}`);

  // 3. Subscription Plans
  const plans = [
    {
      name: 'Free Starter',
      tier: SubscriptionTierEnum.FREE,
      priceMonthly: 0,
      priceYearly: 0,
      maxSignalsPerDay: 2,
      allowedPairs: ['EURUSD', 'GBPUSD'],
      aiAnalysisAccess: false,
      backtestAccess: false,
      telegramAlerts: true,
      customAlerts: false,
    },
    {
      name: 'Pro Trader',
      tier: SubscriptionTierEnum.PRO,
      priceMonthly: 49,
      priceYearly: 490,
      maxSignalsPerDay: 10,
      allowedPairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'XAUUSD'],
      aiAnalysisAccess: true,
      backtestAccess: true,
      telegramAlerts: true,
      customAlerts: true,
    },
    {
      name: 'VIP Quantitative',
      tier: SubscriptionTierEnum.VIP,
      priceMonthly: 99,
      priceYearly: 990,
      maxSignalsPerDay: 50,
      allowedPairs: ['*'],
      aiAnalysisAccess: true,
      backtestAccess: true,
      telegramAlerts: true,
      customAlerts: true,
    },
    {
      name: 'Enterprise / Fund',
      tier: SubscriptionTierEnum.ENTERPRISE,
      priceMonthly: 299,
      priceYearly: 2990,
      maxSignalsPerDay: 999,
      allowedPairs: ['*'],
      aiAnalysisAccess: true,
      backtestAccess: true,
      telegramAlerts: true,
      customAlerts: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { tier: plan.tier },
      update: plan,
      create: plan,
    });
  }

  // 4. Forex Pairs & Metals
  for (let i = 0; i < SUPPORTED_PAIRS.length; i++) {
    const pair = SUPPORTED_PAIRS[i];
    await prisma.forexPair.upsert({
      where: { symbol: pair.symbol },
      update: {
        name: pair.name,
        category: pair.category,
        baseCurrency: pair.baseCurrency,
        quoteCurrency: pair.quoteCurrency,
        pipDecimal: pair.pipDecimal,
        minSpread: pair.minSpread,
        displayOrder: i + 1,
      },
      create: {
        symbol: pair.symbol,
        name: pair.name,
        category: pair.category,
        baseCurrency: pair.baseCurrency,
        quoteCurrency: pair.quoteCurrency,
        pipDecimal: pair.pipDecimal,
        minSpread: pair.minSpread,
        displayOrder: i + 1,
        isActive: true,
      },
    });
  }
  console.log(`📊 Seeded ${SUPPORTED_PAIRS.length} Forex Pairs and Metals`);

  // 5. Default Strategies
  const strategies = [
    {
      name: 'Smart Money Multi-Confluence',
      slug: 'smart-money-multi-confluence',
      description: 'Institutional market structure analysis combining Break of Structure (BOS), Change of Character (CHoCH), OrderBlock zones, and multi-timeframe EMA trend alignment.',
      isEnabled: true,
      weightTrend: 20,
      weightStructure: 20,
      weightMomentum: 15,
      weightSupportResistance: 15,
      weightEmaAlignment: 10,
      weightRsiMacd: 10,
      weightVolatility: 5,
      weightNewsFilter: 5,
      minScoreToQualify: 70,
    },
    {
      name: 'EMA Momentum Trend Breakout',
      slug: 'ema-momentum-trend-breakout',
      description: 'Dynamic trend-following system utilizing EMA 20/50/200 stack, MACD zero-line breakout, and RSI confirmation.',
      isEnabled: true,
      weightTrend: 25,
      weightStructure: 15,
      weightMomentum: 20,
      weightSupportResistance: 15,
      weightEmaAlignment: 15,
      weightRsiMacd: 5,
      weightVolatility: 5,
      weightNewsFilter: 0,
      minScoreToQualify: 65,
    },
    {
      name: 'Liquidity Sweep & Mean Reversion',
      slug: 'liquidity-sweep-mean-reversion',
      description: 'Identifies false breakouts beyond key daily/session pivot highs and lows with Bollinger Band and Stochastic divergence.',
      isEnabled: true,
      weightTrend: 10,
      weightStructure: 25,
      weightMomentum: 15,
      weightSupportResistance: 25,
      weightEmaAlignment: 5,
      weightRsiMacd: 10,
      weightVolatility: 5,
      weightNewsFilter: 5,
      minScoreToQualify: 72,
    }
  ];

  for (const strat of strategies) {
    await prisma.strategy.upsert({
      where: { slug: strat.slug },
      update: strat,
      create: strat,
    });
  }

  // 6. Default Prompt Templates
  const promptTemplates = [
    {
      type: 'SIGNAL_EXPLANATION',
      title: 'AI Signal Explanation & Confluence Breakdown',
      systemRole: 'You are an elite institutional FX strategist. Analyze the provided verified quantitative metrics and explain the trading setup cleanly and concisely without inventing prices.',
      template: `Given the quantitative analysis for {{symbol}} on {{timeframe}}:
Direction: {{direction}}
Entry: {{entryPrice}} | SL: {{stopLoss}} | TP1: {{takeProfit1}} | TP2: {{takeProfit2}} | TP3: {{takeProfit3}}
Signal Strength: {{score}}/100 ({{scoreCategory}})
Trend: {{trend}} | Structure: {{marketStructure}}
EMA Alignment: {{emaAlignment}} | RSI: {{rsi}} | MACD: {{macd}}
Nearest Support: {{support}} | Nearest Resistance: {{resistance}}

Provide a structured JSON output with: summary, marketBias, keyFactors (array), riskFactors (array), technicalConfluence (array), caption, disclaimer.`,
      version: 1,
    },
    {
      type: 'TELEGRAM_CAPTION',
      title: 'High-Conversion Social Caption',
      systemRole: 'You are a professional financial editor producing Telegram channel signal captions.',
      template: `Generate a clean, high-impact Telegram caption for a {{direction}} signal on {{symbol}} with entry {{entryPrice}}, SL {{stopLoss}}, and TPs [{{takeProfit1}}, {{takeProfit2}}, {{takeProfit3}}]. Include risk warning and key technical rationale.`,
      version: 1,
    },
    {
      type: 'DAILY_REPORT',
      title: 'Daily Institutional Market Outlook',
      systemRole: 'You are a Chief Currency Strategist producing daily morning Forex briefings.',
      template: `Generate a daily market outlook covering EURUSD, GBPUSD, USDJPY, XAUUSD, key central bank sentiment, upcoming high-impact economic events, and potential high-probability zones.`,
      version: 1,
    }
  ];

  for (const prompt of promptTemplates) {
    await prisma.promptTemplate.upsert({
      where: { type: prompt.type },
      update: prompt,
      create: prompt,
    });
  }

  // 7. Telegram Default Destination
  const defaultChannel = process.env.TELEGRAM_DEFAULT_CHANNEL_ID || '@AlphaQuantFX_Demo';
  await prisma.telegramDestination.upsert({
    where: { chatId: defaultChannel },
    update: {},
    create: {
      name: 'Primary VIP Signals Channel',
      chatId: defaultChannel,
      type: DestinationTypeEnum.CHANNEL,
      enabled: true,
      signalsEnabled: true,
      analysisEnabled: true,
      newsEnabled: true,
      dailyReportEnabled: true,
      resultUpdatesEnabled: true,
    }
  });

  // 8. System Settings
  const settings = [
    { key: 'BRAND_NAME', value: DEFAULT_BRANDING.brandName, category: 'BRANDING' },
    { key: 'BRAND_WEBSITE', value: DEFAULT_BRANDING.website, category: 'BRANDING' },
    { key: 'BRAND_TELEGRAM', value: DEFAULT_BRANDING.telegramHandle, category: 'BRANDING' },
    { key: 'BRAND_PRIMARY_COLOR', value: DEFAULT_BRANDING.primaryColor, category: 'BRANDING' },
    { key: 'BRAND_SECONDARY_COLOR', value: DEFAULT_BRANDING.secondaryColor, category: 'BRANDING' },
    { key: 'BRAND_ACCENT_COLOR', value: DEFAULT_BRANDING.accentColor, category: 'BRANDING' },
    { key: 'RISK_MIN_RR', value: String(DEFAULT_RISK_CONFIG.minRiskReward), category: 'RISK' },
    { key: 'RISK_MAX_SPREAD', value: String(DEFAULT_RISK_CONFIG.maxSpreadPips), category: 'RISK' },
    { key: 'RISK_MAX_DAILY_SIGNALS', value: String(DEFAULT_RISK_CONFIG.maxDailySignalsTotal), category: 'RISK' },
    { key: 'RISK_COOLDOWN_MINUTES', value: String(DEFAULT_RISK_CONFIG.cooldownMinutesPerPair), category: 'RISK' },
    { key: 'RISK_NEWS_BLACKOUT_BEFORE', value: String(DEFAULT_RISK_CONFIG.newsBlackoutMinutesBefore), category: 'RISK' },
    { key: 'RISK_NEWS_BLACKOUT_AFTER', value: String(DEFAULT_RISK_CONFIG.newsBlackoutMinutesAfter), category: 'RISK' },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
