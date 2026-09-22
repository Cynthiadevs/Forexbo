import EventEmitter from 'events';
import type { Candle, MarketTick, Timeframe, MarketDataStatus } from '../../../shared/src/index.ts';
import type { IMarketDataProvider } from '../interfaces.ts';

interface PairSimulationState {
  currentPrice: number;
  pipDecimal: number;
  baseSpread: number;
  volatility: number;
  trendBias: number;
}

export class DemoMarketDataProvider implements IMarketDataProvider {
  public readonly name = 'DEMO_SIMULATOR';
  public isConnected = false;

  private readonly eventEmitter = new EventEmitter();
  private tickInterval: NodeJS.Timeout | null = null;
  private readonly pairStates = new Map<string, PairSimulationState>();
  private readonly candleCache = new Map<string, Map<Timeframe, Candle[]>>();

  constructor() {
    this.initializePairStates();
  }

  private initializePairStates(): void {
    const defaults: Record<string, { price: number; decimals: number; spread: number; vol: number; bias: number }> = {
      EURUSD: { price: 1.08500, decimals: 4, spread: 0.00010, vol: 0.00020, bias: 0.00002 },
      GBPUSD: { price: 1.29200, decimals: 4, spread: 0.00014, vol: 0.00030, bias: 0.00003 },
      USDJPY: { price: 154.500, decimals: 2, spread: 0.012, vol: 0.040, bias: -0.005 },
      USDCHF: { price: 0.88500, decimals: 4, spread: 0.00012, vol: 0.00018, bias: -0.00001 },
      AUDUSD: { price: 0.65800, decimals: 4, spread: 0.00011, vol: 0.00022, bias: 0.00002 },
      NZDUSD: { price: 0.59800, decimals: 4, spread: 0.00015, vol: 0.00020, bias: 0.00001 },
      USDCAD: { price: 1.38500, decimals: 4, spread: 0.00013, vol: 0.00022, bias: -0.00002 },
      EURGBP: { price: 0.83950, decimals: 4, spread: 0.00012, vol: 0.00015, bias: 0.00001 },
      EURJPY: { price: 167.600, decimals: 2, spread: 0.015, vol: 0.045, bias: 0.004 },
      GBPJPY: { price: 199.600, decimals: 2, spread: 0.018, vol: 0.055, bias: 0.006 },
      GBPCHF: { price: 1.14350, decimals: 4, spread: 0.00018, vol: 0.00025, bias: 0.00001 },
      AUDJPY: { price: 101.650, decimals: 2, spread: 0.016, vol: 0.040, bias: 0.003 },
      XAUUSD: { price: 2650.50, decimals: 2, spread: 0.25, vol: 0.75, bias: 0.15 },
      XAGUSD: { price: 31.850, decimals: 3, spread: 0.025, vol: 0.06, bias: 0.01 }
    };

    for (const [symbol, state] of Object.entries(defaults)) {
      this.pairStates.set(symbol, {
        currentPrice: state.price,
        pipDecimal: state.decimals,
        baseSpread: state.spread,
        volatility: state.vol,
        trendBias: state.bias
      });
      this.candleCache.set(symbol, new Map<Timeframe, Candle[]>());
    }
  }

  public async connect(): Promise<void> {
    if (this.isConnected) return;
    this.isConnected = true;

    this.tickInterval = setInterval(() => {
      this.generateLiveTicks();
    }, 1500);
  }

  public async disconnect(): Promise<void> {
    this.isConnected = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  private generateLiveTicks(): void {
    const now = Date.now();
    for (const [symbol, state] of this.pairStates.entries()) {
      const delta = (Math.random() - 0.49) * state.volatility + state.trendBias;
      state.currentPrice = Math.max(0.0001, Number((state.currentPrice + delta).toFixed(state.pipDecimal)));

      const halfSpread = state.baseSpread / 2;
      const bid = Number((state.currentPrice - halfSpread).toFixed(state.pipDecimal));
      const ask = Number((state.currentPrice + halfSpread).toFixed(state.pipDecimal));
      const spreadPips = Number(((ask - bid) * Math.pow(10, state.pipDecimal === 2 ? 2 : 4)).toFixed(1));

      const tick: MarketTick = {
        symbol,
        bid,
        ask,
        spread: spreadPips,
        timestamp: now,
        status: 'OK'
      };

      this.eventEmitter.emit(`tick:${symbol}`, tick);
      this.eventEmitter.emit('tick:*', tick);
    }
  }

  public async getLatestTick(symbol: string): Promise<MarketTick> {
    const state = this.pairStates.get(symbol);
    if (!state) {
      throw new Error(`Unsupported demo symbol: ${symbol}`);
    }

    const halfSpread = state.baseSpread / 2;
    const bid = Number((state.currentPrice - halfSpread).toFixed(state.pipDecimal));
    const ask = Number((state.currentPrice + halfSpread).toFixed(state.pipDecimal));
    const spreadPips = Number(((ask - bid) * Math.pow(10, state.pipDecimal === 2 ? 2 : 4)).toFixed(1));

    return {
      symbol,
      bid,
      ask,
      spread: spreadPips,
      timestamp: Date.now(),
      status: 'OK'
    };
  }

  public async getHistoricalCandles(symbol: string, timeframe: Timeframe, count = 200): Promise<Candle[]> {
    const state = this.pairStates.get(symbol);
    if (!state) {
      throw new Error(`Unsupported demo symbol: ${symbol}`);
    }

    const cachedMap = this.candleCache.get(symbol);
    const cached = cachedMap?.get(timeframe);
    if (cached && cached.length >= count) {
      return cached.slice(-count);
    }

    const tfMinutes = this.timeframeToMinutes(timeframe);
    const intervalMs = tfMinutes * 60 * 1000;
    const now = Date.now();
    const startTime = now - (count * intervalMs);

    const candles: Candle[] = [];
    let currentPrice = state.currentPrice * 0.98;

    for (let i = 0; i < count; i++) {
      const candleTime = startTime + (i * intervalMs);
      const open = currentPrice;
      const wave = Math.sin(i / 10) * (state.volatility * 3);
      const randomDrift = (Math.random() - 0.48) * (state.volatility * 2);
      const closeDelta = wave + randomDrift;
      const close = Number(Math.max(0.0001, open + closeDelta).toFixed(state.pipDecimal));
      
      const wickHigh = Math.random() * (state.volatility * 1.5);
      const wickLow = Math.random() * (state.volatility * 1.5);
      const high = Number((Math.max(open, close) + wickHigh).toFixed(state.pipDecimal));
      const low = Number((Math.min(open, close) - wickLow).toFixed(state.pipDecimal));
      const volume = Math.floor(500 + Math.random() * 4500);

      candles.push({
        timestamp: candleTime,
        open,
        high,
        low,
        close,
        volume
      });

      currentPrice = close;
    }

    if (cachedMap) {
      cachedMap.set(timeframe, candles);
    }

    return candles;
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

  private timeframeToMinutes(timeframe: Timeframe): number {
    switch (timeframe) {
      case '1m': return 1;
      case '5m': return 5;
      case '15m': return 15;
      case '30m': return 30;
      case '1h': return 60;
      case '4h': return 240;
      case '1d': return 1440;
      default: return 15;
    }
  }
}
