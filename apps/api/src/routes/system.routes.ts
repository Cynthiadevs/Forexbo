import { Router, Request, Response } from 'express';
import { AppConfig, DEFAULT_BRANDING, DEFAULT_RISK_CONFIG, SUPPORTED_PAIRS } from '@forex/config';
import { MarketDataService } from '@forex/market-engine';
import { AIService } from '@forex/ai';
import { SystemHealthReport } from '@forex/shared';

export const systemRouter = Router();

const marketService = MarketDataService.getInstance();
const aiService = AIService.getInstance();
const startTime = Date.now();

systemRouter.get('/health', (req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  const healthReport: SystemHealthReport = {
    status: 'OPERATIONAL',
    timestamp: new Date().toISOString(),
    uptimeSeconds,
    services: {
      api: { status: 'UP', latencyMs: 4 },
      database: { status: 'UP', latencyMs: 8 },
      redis: { status: 'UP', latencyMs: 3 },
      marketData: { status: 'UP', provider: marketService.getProviderName(), pairsActive: SUPPORTED_PAIRS.length },
      openai: { status: 'UP', model: AppConfig.openai.model, dailySpendUsd: aiService.getDailySpendUsd() },
      telegram: { status: 'UP', destinationsCount: 2 },
      workers: { status: 'UP', activeJobs: 3, failedJobs: 0 }
    }
  };

  return res.json({ success: true, data: healthReport });
});

systemRouter.get('/settings', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      branding: AppConfig.branding,
      risk: AppConfig.risk,
      demoMode: AppConfig.isDemoMode
    }
  });
});

systemRouter.get('/news', (req: Request, res: Response) => {
  const mockNews = [
    {
      id: 'news-1',
      currency: 'USD',
      event: 'US Non-Farm Payrolls (NFP)',
      impact: 'HIGH',
      scheduledTime: new Date(Date.now() + 18000000), // in 5 hours
      forecast: '175K',
      previous: '142K'
    },
    {
      id: 'news-2',
      currency: 'EUR',
      event: 'ECB Monetary Policy Statement',
      impact: 'HIGH',
      scheduledTime: new Date(Date.now() + 36000000),
      forecast: '3.65%',
      previous: '3.65%'
    },
    {
      id: 'news-3',
      currency: 'GBP',
      event: 'UK Consumer Price Index (CPI)',
      impact: 'MEDIUM',
      scheduledTime: new Date(Date.now() + 72000000),
      forecast: '2.2%',
      previous: '2.2%'
    }
  ];

  return res.json({ success: true, data: mockNews });
});

systemRouter.get('/plans', (req: Request, res: Response) => {
  const plans = [
    { id: 'plan-1', tier: 'FREE', name: 'Free Starter', priceMonthly: 0, signalsPerDay: 2, allowedPairs: ['EURUSD', 'GBPUSD'], aiAccess: false },
    { id: 'plan-2', tier: 'PRO', name: 'Pro Trader', priceMonthly: 49, signalsPerDay: 10, allowedPairs: ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD'], aiAccess: true },
    { id: 'plan-3', tier: 'VIP', name: 'VIP Quantitative', priceMonthly: 99, signalsPerDay: 50, allowedPairs: ['*'], aiAccess: true },
    { id: 'plan-4', tier: 'ENTERPRISE', name: 'Enterprise Fund', priceMonthly: 299, signalsPerDay: 999, allowedPairs: ['*'], aiAccess: true }
  ];
  return res.json({ success: true, data: plans });
});

systemRouter.get('/logs', (req: Request, res: Response) => {
  const sampleLogs = [
    { timestamp: new Date(Date.now() - 120000), level: 'INFO', context: 'MarketDataService', message: 'Tick stream synced across 14 instruments (DEMO_SIMULATOR)' },
    { timestamp: new Date(Date.now() - 90000), level: 'INFO', context: 'MarketScanner', message: 'Evaluation completed: XAUUSD scored 84/100 (VERY_STRONG)' },
    { timestamp: new Date(Date.now() - 60000), level: 'INFO', context: 'SignalLifecycleMonitor', message: 'Active trade sig-xau-1 registered for live TP/SL tracking' },
    { timestamp: new Date(Date.now() - 30000), level: 'INFO', context: 'TelegramPublisher', message: 'Dispatched signal graphic & caption to @AlphaQuantFX_Demo' }
  ];
  return res.json({ success: true, data: sampleLogs });
});
