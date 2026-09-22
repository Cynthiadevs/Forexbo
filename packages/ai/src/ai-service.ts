import { AppConfig } from '../../config/src/index.ts';
import type { StrategySignalResult, AIStructuredExplanation } from '../../shared/src/index.ts';
import { AIStructuredExplanationSchema } from '../../shared/src/index.ts';
import { TemplateEngine } from './templates.ts';

export class AIService {
  private static instance: AIService;
  private dailySpendUsd = 0;
  private lastResetDate = new Date().toISOString().split('T')[0];

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private checkAndResetDailyBudget(): boolean {
    const today = new Date().toISOString().split('T')[0];
    if (today !== this.lastResetDate) {
      this.dailySpendUsd = 0;
      this.lastResetDate = today;
    }
    return this.dailySpendUsd < AppConfig.openai.maxDailyBudgetUsd;
  }

  public async explainSignal(signal: StrategySignalResult): Promise<AIStructuredExplanation> {
    return TemplateEngine.generateFallbackExplanation(signal);
  }

  public async generateDailyReport(): Promise<string> {
    return TemplateEngine.generateFallbackDailyReport();
  }

  public getDailySpendUsd(): number {
    return Number(this.dailySpendUsd.toFixed(4));
  }
}
