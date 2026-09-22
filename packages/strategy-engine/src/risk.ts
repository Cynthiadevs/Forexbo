import type {
  RiskFilterConfig,
  RiskEvaluationResult,
  EconomicEvent,
  MarketTick,
  StrategySignalResult
} from '../../shared/src/index.ts';
import {
  VolatilityLevel,
  NewsImpact
} from '../../shared/src/index.ts';
import { DEFAULT_RISK_CONFIG } from '../../config/src/index.ts';

export class RiskEngine {
  config: RiskFilterConfig;
  recentSignals = new Map<string, { timestamp: number; direction: string }[]>();

  constructor(config: RiskFilterConfig = DEFAULT_RISK_CONFIG) {
    this.config = config;
  }

  public evaluateSignal(
    signal: StrategySignalResult,
    tick: MarketTick,
    economicEvents: EconomicEvent[] = []
  ): RiskEvaluationResult {
    const rejectionReasons: string[] = [];
    const now = Date.now();

    // 1. Spread Filter
    if (tick.spread > this.config.maxSpreadPips) {
      rejectionReasons.push(`Current spread (${tick.spread} pips) exceeds maximum allowed (${this.config.maxSpreadPips} pips)`);
    }

    // 2. Minimum Risk/Reward Filter
    if (signal.riskRewardRatio2 < this.config.minRiskReward) {
      rejectionReasons.push(`TP2 Risk:Reward ratio (${signal.riskRewardRatio2}) is below required minimum (${this.config.minRiskReward})`);
    }

    // 3. Volatility Filter
    if (signal.indicatorsSnapshot.volatility === VolatilityLevel.EXTREME) {
      rejectionReasons.push('Market volatility is EXTREME');
    }

    // 4. Cooldown and Frequency Limits
    const symbolHistory = this.recentSignals.get(signal.symbol) || [];
    const cooldownMs = this.config.cooldownMinutesPerPair * 60 * 1000;
    const recentSamePair = symbolHistory.filter(s => now - s.timestamp < cooldownMs);

    if (recentSamePair.length > 0) {
      rejectionReasons.push(`Signal cooldown active for ${signal.symbol}. Last signal was within ${this.config.cooldownMinutesPerPair} minutes`);
    }

    const oneDayMs = 24 * 60 * 60 * 1000;
    const dailyPairSignals = symbolHistory.filter(s => now - s.timestamp < oneDayMs);
    if (dailyPairSignals.length >= this.config.maxDailySignalsPerPair) {
      rejectionReasons.push(`Max daily signals limit reached for ${signal.symbol}`);
    }

    // 5. Active Forex Session
    const currentSession = this.getCurrentSession();
    const isSessionAllowed = this.config.allowTradingSessions.includes(currentSession as any);
    if (!isSessionAllowed) {
      rejectionReasons.push(`Trading session ${currentSession} is not in allowed sessions list`);
    }

    // 6. News Blackout Filter
    let newsBlackoutActive = false;
    let upcomingHighImpactNews: EconomicEvent | undefined;

    const currencyPairCurrencies = [signal.symbol.substring(0, 3), signal.symbol.substring(3, 6)];

    for (const event of economicEvents) {
      if (event.impact === NewsImpact.HIGH && currencyPairCurrencies.includes(event.currency)) {
        const eventTime = new Date(event.scheduledTime).getTime();
        const beforeWindow = eventTime - (this.config.newsBlackoutMinutesBefore * 60 * 1000);
        const afterWindow = eventTime + (this.config.newsBlackoutMinutesAfter * 60 * 1000);

        if (now >= beforeWindow && now <= afterWindow) {
          newsBlackoutActive = true;
          upcomingHighImpactNews = event;
          rejectionReasons.push(`High-impact news blackout active: ${event.currency} - ${event.event}`);
          break;
        }
      }
    }

    const passed = rejectionReasons.length === 0;

    return {
      passed,
      rejectionReasons,
      spreadPips: tick.spread,
      currentSession,
      newsBlackoutActive,
      upcomingHighImpactNews
    };
  }

  public recordSignalPublished(symbol: string, direction: string): void {
    const list = this.recentSignals.get(symbol) || [];
    list.push({ timestamp: Date.now(), direction });
    this.recentSignals.set(symbol, list);
  }

  public getCurrentSession(): 'LONDON' | 'NEW_YORK' | 'TOKYO' | 'SYDNEY' {
    const hour = new Date().getUTCHours();
    if (hour >= 8 && hour < 13) return 'LONDON';
    if (hour >= 13 && hour < 17) return 'NEW_YORK';
    if (hour >= 17 && hour < 21) return 'NEW_YORK';
    if (hour >= 21 || hour < 0) return 'SYDNEY';
    return 'TOKYO';
  }
}
