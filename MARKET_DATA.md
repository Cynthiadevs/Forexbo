# Market Data Providers & Validation

## Supported Providers
1. **DEMO (Built-in Simulator)**: Realistic geometric Brownian walk with session-based cyclical volatility and multi-timeframe candle completion.
2. **POLYGON.IO**: High-throughput institutional Forex & Metals feeds (`https://api.polygon.io/v2`).
3. **ALPHAVANTAGE**: Daily and intraday currency feeds.
4. **TWELVEDATA**: WebSocket & REST streaming feeds.

## Configuration in `.env`
```env
MARKET_DATA_PROVIDER=DEMO # or POLYGON, ALPHAVANTAGE
MARKET_DATA_API_KEY=your_api_key_here
MARKET_DATA_API_URL=https://api.polygon.io/v2
MARKET_POLLING_INTERVAL_MS=5000
```

## Validation Layer
Before any technical analysis or signal generation, the incoming data passes through `MarketDataValidator`:
- **Freshness Check**: Data older than 30s is flagged `DATA_STATUS = STALE`, aborting signal generation.
- **Spread Integrity**: Enforces `Ask > Bid` and verifies spread against maximum thresholds.
- **OHLC Consistency**: Checks `High >= Low`, `High >= Open/Close`, `Low <= Open/Close`.
- **Sequential Timestamps**: Detects missing or duplicate candles.
