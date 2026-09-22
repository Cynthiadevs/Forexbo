import EventEmitter from 'events';
import { AppConfig, SUPPORTED_PAIRS } from '../../config/src/index.ts';
import type { Candle, MarketTick, Timeframe, ValidationResult } from '../../shared/src/index.ts';
import type { IMarketDataProvider } from './interfaces.ts';
import { MarketDataValidator } from './validator.ts';
import { DemoMarketDataProvider } from './providers/demo-provider.ts';

export class MarketDataService {
  private static instance: MarketDataService;
  provider: IMarketDataProvider;
  validator: MarketDataValidator;
  eventEmitter = new EventEmitter();
  latestTicks = new Map<string, MarketTick>();

  private constructor() {
    this.validator = new MarketDataValidator(30000);
    this.provider = new DemoMarketDataProvider();
  }

  public static getInstance(): MarketDataService {
    if (!MarketDataService.instance) {
      MarketDataService.instance = new MarketDataService();
    }
    return MarketDataService.instance;
  }

  public setProvider(provider: IMarketDataProvider): void {
    if (this.provider.isConnected) {
      this.provider.disconnect();
    }
    this.provider = provider;
  }

  public async start(): Promise<void> {
    await this.provider.connect();

    for (const pair of SUPPORTED_PAIRS) {
      this.provider.subscribeTicks(pair.symbol, (tick) => {
        const validation = this.validator.validateTick(tick);
        if (validation.isValid) {
          this.latestTicks.set(pair.symbol, tick);
          this.eventEmitter.emit(`tick:${pair.symbol}`, tick);
          this.eventEmitter.emit('tick:*', tick);
        }
      });
    }

    console.log(`🚀 Market Data Service running with provider: ${this.provider.name}`);
  }

  public async stop(): Promise<void> {
    await this.provider.disconnect();
  }

  public async getLatestTick(symbol: string): Promise<MarketTick> {
    const cached = this.latestTicks.get(symbol);
    if (cached) {
      const val = this.validator.validateTick(cached);
      if (val.isValid) return cached;
    }
    const fresh = await this.provider.getLatestTick(symbol);
    const val = this.validator.validateTick(fresh);
    if (!val.isValid) {
      throw new Error(`Stale or invalid market data for ${symbol}: ${val.errors.join(', ')}`);
    }
    this.latestTicks.set(symbol, fresh);
    return fresh;
  }

  public async getCandles(symbol: string, timeframe: Timeframe, count = 200): Promise<{ candles: Candle[]; validation: ValidationResult }> {
    const candles = await this.provider.getHistoricalCandles(symbol, timeframe, count);
    const validation = this.validator.validateCandleSeries(candles);
    return { candles, validation };
  }

  public onTick(symbol: string, callback: (tick: MarketTick) => void): void {
    this.eventEmitter.on(`tick:${symbol}`, callback);
  }

  public onAnyTick(callback: (tick: MarketTick) => void): void {
    this.eventEmitter.on('tick:*', callback);
  }

  public getProviderName(): string {
    return this.provider.name;
  }

  public getStatus(): string {
    return this.provider.isConnected ? 'CONNECTED' : 'DISCONNECTED';
  }
}
