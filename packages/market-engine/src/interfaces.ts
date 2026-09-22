import type { Candle, MarketTick, Timeframe } from '../../shared/src/index.ts';

export interface IMarketDataProvider {
  readonly name: string;
  readonly isConnected: boolean;

  connect(): Promise<void>;
  disconnect(): Promise<void>;
  getLatestTick(symbol: string): Promise<MarketTick>;
  getHistoricalCandles(symbol: string, timeframe: Timeframe, count: number): Promise<Candle[]>;
  subscribeTicks(symbol: string, callback: (tick: MarketTick) => void): void;
  unsubscribeTicks(symbol: string): void;
  subscribeCandleCompleted(symbol: string, timeframe: Timeframe, callback: (candle: Candle) => void): void;
}
