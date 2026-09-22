import type { StrategySignalResult, TelegramDestinationConfig } from '../../../packages/shared/src/index.ts';
import { SignalStatus, SignalDirection, DestinationType } from '../../../packages/shared/src/index.ts';
import { MarketDataService } from '../../../packages/market-engine/src/index.ts';
import { TelegramPublisher } from '../../../packages/telegram/src/index.ts';
import { AppConfig } from '../../../packages/config/src/index.ts';

export interface MonitoredTrade {
  id: string;
  symbol: string;
  direction: SignalDirection;
  entryPrice: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2?: number;
  takeProfit3?: number;
  status: SignalStatus;
  createdAt: Date;
  tp1Hit: boolean;
  tp2Hit: boolean;
  tp3Hit: boolean;
  slHit: boolean;
  pipMultiplier: number;
}

export class SignalLifecycleMonitor {
  private static instance: SignalLifecycleMonitor;
  private readonly activeTrades = new Map<string, MonitoredTrade>();
  private readonly marketService: MarketDataService;
  private readonly telegramPublisher: TelegramPublisher;
  private isRunning = false;

  private constructor() {
    this.marketService = MarketDataService.getInstance();
    this.telegramPublisher = new TelegramPublisher();
  }

  public static getInstance(): SignalLifecycleMonitor {
    if (!SignalLifecycleMonitor.instance) {
      SignalLifecycleMonitor.instance = new SignalLifecycleMonitor();
    }
    return SignalLifecycleMonitor.instance;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    this.marketService.onAnyTick((tick) => {
      this.evaluateTick(tick.symbol, tick.bid, tick.ask);
    });

    console.log('🔄 Signal Lifecycle Monitor started.');
  }

  public registerSignal(signal: StrategySignalResult, id = `sig-${Date.now()}`): MonitoredTrade {
    const isJpyOrMetal = signal.symbol.includes('JPY') || signal.symbol.includes('XAU');
    const trade: MonitoredTrade = {
      id,
      symbol: signal.symbol,
      direction: signal.direction,
      entryPrice: signal.entryPrice,
      stopLoss: signal.stopLoss,
      takeProfit1: signal.takeProfit1,
      takeProfit2: signal.takeProfit2,
      takeProfit3: signal.takeProfit3,
      status: SignalStatus.ACTIVE,
      createdAt: new Date(),
      tp1Hit: false,
      tp2Hit: false,
      tp3Hit: false,
      slHit: false,
      pipMultiplier: isJpyOrMetal ? 100 : 10000
    };

    this.activeTrades.set(trade.id, trade);
    console.log(`[LifecycleMonitor] Tracking trade ${trade.id} for ${trade.symbol} (${trade.direction}) at ${trade.entryPrice}`);
    return trade;
  }

