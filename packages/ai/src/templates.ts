import type { StrategySignalResult, AIStructuredExplanation, SignalDirection } from '../../shared/src/index.ts';

export class TemplateEngine {
  public static generateFallbackExplanation(signal: StrategySignalResult): AIStructuredExplanation {
    const dir = signal.direction;
    const dirText = dir === 'BUY' ? 'Bullish Long' : 'Bearish Short';
    const bias = dir === 'BUY' ? 'BULLISH' : dir === 'SELL' ? 'BEARISH' : 'NEUTRAL';
    const icon = dir === 'BUY' ? '🟢' : '🔴';

    const keyFactors = [
      `Multi-timeframe structure alignment: ${signal.multiTimeframe.alignmentScore}% confluence`,
      `EMA alignment: ${signal.indicatorsSnapshot.emaAlignment} on ${signal.timeframe} timeframe`,
      `RSI reading of ${signal.indicatorsSnapshot.rsi} supporting directional momentum`,
      `Nearest institutional key level: Support at ${signal.marketStructure.nearestSupport} / Resistance at ${signal.marketStructure.nearestResistance}`
    ];

    const riskFactors = [
      `Strict stop loss placed at ${signal.stopLoss} (${signal.sltpMethod})`,
      'Observe potential economic news releases during active market sessions',
      'Manage risk sizing with no more than 1-2% account equity per position'
    ];

    const technicalConfluence = [
      `Score: ${signal.score}/100 (${signal.scoreCategory})`,
      `ADX: ${signal.indicatorsSnapshot.adx.adx} (${signal.indicatorsSnapshot.adx.trendStrength} trend strength)`,
      `Bollinger Bands %B: ${(signal.indicatorsSnapshot.bollingerBands.percentB * 100).toFixed(0)}%`
    ];

    const summary = `${icon} High-probability ${dirText} setup detected on ${signal.symbol} (${signal.timeframe}). Price action exhibits clean structural confirmation with ${signal.score}/100 quantitative confluence score.`;

    const caption = `${icon} ${signal.symbol} ${dir} SIGNAL

📌 Entry: ${signal.entryPrice}
🛑 Stop Loss: ${signal.stopLoss}

🎯 TP1: ${signal.takeProfit1} (1:${signal.riskRewardRatio1} R:R)
🎯 TP2: ${signal.takeProfit2} (1:${signal.riskRewardRatio2} R:R)
🎯 TP3: ${signal.takeProfit3} (1:${signal.riskRewardRatio3} R:R)

⏱ Timeframe: ${signal.timeframe.toUpperCase()}
📊 Signal Strength: ${signal.score}/100 [${signal.scoreCategory}]
📈 Market Bias: ${bias}

💡 Analysis Confluence:
• ${keyFactors[0]}
• ${keyFactors[1]}
• ${keyFactors[2]}

⚠️ Risk management is essential. Past performance does not guarantee future results.`;

    return {
      summary,
      marketBias: bias,
      keyFactors,
      riskFactors,
      technicalConfluence,
      caption,
      disclaimer: 'For educational purposes only. Forex trading involves high risk.',
      tokensUsed: 0,
      modelUsed: 'DETERMINISTIC_FALLBACK'
    };
  }

  public static generateFallbackDailyReport(dateStr = new Date().toISOString().split('T')[0]): string {
    return `🏛️ DAILY INSTITUTIONAL FOREX BRIEFING [${dateStr}]

🌍 GLOBAL MARKET SNAPSHOT:
• US Dollar (DXY): Consolidating near key technical pivot levels ahead of central bank speeches.
• EURUSD & GBPUSD: Maintaining structured ranges; watching for liquidity sweeps around session open highs/lows.
• XAUUSD (Gold): Holding elevated technical support as geopolitical and safe-haven liquidity remains active.

🎯 TODAY'S HIGH-PROBABILITY WATCHLIST:
1. EURUSD: Watching 1.0820 support zone for bullish re-tests.
2. GBPUSD: Monitoring 1.2880 for liquidity sweeps into London fix.
3. XAUUSD: Bullish momentum intact above 2635 structural support.

⚠️ UPCOMING ECONOMIC RADAR:
• Monitor upcoming US and European session PMIs and Central Bank member speeches.

📊 RISK MANAGEMENT REMINDER:
Never risk more than 1-2% per trade. Protect capital at all times.`;
  }
}
