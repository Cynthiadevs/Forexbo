import type { Candle, MarketTick, ValidationResult, MarketDataStatus } from '../../shared/src/index.ts';

export class MarketDataValidator {
  maxStalenessMs: number;

  constructor(maxStalenessMs = 30000) {
    this.maxStalenessMs = maxStalenessMs;
  }

  public validateTick(tick: MarketTick): ValidationResult {
    const errors: string[] = [];
    const now = Date.now();
    const freshnessMs = now - tick.timestamp;

    if (tick.bid <= 0) {
      errors.push(`Invalid bid price: ${tick.bid}`);
    }
    if (tick.ask <= 0) {
      errors.push(`Invalid ask price: ${tick.ask}`);
    }
    if (tick.bid >= tick.ask) {
      errors.push(`Negative or zero spread: bid (${tick.bid}) >= ask (${tick.ask})`);
    }
    if (tick.spread < 0) {
      errors.push(`Invalid spread value: ${tick.spread}`);
    }
    if (freshnessMs > this.maxStalenessMs) {
      errors.push(`Market data stale: age is ${(freshnessMs / 1000).toFixed(1)}s (max allowed: ${this.maxStalenessMs / 1000}s)`);
      return {
        isValid: false,
        status: 'STALE',
        errors,
        freshnessMs
      };
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        status: 'INVALID',
        errors,
        freshnessMs
      };
    }

    return {
      isValid: true,
      status: 'OK',
      errors: [],
      freshnessMs
    };
  }

  public validateCandle(candle: Candle): ValidationResult {
    const errors: string[] = [];
    const now = Date.now();
    const freshnessMs = now - candle.timestamp;

    if (candle.open <= 0 || candle.high <= 0 || candle.low <= 0 || candle.close <= 0) {
      errors.push('Candle contains non-positive price values.');
    }
    if (candle.high < candle.low) {
      errors.push(`Candle High (${candle.high}) is lower than Low (${candle.low}).`);
    }
    if (candle.high < candle.open || candle.high < candle.close) {
      errors.push('Candle High is lower than Open or Close.');
    }
    if (candle.low > candle.open || candle.low > candle.close) {
      errors.push('Candle Low is higher than Open or Close.');
    }
    if (candle.volume < 0) {
      errors.push(`Candle Volume is negative: ${candle.volume}`);
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        status: 'INVALID',
        errors,
        freshnessMs
      };
    }

    return {
      isValid: true,
      status: 'OK',
      errors: [],
      freshnessMs
    };
  }

  public validateCandleSeries(candles: Candle[]): ValidationResult {
    if (!candles || candles.length === 0) {
      return {
        isValid: false,
        status: 'INVALID',
        errors: ['Candle array is empty.'],
        freshnessMs: Infinity
      };
    }

    const errors: string[] = [];
    for (let i = 0; i < candles.length; i++) {
      const current = candles[i];
      const singleVal = this.validateCandle(current);
      if (!singleVal.isValid) {
        errors.push(`Candle at index ${i} invalid: ${singleVal.errors.join(', ')}`);
      }

      if (i > 0) {
        const prev = candles[i - 1];
        if (current.timestamp <= prev.timestamp) {
          errors.push(`Duplicate or non-sequential timestamp between candle ${i - 1} and ${i}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      status: errors.length === 0 ? 'OK' : 'INVALID',
      errors,
      freshnessMs: Date.now() - candles[candles.length - 1].timestamp
    };
  }
}