  private async evaluateTick(symbol: string, bid: number, ask: number): Promise<void> {
    for (const [id, trade] of this.activeTrades.entries()) {
      if (trade.symbol !== symbol || trade.status === SignalStatus.TP3_HIT || trade.status === SignalStatus.SL_HIT || trade.status === SignalStatus.CANCELLED) {
        continue;
      }

      const currentPrice = trade.direction === SignalDirection.BUY ? bid : ask;

      if (trade.direction === SignalDirection.BUY) {
        // Stop loss hit
        if (currentPrice <= trade.stopLoss && !trade.slHit) {
          trade.slHit = true;
          trade.status = SignalStatus.SL_HIT;
          const pips = Number(((currentPrice - trade.entryPrice) * trade.pipMultiplier).toFixed(1));
          await this.notifyOutcome(trade, SignalStatus.SL_HIT, currentPrice, pips);
          this.activeTrades.delete(id);
          continue;
        }

        // TP3 Hit
        if (trade.takeProfit3 && currentPrice >= trade.takeProfit3 && !trade.tp3Hit) {
          trade.tp3Hit = true;
          trade.status = SignalStatus.TP3_HIT;
          const pips = Number(((currentPrice - trade.entryPrice) * trade.pipMultiplier).toFixed(1));
          await this.notifyOutcome(trade, SignalStatus.TP3_HIT, currentPrice, pips, 3.2);
          this.activeTrades.delete(id);
          continue;
        }

        // TP2 Hit
        if (trade.takeProfit2 && currentPrice >= trade.takeProfit2 && !trade.tp2Hit) {
          trade.tp2Hit = true;
          trade.status = SignalStatus.TP2_HIT;
          const pips = Number(((currentPrice - trade.entryPrice) * trade.pipMultiplier).toFixed(1));
          await this.notifyOutcome(trade, SignalStatus.TP2_HIT, currentPrice, pips, 2.0);
        }

        // TP1 Hit
        if (currentPrice >= trade.takeProfit1 && !trade.tp1Hit) {
          trade.tp1Hit = true;
          trade.status = SignalStatus.TP1_HIT;
          // Move stop loss to breakeven
          trade.stopLoss = trade.entryPrice;
          const pips = Number(((currentPrice - trade.entryPrice) * trade.pipMultiplier).toFixed(1));
          await this.notifyOutcome(trade, SignalStatus.TP1_HIT, currentPrice, pips, 1.2);
        }
      } else if (trade.direction === SignalDirection.SELL) {
        // Stop loss hit
        if (currentPrice >= trade.stopLoss && !trade.slHit) {
          trade.slHit = true;
          trade.status = SignalStatus.SL_HIT;
          const pips = Number(((trade.entryPrice - currentPrice) * trade.pipMultiplier).toFixed(1));
          await this.notifyOutcome(trade, SignalStatus.SL_HIT, currentPrice, pips);
          this.activeTrades.delete(id);
          continue;
        }

        // TP3 Hit
        if (trade.takeProfit3 && currentPrice <= trade.takeProfit3 && !trade.tp3Hit) {
          trade.tp3Hit = true;
          trade.status = SignalStatus.TP3_HIT;
          const pips = Number(((trade.entryPrice - currentPrice) * trade.pipMultiplier).toFixed(1));
          await this.notifyOutcome(trade, SignalStatus.TP3_HIT, currentPrice, pips, 3.2);
          this.activeTrades.delete(id);
          continue;
        }

        // TP2 Hit
        if (trade.takeProfit2 && currentPrice <= trade.takeProfit2 && !trade.tp2Hit) {
          trade.tp2Hit = true;
          trade.status = SignalStatus.TP2_HIT;
          const pips = Number(((trade.entryPrice - currentPrice) * trade.pipMultiplier).toFixed(1));
          await this.notifyOutcome(trade, SignalStatus.TP2_HIT, currentPrice, pips, 2.0);
        }

        // TP1 Hit
        if (currentPrice <= trade.takeProfit1 && !trade.tp1Hit) {
          trade.tp1Hit = true;
          trade.status = SignalStatus.TP1_HIT;
          trade.stopLoss = trade.entryPrice;
          const pips = Number(((trade.entryPrice - currentPrice) * trade.pipMultiplier).toFixed(1));
          await this.notifyOutcome(trade, SignalStatus.TP1_HIT, currentPrice, pips, 1.2);
        }
      }
    }
  }

  private async notifyOutcome(trade: MonitoredTrade, outcome: SignalStatus, price: number, pips: number, rMultiple?: number): Promise<void> {
    console.log(`🎯 [Lifecycle Event] ${trade.symbol} outcome: ${outcome} at ${price} (${pips} pips)`);
    const defaultDest: TelegramDestinationConfig = {
      id: 'default',
      name: 'Primary VIP Channel',
      chatId: AppConfig.telegram.defaultChannelId,
      type: DestinationType.CHANNEL,
      enabled: true,
      signalsEnabled: true,
      analysisEnabled: true,
      newsEnabled: true,
      dailyReportEnabled: true,
      resultUpdatesEnabled: true
    };

    await this.telegramPublisher.publishOutcomeUpdate(defaultDest, trade.symbol, outcome, price, pips, rMultiple);
  }

  public getActiveTrades(): MonitoredTrade[] {
    return Array.from(this.activeTrades.values());
  }
}
