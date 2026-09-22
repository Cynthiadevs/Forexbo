import axios from 'axios';
import EventEmitter from 'eventemitter3';
import { Candle, MarketTick, Timeframe, MarketDataStatus } from '@forex/shared';
import { IMarketDataProvider } from '../interfaces.js';

export class PolygonMarketDataProvider implements IMarketDataProvider {
  public readonly name = 'POLYGON_IO';
  public isConnected = false;
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly eventEmitter = new EventEmitter();

  constructor(apiKey: string, baseUrl = 'https://api.polygon.io/v2') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  public async connect(): Promise<void> {
    this.isConnected = true;
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
  }

  public async getLatestTick(symbol: string): Promise<MarketTick> {
    if (!this.apiKey) {
      throw new Error('Polygon API key is not configured.');
    }

    try {
      // Forex ticker format for Polygon: C:EURUSD
      const formatted = `C:${symbol}`;
      const res = await axios.get(`${this.baseUrl}/last/nbbo/${formatted}`, {
        params: { apiKey: this.apiKey },
        timeout: 5000
      });

      const data = res.data?.results;
      const bid = data?.p || 1.0;
      const ask = data?.P || bid + 0.0001;
      const spread = Number(((ask - bid) * 10000).toFixed(1));

      return {
        symbol,
        bid,
        ask,
        spread,
        timestamp: data?.t ? Math.floor(data.t / 1000000) : Date.now(),
        status: MarketDataStatus.OK
      };
    } catch (error: any) {
      return {
        symbol,
        bid: 0,
        ask: 0,
        spread: 0,
        timestamp: Date.now(),
        status: MarketDataStatus.OUTAGE
      };
    }
  }

  public async getHistoricalCandles(symbol: string, timeframe: Timeframe, count = 200): Promise<Candle[]> {
    if (!this.apiKey) {
      throw new Error('Polygon API key is not configured.');
    }

    const { multiplier, timespan } = this.timeframeToPolygon(timeframe);
    const to = Date.now();
    const from = to - (count * multiplier * 60 * 1000 * 2);

    const res = await axios.get(
      `${this.baseUrl}/aggs/ticker/C:${symbol}/range/${multiplier}/${timespan}/${from}/${to}`,
      {
        params: { apiKey: this.apiKey, limit: count, adjusted: true, sort: 'asc' },
        timeout: 8000
      }
    );

    const results = res.data?.results || [];
    return results.map((r: any) => ({
      timestamp: r.t,
      open: r.o,
      high: r.h,
      low: r.l,
      close: r.c,
      volume: r.v || 0
    }));
  }

  public subscribeTicks(symbol: string, callback: (tick: MarketTick) => void): void {
    this.eventEmitter.on(`tick:${symbol}`, callback);
  }

  public unsubscribeTicks(symbol: string): void {
    this.eventEmitter.removeAllListeners(`tick:${symbol}`);
  }

  public subscribeCandleCompleted(symbol: string, timeframe: Timeframe, callback: (candle: Candle) => void): void {
    this.eventEmitter.on(`candle:${symbol}:${timeframe}`, callback);
  }

  private timeframeToPolygon(timeframe: Timeframe): { multiplier: number; timespan: string } {
    switch (timeframe) {
      case Timeframe.M1: return { multiplier: 1, timespan: 'minute' };
      case Timeframe.M5: return { multiplier: 5, timespan: 'minute' };
      case Timeframe.M15: return { multiplier: 15, timespan: 'minute' };
      case Timeframe.M30: return { multiplier: 30, timespan: 'minute' };
      case Timeframe.H1: return { multiplier: 1, timespan: 'hour' };
      case Timeframe.H4: return { multiplier: 4, timespan: 'hour' };
      case Timeframe.D1: return { multiplier: 1, timespan: 'day' };
      default: return { multiplier: 15, timespan: 'minute' };
    }
  }
}
