# OpenAI API Integration & Cost Control

Alpha Quant FX uses OpenAI models (such as `gpt-4o-mini` or `gpt-4o`) exclusively for natural language reasoning, structured market synthesis, and high-impact Telegram captions based on verified quantitative data.

## 1. Configuration
Set your API key in `.env`:
```env
OPENAI_API_KEY="sk-proj-..."
OPENAI_MODEL="gpt-4o-mini"
OPENAI_MAX_DAILY_BUDGET_USD=10.00
AI_FALLBACK_TO_TEMPLATES=true
```

## 2. Guardrails & Fallback Strategy
1. **Schema Validation**: All AI responses are validated against `AIStructuredExplanationSchema` using Zod.
2. **Deterministic Fallbacks**: If the OpenAI API is unreachable, times out, or daily budget cap is reached, the system automatically falls back to deterministic institutional templates without breaking signal generation or Telegram publishing.
3. **No Numerical Hallucinations**: Prompt contracts enforce that all prices, stop loss, and take profit targets originate exclusively from the quantitative market engine.
