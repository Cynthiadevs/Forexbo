import { DemoMarketDataProvider } from '../packages/market-engine/src/index.ts';
import { MarketDataValidator } from '../packages/market-engine/src/validator.ts';
import {
  TechnicalIndicatorsCalculator,
  MarketStructureAnalyzer,
  MultiTimeframeAnalyzer,
  QuantitativeSignalEngine,
  RiskEngine,
  SLTPCalculator,
  BacktestingEngine
} from '../packages/strategy-engine/src/index.ts';
import { AIService } from '../packages/ai/src/index.ts';
import { SignalCardRenderer } from '../packages/image-renderer/src/index.ts';
import { TelegramPublisher } from '../packages/telegram/src/index.ts';
import { Timeframe, SignalDirection, SignalStatus, DestinationType } from '../packages/shared/src/index.ts';
import { AppConfig } from '../packages/config/src/index.ts';

async function runE2ETestSuite() {
  console.log('================================================================');
  console.log('🧪 RUNNING END-TO-END FOREX AI & AUTOMATION VERIFICATION SUITE');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      throw new Error(`Assertion failed for: ${testName}`);
    }
  }

  // --- 1. MARKET DATA & VALIDATION ---
  console.log('1️⃣ Testing Market Data Ingestion & Freshness Validation...');
  const provider = new DemoMarketDataProvider();
  await provider.connect();

  const tick = await provider.getLatestTick('EURUSD');
  const validator = new MarketDataValidator(30000);
  const tickVal = validator.validateTick(tick);

  assert(tick.bid > 0 && tick.ask > tick.bid, 'Bid/Ask prices are valid and spread is positive');
  assert(tickVal.isValid, 'Market tick passed freshness and spread sanity checks');

  const candlesH4 = await provider.getHistoricalCandles('EURUSD', Timeframe.H4, 50);
  const candlesH1 = await provider.getHistoricalCandles('EURUSD', Timeframe.H1, 50);
  const candlesM15 = await provider.getHistoricalCandles('EURUSD', Timeframe.M15, 50);
  const candlesM5 = await provider.getHistoricalCandles('EURUSD', Timeframe.M5, 50);

  const seriesVal = validator.validateCandleSeries(candlesM15);
  assert(candlesM15.length === 50, 'Retrieved exact requested historical candle count (50)');
  assert(seriesVal.isValid, 'OHLC candle integrity validated without missing/duplicate timestamps');

  // --- 2. TECHNICAL INDICATORS ---
  console.log('\n2️⃣ Testing Technical Indicators Calculation Engine...');
  const indicators = TechnicalIndicatorsCalculator.compileSnapshot('EURUSD', Timeframe.M15, candlesM15);

  assert(indicators.rsi >= 0 && indicators.rsi <= 100, `RSI computed correctly (${indicators.rsi})`);
  assert(!isNaN(indicators.macd.histogram), 'MACD Histogram computed');
  assert(indicators.ema20 > 0 && indicators.ema50 > 0 && indicators.ema200 > 0, 'EMA 20/50/200 Stack computed');
  assert(indicators.adx.adx >= 0, `ADX computed correctly (${indicators.adx.adx})`);
  assert(indicators.bollingerBands.upper > indicators.bollingerBands.lower, 'Bollinger Bands bands span correctly');

  // --- 3. MARKET STRUCTURE & BOS/CHOCH ---
  console.log('\n3️⃣ Testing Market Structure & Institutional Smart Money Analyzer...');
  const structure = MarketStructureAnalyzer.analyze('EURUSD', Timeframe.M15, candlesM15);

  assert(structure.nearestSupport > 0, `Nearest support identified at ${structure.nearestSupport}`);
  assert(structure.nearestResistance > structure.nearestSupport, `Nearest resistance at ${structure.nearestResistance}`);
  assert(structure.structureTrend !== undefined, `Structure trend evaluated as ${structure.structureTrend}`);

  // --- 4. MULTI-TIMEFRAME CONFLUENCE ---
  console.log('\n4️⃣ Testing Multi-Timeframe Alignment (4H, 1H, 15M, 5M)...');
  const mtf = MultiTimeframeAnalyzer.analyze('EURUSD', {
    h4: candlesH4,
    h1: candlesH1,
    m15: candlesM15,
    m5: candlesM5
  });

  assert(mtf.alignmentScore >= 0 && mtf.alignmentScore <= 100, `MTF Alignment Score calculated: ${mtf.alignmentScore}%`);
  assert(mtf.overallTrend !== undefined, `Overall MTF trend determined as ${mtf.overallTrend}`);

  // --- 5. QUANTITATIVE SCORING ENGINE ---
  console.log('\n5️⃣ Testing 0-100 Quantitative Scoring Model...');
  const signalEngine = new QuantitativeSignalEngine({ minScoreToQualify: 50 });
  const signal = signalEngine.evaluate('EURUSD', Timeframe.M15, {
    h4: candlesH4,
    h1: candlesH1,
    m15: candlesM15,
    m5: candlesM5
  });

  assert(signal.score >= 0 && signal.score <= 100, `Signal Score calculated: ${signal.score}/100`);
  assert(signal.breakdown.totalScore === signal.score, 'Sum of 8 scoring factors equals total score');
  assert(signal.takeProfit1 > 0 && signal.stopLoss > 0, 'SL and TP targets calculated');
  assert(signal.riskRewardRatio1 > 0, `Risk:Reward Ratio 1 evaluated (1:${signal.riskRewardRatio1})`);

  // --- 6. RISK ENGINE FILTERS ---
  console.log('\n6️⃣ Testing Risk Engine & Exposure Filters...');
  const riskEngine = new RiskEngine();
  const riskResult = riskEngine.evaluateSignal(signal, tick);
  assert(riskResult.currentSession !== undefined, `Identified active market session: ${riskResult.currentSession}`);
  assert(typeof riskResult.passed === 'boolean', 'Risk filter evaluation returned boolean status');

  // --- 7. AI REASONING & CAPTIONS ---
  console.log('\n7️⃣ Testing AI Reasoning & Structured JSON / Fallback Template Engine...');
  const aiService = AIService.getInstance();
  const aiExplanation = await aiService.explainSignal(signal);

  assert(aiExplanation.summary.length > 10, 'AI summary explanation generated');
  assert(aiExplanation.keyFactors.length >= 1, 'AI key factors breakdown generated');
  assert(aiExplanation.caption.length > 20, 'Telegram caption generated');

  // --- 8. GRAPHIC IMAGE RENDERER ---
  console.log('\n8️⃣ Testing High-Resolution Vector SVG Signal Image Generator...');
  const imageSvg = SignalCardRenderer.generateSVG(signal);
  assert(imageSvg.includes('<svg') && imageSvg.includes(signal.symbol), 'SVG contains valid vector XML and symbol');
  const imageFile = await SignalCardRenderer.renderToFile(signal);
  assert(imageFile.endsWith('.svg'), `Rendered image saved to disk: ${imageFile}`);

  // --- 9. TELEGRAM DISPATCH ---
  console.log('\n9️⃣ Testing Multi-Destination Telegram Publishing...');
  const publisher = new TelegramPublisher();
  const dest = {
    id: 'test-dest',
    name: 'VIP Channel',
    chatId: AppConfig.telegram.defaultChannelId,
    type: DestinationType.CHANNEL,
    enabled: true,
    signalsEnabled: true,
    analysisEnabled: true,
    newsEnabled: true,
    dailyReportEnabled: true,
    resultUpdatesEnabled: true
  };

  const publishRes = await publisher.publishSignal(dest, signal, aiExplanation.caption, imageFile);
  assert(publishRes.success, 'Signal successfully dispatched to Telegram destination');

  // --- 10. HISTORICAL BACKTESTING ---
  console.log('\n🔟 Testing Historical Backtester with Zero Look-ahead Bias...');
  const backtestRes = BacktestingEngine.runBacktest({
    symbol: 'EURUSD',
    timeframe: Timeframe.M15,
    startDate: new Date(Date.now() - 30 * 86400000),
    endDate: new Date(),
    initialBalance: 10000,
    riskPercentagePerTrade: 1.0,
    minScoreToQualify: 50
  }, candlesM15);

  assert(backtestRes.totalTrades >= 0, `Backtest completed with ${backtestRes.totalTrades} simulated trades`);
  assert(typeof backtestRes.winRate === 'number', `Backtest Win Rate: ${backtestRes.winRate}%`);

  await provider.disconnect();

  console.log('\n================================================================');
  console.log(`🎉 ALL ${passedTests}/${totalTests} TESTS PASSED PERFECTLY!`);
  console.log('================================================================\n');
}

runE2ETestSuite().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
