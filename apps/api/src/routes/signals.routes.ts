import { Router, Request, Response } from 'express';
import { MarketDataService } from '@forex/market-engine';
import { QuantitativeSignalEngine, RiskEngine } from '@forex/strategy-engine';
import { AIService } from '@forex/ai';
import { SignalCardRenderer } from '@forex/image-renderer';
import { TelegramPublisher } from '@forex/telegram';
import { AppConfig, SUPPORTED_PAIRS } from '@forex/config';
import { Timeframe, SignalDirection, SignalStatus, TelegramDestinationConfig, DestinationType } from '@forex/shared';
import { authenticateJWT, requireRole } from '../middleware/auth.js';
import { UserRole } from '@forex/shared';

export const signalsRouter = Router();

const marketService = MarketDataService.getInstance();
const signalEngine = new QuantitativeSignalEngine({ minScoreToQualify: 60 });
const riskEngine = new RiskEngine();
const aiService = AIService.getInstance();
const telegramPublisher = new TelegramPublisher();

// Signal Store (Memory/Database cache)
const signalsStore: any[] = [];

// Seed sample initial signals for immediate presentation
function seedInitialSignals() {
  const samples = [
    {
      id: 'sig-xau-1',
      symbol: 'XAUUSD',
      timeframe: '15m',
      direction: SignalDirection.BUY,
      status: SignalStatus.ACTIVE,
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
      createdAt: new Date(Date.now() - 3600000),
      aiExplanation: {
        summary: 'Bullish orderblock defense combined with clean 4H/1H trend alignment and rising RSI momentum.',
        marketBias: 'BULLISH',
        keyFactors: ['Strong 4H/1H structural uptrend', 'Bullish MACD histogram expansion', 'Bounce at 2648 key institutional support'],
        riskFactors: ['Tight risk management below 2638', 'Upcoming US Session volatility'],
        technicalConfluence: ['Score 84/100', 'MTF Alignment 85%', 'RSI 62.4']
      }
    },
    {
      id: 'sig-eur-2',
      symbol: 'EURUSD',
      timeframe: '15m',
      direction: SignalDirection.SELL,
      status: SignalStatus.TP2_HIT,
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
        technicalConfluence: ['Score 78/100', 'MTF Alignment 75%', 'RSI 41.2']
      }
    },
    {
      id: 'sig-gbp-3',
      symbol: 'GBPUSD',
      timeframe: '1h',
      direction: SignalDirection.BUY,
      status: SignalStatus.TP1_HIT,
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
        technicalConfluence: ['Score 81/100', 'MTF Alignment 80%', 'RSI 57.8']
      }
    }
  ];

  signalsStore.push(...samples);
}
seedInitialSignals();

signalsRouter.get('/', (req: Request, res: Response) => {
  const { symbol, direction, status, timeframe } = req.query;
  let results = [...signalsStore];

  if (symbol) results = results.filter(s => s.symbol === (symbol as string).toUpperCase());
  if (direction) results = results.filter(s => s.direction === direction);
  if (status) results = results.filter(s => s.status === status);
  if (timeframe) results = results.filter(s => s.timeframe === timeframe);

  return res.json({ success: true, count: results.length, data: results });
});

signalsRouter.get('/:id', (req: Request, res: Response) => {
  const signal = signalsStore.find(s => s.id === req.params.id);
  if (!signal) {
    return res.status(404).json({ success: false, error: 'Signal not found.' });
  }
  return res.json({ success: true, data: signal });
});

signalsRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const symbol = (req.body.symbol || 'EURUSD').toUpperCase();
    const timeframe = (req.body.timeframe || Timeframe.M15) as Timeframe;

    const { candles: h4 } = await marketService.getCandles(symbol, Timeframe.H4, 40);
    const { candles: h1 } = await marketService.getCandles(symbol, Timeframe.H1, 40);
    const { candles: m15 } = await marketService.getCandles(symbol, Timeframe.M15, 40);
    const { candles: m5 } = await marketService.getCandles(symbol, Timeframe.M5, 40);

    const pipDec = symbol.includes('JPY') || symbol.includes('XAU') ? 2 : 4;
    const engine = new QuantitativeSignalEngine({ pipDecimal: pipDec, minScoreToQualify: 50 });
    const evaluated = engine.evaluate(symbol, timeframe, { h4, h1, m15, m5 });

    // AI Explanation
    const aiExplanation = await aiService.explainSignal(evaluated);

    // Render Image
    const imagePath = await SignalCardRenderer.renderToFile(evaluated);

    const newSignal = {
      id: `sig-${Date.now()}`,
      symbol: evaluated.symbol,
      timeframe: evaluated.timeframe,
      direction: evaluated.direction,
      status: evaluated.qualifies ? SignalStatus.ACTIVE : SignalStatus.CANCELLED,
      entryPrice: evaluated.entryPrice,
      stopLoss: evaluated.stopLoss,
      takeProfit1: evaluated.takeProfit1,
      takeProfit2: evaluated.takeProfit2,
      takeProfit3: evaluated.takeProfit3,
      riskRewardRatio1: evaluated.riskRewardRatio1,
      riskRewardRatio2: evaluated.riskRewardRatio2,
      riskRewardRatio3: evaluated.riskRewardRatio3,
      score: evaluated.score,
      scoreCategory: evaluated.scoreCategory,
      sltpMethod: evaluated.sltpMethod,
      breakdown: evaluated.breakdown,
      aiExplanation,
      imagePath,
      createdAt: new Date()
    };

    signalsStore.unshift(newSignal);

    // Optionally publish to Telegram if qualified
    if (evaluated.qualifies && evaluated.direction !== SignalDirection.WAIT) {
      const destination: TelegramDestinationConfig = {
        id: 'primary-vip',
        name: 'Alpha Quant VIP Channel',
        chatId: AppConfig.telegram.defaultChannelId,
        type: DestinationType.CHANNEL,
        enabled: true,
        signalsEnabled: true,
        analysisEnabled: true,
        newsEnabled: true,
        dailyReportEnabled: true,
        resultUpdatesEnabled: true
      };
      await telegramPublisher.publishSignal(destination, evaluated, aiExplanation.caption, imagePath);
    }

    return res.status(201).json({
      success: true,
      data: newSignal
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
