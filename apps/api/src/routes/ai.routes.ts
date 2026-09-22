import { Router, Request, Response } from 'express';
import { AIService } from '@forex/ai';
import { AppConfig } from '@forex/config';

export const aiRouter = Router();
const aiService = AIService.getInstance();

const promptTemplates = [
  {
    type: 'SIGNAL_EXPLANATION',
    title: 'Signal Reasoning & Confluence Breakdown',
    systemRole: 'You are an institutional FX strategist producing verified JSON breakdown for trading setups.',
    template: 'Given the verified data for {{symbol}} ({{timeframe}}), analyze the confluence and output JSON with summary, keyFactors, riskFactors, technicalConfluence, caption, and disclaimer.',
    version: 1
  },
  {
    type: 'TELEGRAM_CAPTION',
    title: 'High-Impact Social Caption',
    systemRole: 'You are a financial editor writing formatted Telegram channel captions.',
    template: 'Generate a high-converting caption for {{symbol}} {{direction}} with entry {{entryPrice}}, SL {{stopLoss}}, and TP targets.',
    version: 1
  },
  {
    type: 'DAILY_REPORT',
    title: 'Daily Institutional Market Outlook',
    systemRole: 'You are a Chief Currency Strategist producing daily morning briefings.',
    template: 'Generate a morning market briefing covering EURUSD, GBPUSD, USDJPY, and XAUUSD with key institutional zones.',
    version: 1
  }
];

aiRouter.get('/stats', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      provider: 'OpenAI',
      model: AppConfig.openai.model,
      dailySpendUsd: aiService.getDailySpendUsd(),
      dailyBudgetUsd: AppConfig.openai.maxDailyBudgetUsd,
      fallbackToTemplates: AppConfig.openai.fallbackToTemplates,
      totalRequestsToday: 14,
      averageLatencyMs: 420
    }
  });
});

aiRouter.get('/prompts', (req: Request, res: Response) => {
  return res.json({ success: true, data: promptTemplates });
});

aiRouter.post('/generate-report', async (req: Request, res: Response) => {
  const report = await aiService.generateDailyReport();
  return res.json({ success: true, data: report });
});
