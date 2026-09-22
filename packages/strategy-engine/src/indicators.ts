import type { Candle, Timeframe, TechnicalIndicators, MarketTrend, VolatilityLevel } from '../../shared/src/index.ts';

export class TechnicalIndicatorsCalculator {
  public static calculateSMA(prices: number[], period: number): number[] {
    if (prices.length < period) return [];
    const sma: number[] = [];
    for (let i = period - 1; i < prices.length; i++) {
      const sum = prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(Number((sum / period).toFixed(5)));
    }
    return sma;
  }

  public static calculateEMA(prices: number[], period: number): number[] {
    if (prices.length < period) return [];
    const multiplier = 2 / (period + 1);
    const ema: number[] = [];

    const initialSMA = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    ema.push(Number(initialSMA.toFixed(5)));

    for (let i = period; i < prices.length; i++) {
      const currentPrice = prices[i];
      const prevEMA = ema[ema.length - 1];
      const currentEMA = (currentPrice - prevEMA) * multiplier + prevEMA;
      ema.push(Number(currentEMA.toFixed(5)));
    }
    return ema;
  }

  public static calculateRSI(prices: number[], period = 14): number[] {
    if (prices.length <= period) return [];
    const rsiValues: number[] = [];
    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= period; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    let rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    rsiValues.push(Number((100 - (100 / (1 + rs))).toFixed(2)));

    for (let i = period + 1; i < prices.length; i++) {
      const diff = prices[i] - prices[i - 1];
      const gain = diff >= 0 ? diff : 0;
      const loss = diff < 0 ? Math.abs(diff) : 0;

      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;

      rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - (100 / (1 + rs));
      rsiValues.push(Number(rsi.toFixed(2)));
    }

    return rsiValues;
  }

  public static calculateMACD(
    prices: number[],
    fastPeriod = 12,
    slowPeriod = 26,
    signalPeriod = 9
  ): { macdLine: number[]; signalLine: number[]; histogram: number[] } {
    const fastEMA = this.calculateEMA(prices, fastPeriod);
    const slowEMA = this.calculateEMA(prices, slowPeriod);

    const offset = fastEMA.length - slowEMA.length;
    const macdLine: number[] = [];
    for (let i = 0; i < slowEMA.length; i++) {
      macdLine.push(Number((fastEMA[i + offset] - slowEMA[i]).toFixed(5)));
    }

    const signalLine = this.calculateEMA(macdLine, signalPeriod);
    const sigOffset = macdLine.length - signalLine.length;
    const histogram: number[] = [];

    for (let i = 0; i < signalLine.length; i++) {
      histogram.push(Number((macdLine[i + sigOffset] - signalLine[i]).toFixed(5)));
    }

    return { macdLine, signalLine, histogram };
  }

  public static calculateATR(candles: Candle[], period = 14): number[] {
    if (candles.length <= period) return [];
    const tr: number[] = [];

    for (let i = 1; i < candles.length; i++) {
      const high = candles[i].high;
      const low = candles[i].low;
      const prevClose = candles[i - 1].close;

      const trueRange = Math.max(
        high - low,
        Math.abs(high - prevClose),
        Math.abs(low - prevClose)
      );
      tr.push(trueRange);
    }

    const atrValues: number[] = [];
    let currentATR = tr.slice(0, period).reduce((a, b) => a + b, 0) / period;
    atrValues.push(Number(currentATR.toFixed(5)));

    for (let i = period; i < tr.length; i++) {
      currentATR = (currentATR * (period - 1) + tr[i]) / period;
      atrValues.push(Number(currentATR.toFixed(5)));
    }

    return atrValues;
  }

  public static calculateADX(candles: Candle[], period = 14): { adx: number; plusDI: number; minusDI: number } {
    if (candles.length < period * 2) {
      return { adx: 25, plusDI: 20, minusDI: 20 };
    }

    const tr: number[] = [];
    const plusDM: number[] = [];
    const minusDM: number[] = [];

    for (let i = 1; i < candles.length; i++) {
      const high = candles[i].high;
      const low = candles[i].low;
      const prevHigh = candles[i - 1].high;
      const prevLow = candles[i - 1].low;
      const prevClose = candles[i - 1].close;

      tr.push(Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose)));

      const upMove = high - prevHigh;
      const downMove = prevLow - low;

      plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
      minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
    }

    const smoothedTR = this.calculateEMA(tr, period);
    const smoothedPlusDM = this.calculateEMA(plusDM, period);
    const smoothedMinusDM = this.calculateEMA(minusDM, period);

    const len = Math.min(smoothedTR.length, smoothedPlusDM.length, smoothedMinusDM.length);
    const dxValues: number[] = [];
    let latestPlusDI = 25;
    let latestMinusDI = 20;

    for (let i = 0; i < len; i++) {
      const trVal = smoothedTR[smoothedTR.length - len + i];
      const pDM = smoothedPlusDM[smoothedPlusDM.length - len + i];
      const mDM = smoothedMinusDM[smoothedMinusDM.length - len + i];

      const pDI = trVal === 0 ? 0 : (pDM / trVal) * 100;
      const mDI = trVal === 0 ? 0 : (mDM / trVal) * 100;
      const sum = pDI + mDI;
      const dx = sum === 0 ? 0 : (Math.abs(pDI - mDI) / sum) * 100;

      dxValues.push(dx);
      if (i === len - 1) {
        latestPlusDI = Number(pDI.toFixed(2));
        latestMinusDI = Number(mDI.toFixed(2));
      }
    }

    const adxEMA = this.calculateEMA(dxValues, period);
    const finalADX = adxEMA.length > 0 ? adxEMA[adxEMA.length - 1] : 25;

    return {
      adx: Number(finalADX.toFixed(2)),
      plusDI: latestPlusDI,
      minusDI: latestMinusDI
    };
  }

  public static calculateBollingerBands(prices: number[], period = 20, multiplier = 2): { upper: number; middle: number; lower: number; bandwidth: number; percentB: number } {
    if (prices.length < period) {
      const last = prices[prices.length - 1] || 1;
      return { upper: last * 1.01, middle: last, lower: last * 0.99, bandwidth: 2, percentB: 0.5 };
    }

    const slice = prices.slice(-period);
    const mean = slice.reduce((a, b) => a + b, 0) / period;
    const variance = slice.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    const upper = mean + (multiplier * stdDev);
    const lower = mean - (multiplier * stdDev);
    const lastPrice = prices[prices.length - 1];
    const bandwidth = mean === 0 ? 0 : ((upper - lower) / mean) * 100;
    const percentB = upper === lower ? 0.5 : (lastPrice - lower) / (upper - lower);

    return {
      upper: Number(upper.toFixed(5)),
      middle: Number(mean.toFixed(5)),
      lower: Number(lower.toFixed(5)),
      bandwidth: Number(bandwidth.toFixed(2)),
      percentB: Number(percentB.toFixed(2))
    };
  }

  public static calculateStochastic(candles: Candle[], kPeriod = 14, dPeriod = 3): { k: number; d: number; isOverbought: boolean; isOversold: boolean } {
    if (candles.length < kPeriod + dPeriod) {
      return { k: 50, d: 50, isOverbought: false, isOversold: false };
    }

    const kValues: number[] = [];
    for (let i = kPeriod - 1; i < candles.length; i++) {
      const slice = candles.slice(i - kPeriod + 1, i + 1);
      const highMax = Math.max(...slice.map(c => c.high));
      const lowMin = Math.min(...slice.map(c => c.low));
      const currentClose = candles[i].close;

      const k = highMax === lowMin ? 50 : ((currentClose - lowMin) / (highMax - lowMin)) * 100;
      kValues.push(k);
    }

    const dValues = this.calculateSMA(kValues, dPeriod);
    const lastK = Number((kValues[kValues.length - 1] || 50).toFixed(2));
    const lastD = Number((dValues[dValues.length - 1] || 50).toFixed(2));

    return {
      k: lastK,
      d: lastD,
      isOverbought: lastK >= 80,
      isOversold: lastK <= 20
    };
  }

  public static calculatePivotPoints(prevHigh: number, prevLow: number, prevClose: number) {
    const pivot = (prevHigh + prevLow + prevClose) / 3;
    const r1 = (2 * pivot) - prevLow;
    const s1 = (2 * pivot) - prevHigh;
    const r2 = pivot + (prevHigh - prevLow);
    const s2 = pivot - (prevHigh - prevLow);
    const r3 = prevHigh + 2 * (pivot - prevLow);
    const s3 = prevLow - 2 * (prevHigh - pivot);

    return {
      pivot: Number(pivot.toFixed(5)),
      r1: Number(r1.toFixed(5)),
      r2: Number(r2.toFixed(5)),
      r3: Number(r3.toFixed(5)),
      s1: Number(s1.toFixed(5)),
      s2: Number(s2.toFixed(5)),
      s3: Number(s3.toFixed(5))
    };
  }

  public static compileSnapshot(symbol: string, timeframe: Timeframe, candles: Candle[]): TechnicalIndicators {
    const closes = candles.map(c => c.close);
    const lastCandle = candles[candles.length - 1];
    const prevCandle = candles.length > 1 ? candles[candles.length - 2] : lastCandle;

    const ema20Arr = this.calculateEMA(closes, 20);
    const ema50Arr = this.calculateEMA(closes, 50);
    const ema200Arr = this.calculateEMA(closes, Math.min(200, closes.length));
    const sma50Arr = this.calculateSMA(closes, 50);
    const sma200Arr = this.calculateSMA(closes, Math.min(200, closes.length));

    const ema20 = ema20Arr[ema20Arr.length - 1] || lastCandle.close;
    const ema50 = ema50Arr[ema50Arr.length - 1] || lastCandle.close;
    const ema200 = ema200Arr[ema200Arr.length - 1] || lastCandle.close;
    const sma50 = sma50Arr[sma50Arr.length - 1] || lastCandle.close;
    const sma200 = sma200Arr[sma200Arr.length - 1] || lastCandle.close;

    const rsiArr = this.calculateRSI(closes, 14);
    const rsi = rsiArr[rsiArr.length - 1] || 50;

    const macdRes = this.calculateMACD(closes);
    const macdLine = macdRes.macdLine[macdRes.macdLine.length - 1] || 0;
    const macdSignal = macdRes.signalLine[macdRes.signalLine.length - 1] || 0;
    const macdHistogram = macdRes.histogram[macdRes.histogram.length - 1] || 0;
    const prevHist = macdRes.histogram.length > 1 ? macdRes.histogram[macdRes.histogram.length - 2] : 0;

    const isBullishCrossover = prevHist <= 0 && macdHistogram > 0;
    const isBearishCrossover = prevHist >= 0 && macdHistogram < 0;

    const atrArr = this.calculateATR(candles, 14);
    const atr = atrArr[atrArr.length - 1] || (lastCandle.high - lastCandle.low);

    const adxRes = this.calculateADX(candles, 14);
    const bb = this.calculateBollingerBands(closes, 20, 2);
    const stoch = this.calculateStochastic(candles, 14, 3);
    const pivots = this.calculatePivotPoints(prevCandle.high, prevCandle.low, prevCandle.close);

    let emaAlignment: 'BULLISH' | 'BEARISH' | 'MIXED' = 'MIXED';
    if (ema20 > ema50 && ema50 > ema200) emaAlignment = 'BULLISH';
    else if (ema20 < ema50 && ema50 < ema200) emaAlignment = 'BEARISH';

    let trend: MarketTrend = 'NEUTRAL';
    if (lastCandle.close > ema50 && ema50 > ema200 && rsi > 52 && macdHistogram > 0) {
      trend = adxRes.adx > 30 ? 'STRONG_BULLISH' : 'BULLISH';
    } else if (lastCandle.close < ema50 && ema50 < ema200 && rsi < 48 && macdHistogram < 0) {
      trend = adxRes.adx > 30 ? 'STRONG_BEARISH' : 'BEARISH';
    }

    const typicalSpread = lastCandle.close * 0.002;
    let volatility: VolatilityLevel = 'MODERATE';
    if (atr < typicalSpread * 0.5) volatility = 'LOW';
    else if (atr > typicalSpread * 2.5) volatility = 'HIGH';
    if (bb.bandwidth > 6.0) volatility = 'EXTREME';

    return {
      symbol,
      timeframe,
      timestamp: lastCandle.timestamp,
      ema20,
      ema50,
      ema200,
      sma50,
      sma200,
      rsi,
      macd: {
        macdLine,
        signalLine: macdSignal,
        histogram: macdHistogram,
        isBullishCrossover,
        isBearishCrossover
      },
      atr,
      adx: {
        adx: adxRes.adx,
        plusDI: adxRes.plusDI,
        minusDI: adxRes.minusDI,
        trendStrength: adxRes.adx >= 35 ? 'STRONG' : adxRes.adx >= 20 ? 'MODERATE' : 'WEAK'
      },
      bollingerBands: bb,
      stochastic: stoch,
      pivotPoints: pivots,
      trend,
      volatility,
      emaAlignment
    };
  }
}
