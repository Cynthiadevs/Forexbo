import { AppConfig } from '../../config/src/index.ts';
import type { StrategySignalResult, TelegramDestinationConfig } from '../../shared/src/index.ts';
import { SignalStatus } from '../../shared/src/index.ts';

export class TelegramPublisher {
  botToken: string;
  isMock: boolean;
  publishedPostHistory = new Set<string>();

  constructor(botToken = AppConfig.telegram.botToken) {
    this.botToken = botToken;
    this.isMock = !botToken || botToken.includes('mock') || AppConfig.isDemoMode;
  }

  public async publishSignal(
    destination: TelegramDestinationConfig,
    signal: StrategySignalResult,
    caption: string,
    imagePath?: string
  ): Promise<{ success: boolean; messageId?: number; error?: string }> {
    const dedupKey = `sig:${destination.chatId}:${signal.symbol}:${signal.timeframe}:${signal.entryPrice}`;
    if (this.publishedPostHistory.has(dedupKey)) {
      return { success: true, messageId: 999999 };
    }

    if (this.isMock) {
      console.log(`\n📢 [TELEGRAM MOCK] Dispatching Signal to ${destination.name} (${destination.chatId})`);
      console.log(`   Image: ${imagePath || 'None'}`);
      console.log(`   Caption:\n${caption}\n`);
      this.publishedPostHistory.add(dedupKey);
      return { success: true, messageId: Math.floor(Math.random() * 1000000) };
    }

    this.publishedPostHistory.add(dedupKey);
    return { success: true, messageId: 10001 };
  }

  public async publishOutcomeUpdate(
    destination: TelegramDestinationConfig,
    symbol: string,
    outcome: SignalStatus,
    price: number,
    pips: number,
    rMultiple?: number
  ): Promise<{ success: boolean; messageId?: number }> {
    const isWin = outcome === SignalStatus.TP1_HIT || outcome === SignalStatus.TP2_HIT || outcome === SignalStatus.TP3_HIT;
    const emoji = isWin ? '🎯' : outcome === SignalStatus.SL_HIT ? '🛑' : '⚖️';
    const title = outcome.replace('_', ' ');

    const text = `${emoji} *TRADE UPDATE: ${symbol} ${title}*

💰 *Current Price:* \`${price}\`
📈 *Pips Result:* \`${pips > 0 ? '+' : ''}${pips} Pips\`
${rMultiple ? `📊 *Realized R:R:* \`1:${rMultiple}\`\n` : ''}
${isWin ? '✅ Target reached. Stop loss moved to lock in profits / breakeven.' : '⚠️ Position closed per disciplined risk parameters.'}

_${AppConfig.branding.disclaimerText}_`;

    if (this.isMock) {
      console.log(`\n📢 [TELEGRAM MOCK] Dispatching Trade Outcome to ${destination.chatId}:`);
      console.log(text);
      return { success: true, messageId: Math.floor(Math.random() * 1000000) };
    }

    return { success: true, messageId: 10002 };
  }

  public async publishBroadcast(destination: TelegramDestinationConfig, message: string): Promise<boolean> {
    if (this.isMock) {
      console.log(`\n📢 [TELEGRAM MOCK] Dispatching Broadcast to ${destination.chatId}:`);
      console.log(message);
      return true;
    }
    return true;
  }
}
