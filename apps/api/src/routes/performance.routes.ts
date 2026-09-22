import { Router, Request, Response } from 'express';

export const performanceRouter = Router();

performanceRouter.get('/', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: {
      overall: {
        totalSignals: 84,
        winningTrades: 64,
        losingTrades: 20,
        winRate: 76.2,
        tp1Hits: 64,
        tp2Hits: 48,
        tp3Hits: 29,
        slHits: 20,
        averageRiskReward: 2.35,
        profitFactor: 2.84,
        netPips: 1420.5,
        maxDrawdownPercent: 3.8
      },
      byPair: [
        { symbol: 'XAUUSD', signals: 28, winRate: 82.1, netPips: 620.0 },
        { symbol: 'EURUSD', signals: 22, winRate: 72.7, netPips: 310.5 },
        { symbol: 'GBPUSD', signals: 18, winRate: 77.8, netPips: 295.0 },
        { symbol: 'USDJPY', signals: 10, winRate: 70.0, netPips: 140.0 },
        { symbol: 'AUDUSD', signals: 6, winRate: 66.7, netPips: 55.0 }
      ],
      byTimeframe: [
        { timeframe: '15m', signals: 52, winRate: 75.0 },
        { timeframe: '1h', signals: 24, winRate: 79.2 },
        { timeframe: '4h', signals: 8, winRate: 87.5 }
      ],
      bySession: [
        { session: 'LONDON', signals: 44, winRate: 79.5 },
        { session: 'NEW_YORK', signals: 32, winRate: 75.0 },
        { session: 'TOKYO', signals: 8, winRate: 62.5 }
      ]
    }
  });
});
