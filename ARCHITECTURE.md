# Architecture Blueprint: Alpha Quant FX

## System Architecture

Alpha Quant FX is designed as a high-throughput, deterministic event-driven trading platform.

### Data Flow & Signal Pipeline

```
[Market Data Feed] (Live Ticks & Candles)
       │
       ▼
[Data Validator] (Freshness, Spread, OHLC Integrity)
       │
       ▼
[Technical Indicators Engine] (EMA Stack, RSI, MACD, ATR, ADX, Bollinger, Stochastic, Pivots)
       │
       ▼
[Market Structure Analyzer] (BOS, CHoCH, Swing Points, Support/Resistance Zones)
       │
       ▼
[Multi-Timeframe Engine] (4H Trend, 1H Structure, 15M Setup, 5M Trigger)
       │
       ▼
[Quantitative Scoring Engine] (0–100 Weighted Model, requires >= 70 score)
       │
       ▼
[Risk & News Filters] (Spread Cap, Cooldown, Frequency, Session, Economic Blackout)
       │
       ▼
[AI Intelligence Layer] (OpenAI Schema-Validated JSON Reasoning + Fallback Templates)
       │
       ▼
[Branded Image Renderer] (Vector SVG Graphics with Neon Badges & Levels)
       │
       ▼
[Telegram Publisher] (Dispatches to Channels, Groups & Supergroups)
       │
       ▼
[Signal Lifecycle Monitor] (Real-time Tick Polling for TP1/TP2/TP3/SL Hit & Trailing Breakeven)
       │
       ▼
[Performance & Backtesting Analytics] (Transparent Win Rate & Pips Log)
```

## Package Responsibilities

1. `@forex/shared`: Domain types, enums, DTOs, and Zod input validation schemas.
2. `@forex/config`: Central environment configuration, default risk bounds, brand styling.
3. `@forex/database`: Prisma ORM client, models, PostgreSQL migrations and seeders.
4. `@forex/market-engine`: Market data providers (Demo realistic simulation + Polygon.io / AlphaVantage / TwelveData) and validation layer.
5. `@forex/strategy-engine`: Indicator calculations, structure analysis, MTF confluence, 0-100 scoring model, ATR SL/TP calculator, risk engine, and backtesting simulation engine.
6. `@forex/ai`: OpenAI service with JSON schema validation, daily budget tracking, and deterministic fallback templates.
7. `@forex/image-renderer`: Social graphic generator rendering vector SVG images with brand themes.
8. `@forex/telegram`: Telegram Bot API client, interactive slash commands handler, and multi-channel publisher.
