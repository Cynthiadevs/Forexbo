import { Router, Request, Response } from 'express';
import { MarketDataService } from '@forex/market-engine';
import { BacktestingEngine } from '@forex/strategy-engine';
import { BacktestRequestSchema, Timeframe } from '@forex/shared';

export const backtestRouter = Router();
const marketService = MarketDataService.getInstance();

backtestRouter.post('/run', async (req: Request, res: Response) => {
  try {
    const parsed = BacktestRequestSchema.parse(req.body);
    const symbol = parsed.symbol.toUpperCase();
    const timeframe = parsed.timeframe as Timeframe;

    // Fetch historical candles (e.g. 300 bars)
    const { candles, validation } = await marketService.getCandles(symbol, timeframe, 300);

    if (candles.length < 50) {
      return res.status(400).json({ success: false, error: 'Insufficient historical data to run backtest.' });
    }

    const backtestResult = BacktestingEngine.runBacktest(
      {
        symbol,
        timeframe,
        startDate: new Date(candles[0].timestamp),
        endDate: new Date(candles[candles.length - 1].timestamp),
        initialBalance: parsed.initialBalance,
        riskPercentagePerTrade: parsed.riskPercentagePerTrade,
        minScoreToQualify: parsed.minScoreToQualify
      },
      candles
    );

    return res.json({
      success: true,
      data: backtestResult
    });
  } catch (err: any) {
    return res.status(400).json({ success: false, error: err.message });
  }
});
