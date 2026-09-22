import { DemoMarketDataProvider } from '@forex/market-engine';
import { QuantitativeSignalEngine } from '@forex/strategy-engine';
import { Timeframe } from '@forex/shared';
import { SignalCardRenderer } from './signal-card-renderer.js';

async function testRender() {
  console.log('🎨 Testing Signal Card Graphic Generator...');

  const provider = new DemoMarketDataProvider();
  await provider.connect();

  const symbol = 'XAUUSD';
  const h4 = await provider.getHistoricalCandles(symbol, Timeframe.H4, 50);
  const h1 = await provider.getHistoricalCandles(symbol, Timeframe.H1, 50);
  const m15 = await provider.getHistoricalCandles(symbol, Timeframe.M15, 50);
  const m5 = await provider.getHistoricalCandles(symbol, Timeframe.M5, 50);

  const engine = new QuantitativeSignalEngine({ pipDecimal: 2, minScoreToQualify: 50 });
  const signal = engine.evaluate(symbol, Timeframe.M15, { h4, h1, m15, m5 });

  const filePath = await SignalCardRenderer.renderToFile(signal);
  console.log(`✅ Branded Signal Image rendered successfully to:\n   ${filePath}`);

  await provider.disconnect();
}

testRender().catch(console.error);
