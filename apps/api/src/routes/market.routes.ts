import { Router, Request, Response } from 'express';
import { SUPPORTED_PAIRS } from '@forex/config';
import { MarketDataService } from '@forex/market-engine';
import { TechnicalIndicatorsCalculator, MarketStructureAnalyzer, MultiTimeframeAnalyzer } from '@forex/strategy-engine';
import { Timeframe } from '@forex/shared';

export const marketRouter = Router();
const marketService = MarketDataService.getInstance();

marketRouter.get('/', async (req: Request, res: Response) => {
  try {
    const list = [];
    for (const p of SUPPORTED_PAIRS) {
      try {
        const tick = await marketService.getLatestTick(p.symbol);
        list.push({
          ...p,
          bid: tick.bid,
          ask: tick.ask,
          spread: tick.spread,
          status: tick.status,
          timestamp: tick.timestamp
        });
      } catch {
        list.push({
          ...p,
          bid: 0,
          ask: 0,
          spread: p.minSpread,
          status: 'OFFLINE',
          timestamp: Date.now()
        });
      }
    }
    return res.json({ success: true, data: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

marketRouter.get('/:symbol', async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const timeframe = (req.query.timeframe as Timeframe) || Timeframe.M15;
    const count = parseInt(req.query.count as string || '100', 10);

    const tick = await marketService.getLatestTick(symbol);
    const { candles, validation } = await marketService.getCandles(symbol, timeframe, count);

    return res.json({
      success: true,
      data: {
        symbol,
        timeframe,
        tick,
        validation,
        candles
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

marketRouter.get('/:symbol/analysis', async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const { candles: h4 } = await marketService.getCandles(symbol, Timeframe.H4, 40);
    const { candles: h1 } = await marketService.getCandles(symbol, Timeframe.H1, 40);
    const { candles: m15 } = await marketService.getCandles(symbol, Timeframe.M15, 40);
    const { candles: m5 } = await marketService.getCandles(symbol, Timeframe.M5, 40);

    const indicators = TechnicalIndicatorsCalculator.compileSnapshot(symbol, Timeframe.M15, m15);
    const structure = MarketStructureAnalyzer.analyze(symbol, Timeframe.M15, m15);
    const mtf = MultiTimeframeAnalyzer.analyze(symbol, { h4, h1, m15, m5 });

    return res.json({
      success: true,
      data: {
        symbol,
        timestamp: Date.now(),
        indicators,
        structure,
        mtf
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
