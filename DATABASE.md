# Database Schema & Data Models: PostgreSQL + Prisma

Alpha Quant FX uses PostgreSQL with Prisma ORM.

## Entity Relationship Overview

- **User**: Authentication, RBAC credentials, user role (`SUPER_ADMIN`, `ADMIN`, `ANALYST`, `EDITOR`, `USER`).
- **Role & Permission**: Granular action-based RBAC permissions (`signals:create`, `destinations:manage`, `settings:edit`).
- **Plan & UserSubscription**: Tier management (`FREE`, `PRO`, `VIP`, `ENTERPRISE`), daily quota limits, allowed asset scopes.
- **ForexPair**: Currency pair and metals metadata (`pipDecimal`, `minSpread`, `category`).
- **MarketCandle**: Historical OHLCV bar data with composite indexes on `(symbol, timeframe, timestamp DESC)`.
- **IndicatorSnapshot**: Computed values of EMA, SMA, RSI, MACD, ATR, ADX, Bollinger Bands, Stochastics, and Pivots.
- **MarketAnalysis**: Higher-timeframe market structure, BOS/CHoCH flags, MTF alignment metrics.
- **Strategy & StrategyRule**: Configurable quantitative scoring weights and execution criteria.
- **Signal**: The central trade entity storing Direction, Entry, SL, TP1-3, Score, Risk/Reward, and JSON snapshots.
- **SignalEvent**: State transitions across the trade lifecycle (`GENERATED`, `PUBLISHED`, `ACTIVE`, `TP1_HIT`, `TP2_HIT`, `TP3_HIT`, `SL_HIT`, `BREAKEVEN`, `EXPIRED`, `CANCELLED`).
- **SignalResult**: Final realized outcome with exact pips, R-multiple, and duration in minutes.
- **AIRequest & AIResponse**: OpenAI token usage logs, model version, raw output, and structured JSON.
- **PromptTemplate & PromptVersion**: Version-controlled prompt management.
- **GeneratedImage**: Rendered social SVG/PNG file path, dimensions, and metadata.
- **TelegramDestination & TelegramPost**: Delivery logs, destination chat IDs, and retry attempts.
- **NewsEvent**: Economic calendar high/medium/low impact announcements and blackout window tracking.
- **Backtest & BacktestTrade**: Historical simulation runs and simulated trade executions.
- **SystemSetting**: System parameters (risk caps, brand theme, API thresholds).
- **AuditLog**: Administrative action audit trail with IP address and timestamp.

---

## Migration & Seed Commands

```bash
# Push schema directly to database
npm run db:push

# Generate Prisma Client
npm run db:generate

# Execute seed script
npm run db:seed
```
