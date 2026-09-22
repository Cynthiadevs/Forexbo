import { MarketDataService } from './market-service.js';

async function runDemo() {
  console.log('--- Starting Forex Market Data Demo Stream ---');
  const service = MarketDataService.getInstance();
  await service.start();

  let tickCount = 0;
  service.onAnyTick((tick) => {
    tickCount++;
    if (tickCount % 5 === 0) {
      console.log(`[TICK] ${tick.symbol.padEnd(8)} | Bid: ${tick.bid.toString().padEnd(8)} | Ask: ${tick.ask.toString().padEnd(8)} | Spread: ${tick.spread} pips | Time: ${new Date(tick.timestamp).toISOString()}`);
    }
  });

  // Get sample EURUSD and XAUUSD historical candles
  const { candles: eurCandles, validation: eurVal } = await service.getCandles('EURUSD', '15m' as any, 5);
  console.log('\n--- EURUSD 15m Sample Candles ---');
  console.log('Validation Status:', eurVal.status, 'Valid:', eurVal.isValid);
  console.table(eurCandles);

  const { candles: goldCandles, validation: goldVal } = await service.getCandles('XAUUSD', '1h' as any, 5);
  console.log('\n--- XAUUSD 1h Sample Candles ---');
  console.log('Validation Status:', goldVal.status, 'Valid:', goldVal.isValid);
  console.table(goldCandles);

  setTimeout(async () => {
    console.log('Stopping demo runner after 6 seconds...');
    await service.stop();
    process.exit(0);
  }, 6000);
}

runDemo().catch((err) => {
  console.error(err);
  process.exit(1);
});
