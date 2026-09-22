import { Router, Request, Response } from 'express';

export const strategiesRouter = Router();

let strategies = [
  {
    id: 'strat-1',
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
    minScoreToQualify: 70
  },
  {
    id: 'strat-2',
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
    minScoreToQualify: 65
  },
  {
    id: 'strat-3',
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
    minScoreToQualify: 72
  }
];

strategiesRouter.get('/', (req: Request, res: Response) => {
  return res.json({ success: true, data: strategies });
});

strategiesRouter.put('/:id', (req: Request, res: Response) => {
  const index = strategies.findIndex(s => s.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Strategy not found' });
  }

  strategies[index] = { ...strategies[index], ...req.body };
  return res.json({ success: true, data: strategies[index] });
});
