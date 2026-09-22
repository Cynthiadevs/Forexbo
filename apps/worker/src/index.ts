import { MarketDataService } from '../../../packages/market-engine/src/index.ts';
import { SignalLifecycleMonitor } from './lifecycle-monitor.ts';
import { MarketScannerWorker } from './market-scanner.ts';
import { ContentSchedulerWorker } from './content-scheduler.ts';

async function bootstrap() {
  console.log('====================================================');
  console.log('⚡ Starting Forex AI Background Worker Services');
  console.log('====================================================');

  // 1. Start Market Data Feed
  const marketService = MarketDataService.getInstance();
  await marketService.start();

  // 2. Start Lifecycle Monitor
  const lifecycleMonitor = SignalLifecycleMonitor.getInstance();
  lifecycleMonitor.start();

  // 3. Start Market Scanner
  const scanner = new MarketScannerWorker();
  scanner.start(30000); // 30s scan interval

  // 4. Start Content Scheduler
  const scheduler = new ContentSchedulerWorker();
  scheduler.start();

  console.log('✅ All background workers are operational.\n');

  // Graceful shutdown handling
  const shutdown = async () => {
    console.log('\n🛑 Gracefully shutting down worker services...');
    scanner.stop();
    scheduler.stop();
    await marketService.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((err) => {
  console.error('❌ Fatal error in worker bootstrap:', err);
  process.exit(1);
});
