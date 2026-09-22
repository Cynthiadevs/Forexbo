import type { SignalDirection, SLTPMethod, TechnicalIndicators, MarketStructure } from '../../shared/src/index.ts';

export interface SLTPCalculationResult {
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  riskRewardRatio1: number;
  riskRewardRatio2: number;
  riskRewardRatio3: number;
  pipRisk: number;
  method: SLTPMethod;
}

export class SLTPCalculator {
  public static calculate(
    direction: SignalDirection,
    currentPrice: number,
    indicators: TechnicalIndicators,
    structure: MarketStructure,
    pipDecimal = 4,
    method: SLTPMethod = 'ATR_DYNAMIC'
  ): SLTPCalculationResult {
    const atr = indicators.atr || (currentPrice * 0.002);
    const pipMultiplier = Math.pow(10, pipDecimal === 2 ? 2 : 4);

    let entry = currentPrice;
    let sl = 0;
    let tp1 = 0;
    let tp2 = 0;
    let tp3 = 0;

    if (direction === 'BUY') {
      if (method === 'STRUCTURE_LEVEL' && structure.nearestSupport < currentPrice) {
        sl = structure.nearestSupport - (0.3 * atr);
      } else {
        sl = currentPrice - (1.5 * atr);
      }

      const minDistance = atr * 0.8;
      if ((entry - sl) < minDistance) {
        sl = entry - minDistance;
      }

      const risk = entry - sl;
      tp1 = entry + (1.2 * risk);
      tp2 = entry + (2.0 * risk);
      tp3 = entry + (3.2 * risk);
    } else if (direction === 'SELL') {
      if (method === 'STRUCTURE_LEVEL' && structure.nearestResistance > currentPrice) {
        sl = structure.nearestResistance + (0.3 * atr);
      } else {
        sl = currentPrice + (1.5 * atr);
      }

      const minDistance = atr * 0.8;
      if ((sl - entry) < minDistance) {
        sl = entry + minDistance;
      }

      const risk = sl - entry;
      tp1 = entry - (1.2 * risk);
      tp2 = entry - (2.0 * risk);
      tp3 = entry - (3.2 * risk);
    } else {
      sl = currentPrice;
      tp1 = currentPrice;
      tp2 = currentPrice;
      tp3 = currentPrice;
    }

    const entryPrice = Number(entry.toFixed(pipDecimal));
    const stopLoss = Number(sl.toFixed(pipDecimal));
    const takeProfit1 = Number(tp1.toFixed(pipDecimal));
    const takeProfit2 = Number(tp2.toFixed(pipDecimal));
    const takeProfit3 = Number(tp3.toFixed(pipDecimal));

    const riskDistance = Math.abs(entryPrice - stopLoss);
    const reward1 = Math.abs(takeProfit1 - entryPrice);
    const reward2 = Math.abs(takeProfit2 - entryPrice);
    const reward3 = Math.abs(takeProfit3 - entryPrice);

    const riskRewardRatio1 = riskDistance === 0 ? 0 : Number((reward1 / riskDistance).toFixed(2));
    const riskRewardRatio2 = riskDistance === 0 ? 0 : Number((reward2 / riskDistance).toFixed(2));
    const riskRewardRatio3 = riskDistance === 0 ? 0 : Number((reward3 / riskDistance).toFixed(2));
    const pipRisk = Number((riskDistance * pipMultiplier).toFixed(1));

    return {
      entryPrice,
      stopLoss,
      takeProfit1,
      takeProfit2,
      takeProfit3,
      riskRewardRatio1,
      riskRewardRatio2,
      riskRewardRatio3,
      pipRisk,
      method
    };
  }
}
