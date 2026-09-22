import { SUPPORTED_PAIRS, AppConfig } from '../../../packages/config/src/index.ts';
import { MarketDataService } from '../../../packages/market-engine/src/index.ts';
import { QuantitativeSignalEngine, RiskEngine } from '../../../packages/strategy-engine/src/index.ts';
import { AIService } from '../../../packages/ai/src/index.ts';
import { SignalCardRenderer } from '../../../packages/image-renderer/src/index.ts';
import { TelegramPublisher } from '../../../packages/telegram/src/index.ts';
import type { TelegramDestinationConfig } from '../../../packages/shared/src/index.ts';
import { Timeframe, SignalDirection, DestinationType } from '../../../packages/shared/src/index.ts';
import { SignalLifecycleMonitor } from './lifecycle-monitor.ts';

export class MarketScannerWorker {
  private readonly marketService: MarketDataService;
  private readonly signalEngine: QuantitativeSignalEngine;
  private readonly riskEngine: RiskEngine;
  private readonly aiService: AIService;
  private readonly telegramPublisher: TelegramPublisher;
  private readonly monitor: SignalLifecycleMonitor;
  private scanInterval: NodeJS.Timeout | null = null;
  private isScanning = false;

  constructor() {
    this.marketService = MarketDataService.getInstance();
    this.signalEngine = new QuantitativeSignalEngine({ minScoreToQualify: 68 });
    this.riskEngine = new RiskEngine();
    this.aiService = AIService.getInstance();
    this.telegramPublisher = new TelegramPublisher();
    this.monitor = SignalLifecycleMonitor.getInstance();
  }

  public start(intervalMs = 30000): void {
    console.log(`📡 Market Scanner Worker started (Scan interval: ${intervalMs / 1000}s)`);
    // Run initial scan after 2 seconds
    setTimeout(() => this.runScanCycle(), 2000);
    this.scanInterval = setInterval(() => this.runScanCycle(), intervalMs);
  }

  public stop(): void {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
  }

  public async runScanCycle(): Promise<void> {
    if (this.isScanning) return;
    this.isScanning = true;

    try {
      console.log(`\n🔍 [Scanner] Scanning ${SUPPORTED_PAIRS.length} pairs across multi-timeframes...`);

      for (const pair of SUPPORTED_PAIRS) {
        try {
          const { candles: h4 } = await this.marketService.getCandles(pair.symbol, Timeframe.H4, 40);
          const { candles: h1 } = await this.marketService.getCandles(pair.symbol, Timeframe.H1, 40);
          const { candles: m15 } = await this.marketService.getCandles(pair.symbol, Timeframe.M15, 40);
          const { candles: m5 } = await this.marketService.getCandles(pair.symbol, Timeframe.M5, 40);

          const signal = this.signalEngine.evaluate(pair.symbol, Timeframe.M15, { h4, h1, m15, m5 });

          if (signal.qualifies && signal.direction !== SignalDirection.WAIT) {
            console.log(`✨ [VALID SIGNAL DETECTED] ${pair.symbol} ${signal.direction} | Score: ${signal.score}/100 [${signal.scoreCategory}]`);

            // Risk Evaluation
            const tick = await this.marketService.getLatestTick(pair.symbol);
            const riskResult = this.riskEngine.evaluateSignal(signal, tick);

            if (!riskResult.passed) {
              console.log(`⚠️ Risk filter rejected ${pair.symbol}: ${riskResult.rejectionReasons.join(', ')}`);
              continue;
            }

            // Record published for risk frequency & cooldown caps
            this.riskEngine.recordSignalPublished(pair.symbol, signal.direction);

            // Step 1: AI Reasoning & Telegram Caption Generation
            console.log(`🤖 Generating AI explanation & caption for ${pair.symbol}...`);
            const aiAnalysis = await this.aiService.explainSignal(signal);

            // Step 2: Render Branded Graphic
            console.log(`🎨 Rendering high-res signal image for ${pair.symbol}...`);
            const imagePath = await SignalCardRenderer.renderToFile(signal);

            // Step 3: Publish to Telegram
            const destination: TelegramDestinationConfig = {
              id: 'primary-vip',
              name: 'Alpha Quant VIP Channel',
              chatId: AppConfig.telegram.defaultChannelId,
              type: DestinationType.CHANNEL,
              enabled: true,
              signalsEnabled: true,
              analysisEnabled: true,
              newsEnabled: true,
              dailyReportEnabled: true,
              resultUpdatesEnabled: true
            };

            await this.telegramPublisher.publishSignal(destination, signal, aiAnalysis.caption, imagePath);

            // Step 4: Register in Lifecycle Monitor for continuous TP/SL tracking
            this.monitor.registerSignal(signal);
          }
        } catch (err: any) {
          // Log individual pair evaluation error without stopping the cycle
          console.warn(`[Scanner] Skipping ${pair.symbol}: ${err.message}`);
        }
      }
    } finally {
      this.isScanning = false;
    }
  }
}
