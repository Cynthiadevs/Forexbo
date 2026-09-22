import { APIServer } from './server.ts';
import { AppConfig } from '../../../packages/config/src/index.ts';
import { MarketDataService } from '../../../packages/market-engine/src/index.ts';
import { SignalLifecycleMonitor } from '../../worker/src/lifecycle-monitor.ts';
import { MarketScannerWorker } from '../../worker/src/market-scanner.ts';
import { ContentSchedulerWorker } from '../../worker/src/content-scheduler.ts';
import { TelegramBotHandler } from '../../../packages/telegram/src/index.ts';

async function bootstrapRenderProduction() {
  console.log('================================================================');
  console.log('🚀 INITIALIZING FOREX AI & TELEGRAM PLATFORM ON RENDER.COM');
  console.log('================================================================');

  const port = parseInt(process.env.PORT || '4000', 10);

  // 1. Initialize & Start Real-time Market Ingestion Feed
  const marketService = MarketDataService.getInstance();
  await marketService.start();
  console.log(`✅ Market Engine initialized with provider: ${marketService.getProviderName()}`);

  // 2. Start Background Signal Lifecycle Monitor (TP1-3, SL, Breakeven tracking)
  const monitor = SignalLifecycleMonitor.getInstance();
  monitor.start();
  console.log('✅ Signal Lifecycle Monitor active (tracking TP/SL hits & trailing stop)');

  // 3. Start Multi-Timeframe Market Scanner
  const scanner = new MarketScannerWorker();
  scanner.start(30000); // 30s scan interval
  console.log('✅ Multi-Timeframe Market Scanner running across 14 assets');

  // 4. Start Daily Content & Market Briefing Scheduler
  const scheduler = new ContentSchedulerWorker();
  scheduler.start();
  console.log('✅ Daily Market Report Scheduler operational');

  // 5. Initialize Telegram Bot Poller
  const botToken = process.env.TELEGRAM_BOT_TOKEN || AppConfig.telegram.botToken;
  const isMockBot = !botToken || botToken.includes('mock') || botToken === 'your_telegram_bot_token_here';

  if (isMockBot) {
    console.log('⚠️ [TELEGRAM] Running in Simulation/Demo mode (No TELEGRAM_BOT_TOKEN provided).');
    console.log('   To enable live Telegram responses, set TELEGRAM_BOT_TOKEN in Render environment variables.');
  } else {
    console.log('🤖 [TELEGRAM] Starting Live Bot Long-Polling...');
    const botHandler = new TelegramBotHandler();
    let offset = 0;

    const startPolling = async () => {
      while (true) {
        try {
          const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&timeout=25`);
          const data = (await res.json()) as any;
          const updates = data?.result || [];

          for (const update of updates) {
            offset = update.update_id + 1;
            const msg = update.message;
            if (msg && msg.text) {
              console.log(`📩 [Telegram] Received: "${msg.text}" from @${msg.from?.username || msg.from?.id}`);
              const responseText = await botHandler.handleMessage({
                messageId: msg.message_id,
                chatId: msg.chat.id,
                userId: msg.from?.id || 0,
                username: msg.from?.username,
                text: msg.text
              });

              await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  chat_id: msg.chat.id,
                  text: responseText,
                  parse_mode: 'Markdown'
                })
              });
            }
          }
        } catch (err: any) {
          // Silent catch to prevent crash on network blips
          await new Promise((r) => setTimeout(r, 2000));
        }
      }
    };

    // Run polling loop in background
    startPolling().catch((err) => console.error('[Telegram Poller Error]', err));
    console.log('🚀 Live Telegram Bot Poller is listening for commands (/start, /signals, /market, /signal EURUSD, etc.)');
  }

  // 6. Start the REST API & SSE Server (Render listens on process.env.PORT)
  const apiServer = new APIServer();
  await apiServer.start(port);

  console.log('================================================================');
  console.log(`🌐 Application is LIVE on Render port ${port}`);
  console.log(`📖 OpenAPI Swagger Documentation: http://localhost:${port}/docs`);
  console.log(`💚 Health Check Endpoint: http://localhost:${port}/health`);
  console.log('================================================================\n');

  // Graceful shutdown handling
  const shutdown = async () => {
    console.log('\n🛑 Gracefully shutting down Render service...');
    scanner.stop();
    scheduler.stop();
    monitor.stop();
    await apiServer.stop();
    await marketService.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrapRenderProduction().catch((err) => {
  console.error('❌ Fatal error during Render bootstrap:', err);
  process.exit(1);
});
