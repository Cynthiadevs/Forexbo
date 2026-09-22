import type { Candle, Timeframe, MarketStructure, MarketTrend } from '../../shared/src/index.ts';

export class MarketStructureAnalyzer {
  public static analyze(symbol: string, timeframe: Timeframe, candles: Candle[]): MarketStructure {
    if (candles.length < 20) {
      const price = candles[candles.length - 1]?.close || 1.0;
      return {
        symbol,
        timeframe,
        swingHighs: [],
        swingLows: [],
        supports: [price * 0.99],
        resistances: [price * 1.01],
        nearestSupport: price * 0.99,
        nearestResistance: price * 1.01,
        isBreakOfStructure: false,
        isChangeOfCharacter: false,
        structureTrend: 'NEUTRAL'
      };
    }

    const lookback = 3;
    const swingHighs: { price: number; timestamp: number }[] = [];
    const swingLows: { price: number; timestamp: number }[] = [];

    for (let i = lookback; i < candles.length - lookback; i++) {
      const current = candles[i];
      let isHigh = true;
      let isLow = true;

      for (let j = 1; j <= lookback; j++) {
        if (candles[i - j].high >= current.high || candles[i + j].high > current.high) {
          isHigh = false;
        }
        if (candles[i - j].low <= current.low || candles[i + j].low < current.low) {
          isLow = false;
        }
      }

      if (isHigh) {
        swingHighs.push({ price: current.high, timestamp: current.timestamp });
      }
      if (isLow) {
        swingLows.push({ price: current.low, timestamp: current.timestamp });
      }
    }

    const lastCandle = candles[candles.length - 1];
    const prevCandle = candles[candles.length - 2];
    const currentPrice = lastCandle.close;

    let structureTrend: MarketTrend = 'NEUTRAL';
    if (swingHighs.length >= 2 && swingLows.length >= 2) {
      const lastHigh = swingHighs[swingHighs.length - 1].price;
      const prevHigh = swingHighs[swingHighs.length - 2].price;
      const lastLow = swingLows[swingLows.length - 1].price;
      const prevLow = swingLows[swingLows.length - 2].price;

      if (lastHigh > prevHigh && lastLow > prevLow) {
        structureTrend = 'BULLISH';
      } else if (lastHigh < prevHigh && lastLow < prevLow) {
        structureTrend = 'BEARISH';
      }
    }

    let isBreakOfStructure = false;
    let breakOfStructureType: 'BULLISH_BOS' | 'BEARISH_BOS' | undefined;
    let isChangeOfCharacter = false;
    let changeOfCharacterType: 'BULLISH_CHOCH' | 'BEARISH_CHOCH' | undefined;

    if (swingHighs.length > 0 && swingLows.length > 0) {
      const recentSwingHigh = swingHighs[swingHighs.length - 1].price;
      const recentSwingLow = swingLows[swingLows.length - 1].price;

      if (currentPrice > recentSwingHigh && prevCandle.close <= recentSwingHigh) {
        if (structureTrend === 'BULLISH') {
          isBreakOfStructure = true;
          breakOfStructureType = 'BULLISH_BOS';
        } else if (structureTrend === 'BEARISH') {
          isChangeOfCharacter = true;
          changeOfCharacterType = 'BULLISH_CHOCH';
          structureTrend = 'BULLISH';
        }
      }

      if (currentPrice < recentSwingLow && prevCandle.close >= recentSwingLow) {
        if (structureTrend === 'BEARISH') {
          isBreakOfStructure = true;
          breakOfStructureType = 'BEARISH_BOS';
        } else if (structureTrend === 'BULLISH') {
          isChangeOfCharacter = true;
          changeOfCharacterType = 'BEARISH_CHOCH';
          structureTrend = 'BEARISH';
        }
      }
    }

    const allKeyPrices = [
      ...swingHighs.map(s => s.price),
      ...swingLows.map(s => s.price)
    ];

    const supports = allKeyPrices.filter(p => p < currentPrice).sort((a, b) => b - a);
    const resistances = allKeyPrices.filter(p => p > currentPrice).sort((a, b) => a - b);

    const nearestSupport = supports.length > 0 ? supports[0] : Number((currentPrice * 0.992).toFixed(5));
    const nearestResistance = resistances.length > 0 ? resistances[0] : Number((currentPrice * 1.008).toFixed(5));

    return {
      symbol,
      timeframe,
      swingHighs: swingHighs.slice(-10),
      swingLows: swingLows.slice(-10),
      supports: supports.slice(0, 5),
      resistances: resistances.slice(0, 5),
      nearestSupport,
      nearestResistance,
      isBreakOfStructure,
      breakOfStructureType,
      isChangeOfCharacter,
      changeOfCharacterType,
      structureTrend
    };
  }
}
