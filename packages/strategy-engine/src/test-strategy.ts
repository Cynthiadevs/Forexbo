import { DemoMarketDataProvider } from '@forex/market-engine';
import { Timeframe } from '@forex/shared';
import { QuantitativeSignalEngine } from './signal-engine.js';
import { RiskEngine } from './risk.js';

async function testStrategyEngine() {
  console.log('🧪 Testing Strategy Engine & Multi-Timeframe Scoring...\n');

  const provider = new DemoMarketDataProvider();
  await provider.connect();

  const symbol = 'XAUUSD';
  const h4 = await provider.getHistoricalCandles(symbol, Timeframe.H4, 50);
  const h1 = await provider.getHistoricalCandles(symbol, Timeframe.H1, 50);
  const m15 = await provider.getHistoricalCandles(symbol, Timeframe.M15, 50);
  const m5 = await provider.getHistoricalCandles(symbol, Timeframe.M5, 50);

  const engine = new QuantitativeSignalEngine({ pipDecimal: 2, minScoreToQualify: 60 });
  const signal = engine.evaluate(symbol, Timeframe.M15, { h4, h1, m15, m5 });

  console.log(`=== Signal Evaluation for ${symbol} ===`);
  console.log(`Direction:       ${signal.direction}`);
  console.log(`Score:           ${signal.score}/100 (${signal.scoreCategory})`);
  console.log(`Qualifies:       ${signal.qualifies}`);
  console.log(`Entry:           ${signal.entryPrice}`);
  console.log(`Stop Loss:       ${signal.stopLoss}`);
  console.log(`TP1 / TP2 / TP3: ${signal.takeProfit1} / ${signal.takeProfit2} / ${signal.takeProfit3}`);
  console.log(`R:R (TP1/TP2):   1:${signal.riskRewardRatio1} / 1:${signal.riskRewardRatio2}`);
  console.log('\n--- Score Breakdown ---');
  console.table(signal.breakdown);

  console.log('\n--- Risk Engine Evaluation ---');
  const tick = await provider.getLatestTick(symbol);
  const riskEngine = new RiskEngine();
  const riskEval = riskEngine.evaluateSignal(signal, tick);
  console.log('Risk Passed:', riskEval.passed);
  console.log('Current Session:', riskEval.currentSession);
  console.log('Spread:', riskEval.spreadPips, 'pips');
  if (!riskEval.passed) {
    console.log('Rejections:', riskEval.rejectionReasons);
  }

  await provider.disconnect();
}

testStrategyEngine().catch(console.error);
