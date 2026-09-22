import { AIService } from '../../../packages/ai/src/index.ts';
import { TelegramPublisher } from '../../../packages/telegram/src/index.ts';
import { AppConfig } from '../../../packages/config/src/index.ts';
import type { TelegramDestinationConfig } from '../../../packages/shared/src/index.ts';
import { DestinationType } from '../../../packages/shared/src/index.ts';

export class ContentSchedulerWorker {
  private readonly aiService: AIService;
  private readonly telegramPublisher: TelegramPublisher;
  private reportInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.aiService = AIService.getInstance();
    this.telegramPublisher = new TelegramPublisher();
  }

  public start(): void {
    console.log('⏰ Content & Market Report Scheduler started.');
    // Schedule check every 60 minutes
    this.reportInterval = setInterval(() => this.checkAndRunSchedules(), 60 * 60 * 1000);
  }

  public stop(): void {
    if (this.reportInterval) {
      clearInterval(this.reportInterval);
      this.reportInterval = null;
    }
  }

  public async broadcastDailyReport(): Promise<void> {
    console.log('📰 Generating Daily Forex Market Briefing...');
    const reportText = await this.aiService.generateDailyReport();

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

    await this.telegramPublisher.publishBroadcast(destination, reportText);
  }

  private async checkAndRunSchedules(): Promise<void> {
    const currentUtcHour = new Date().getUTCHours();
    // Daily report at 07:00 UTC (London session opening preparation)
    if (currentUtcHour === 7) {
      await this.broadcastDailyReport();
    }
  }
}
