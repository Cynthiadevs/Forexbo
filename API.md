# REST & WebSocket API Specification

## Base URL
- Development: `http://localhost:4000`
- Production: `https://api.yourdomain.com`

---

## Authentication Endpoints

### `POST /auth/login`
Authenticates a user with email and password, returning JWT access and refresh tokens.
- **Request Body:**
  ```json
  {
    "email": "admin@alphaquantfx.io",
    "password": "AdminSecurePassword123!"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "...", "email": "...", "role": "SUPER_ADMIN" },
      "accessToken": "eyJhbGciOi...",
      "refreshToken": "eyJhbGciOi..."
    }
  }
  ```

### `GET /auth/me`
Returns current authenticated user profile. (Requires `Authorization: Bearer <token>`).

---

## Market Endpoints

### `GET /market`
Returns all supported 14 Forex pairs and Metals with latest bid, ask, spread, and freshness status.

### `GET /market/:symbol`
Returns tick and candle dataset for the specified instrument.
- Query params: `timeframe` (`1m`, `5m`, `15m`, `30m`, `1h`, `4h`, `1d`), `count` (integer).

### `GET /market/:symbol/analysis`
Returns real-time technical indicators, structure trend, nearest support/resistance, and multi-timeframe confluence score.

---

## Signal Endpoints

### `GET /signals`
Query historical and active trading signals.
- Query params: `symbol`, `direction` (`BUY`, `SELL`), `status` (`ACTIVE`, `TP1_HIT`, `TP2_HIT`, `TP3_HIT`, `SL_HIT`), `timeframe`.

### `GET /signals/:id`
Returns full signal payload including AI structured reasoning, image path, and lifecycle history.

### `POST /signals/generate`
Triggers real-time quantitative evaluation and generates an end-to-end signal for a pair.
- **Request Body:**
  ```json
  {
    "symbol": "XAUUSD",
    "timeframe": "15m"
  }
  ```

---

## Backtesting Endpoints

### `POST /backtest/run`
Executes historical backtesting simulation.
- **Request Body:**
  ```json
  {
    "symbol": "XAUUSD",
    "timeframe": "15m",
    "initialBalance": 10000,
    "riskPercentagePerTrade": 1.0,
    "minScoreToQualify": 70
  }
  ```

---

## System Endpoints

### `GET /system/health`
Returns operational health status for API, Database, Redis, MarketData feed, OpenAI, Telegram, and Workers.

---

## WebSocket Events

- `market:tick` - Emitted whenever a new tick arrives for any asset.
- `market:tick:<SYMBOL>` - Emitted for a specific symbol.
