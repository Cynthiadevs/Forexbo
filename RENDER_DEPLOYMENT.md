# 🚀 Deploying Forex AI & Telegram Engine to Render.com

This guide walks you through deploying your **Forex AI Intelligence, Signal Scanner & Telegram Automation Platform** live to **Render.com** (100% Free Tier compatible).

---

## 🏗️ Architecture on Render

Our unified Render runner ([`apps/api/src/render-entrypoint.ts`](file:///data/data/com.termux/files/home/forex/apps/api/src/render-entrypoint.ts)) runs as a single Web Service that provides:
1. **REST & SSE API** on Render's assigned `$PORT` (with health checks at `/health` and Swagger UI at `/docs`).
2. **Live Telegram Bot Poller** responding instantly to commands (`/start`, `/signals`, `/market`, `/signal EURUSD`, `/analyze XAUUSD`, `/performance`, `/status`, `/help`).
3. **Continuous MTF Market Scanner** evaluating 14 Forex pairs and Metals every 30s.
4. **Signal Lifecycle Monitor** tracking take-profits (TP1, TP2, TP3), stop-loss hits, and moving trailing stops to breakeven in real time.
5. **Scheduled Market Reports** for daily morning briefings.

---

## 📋 Step 1: Push Code to GitHub

Make sure your repository is committed and pushed to GitHub:

```bash
git add .
git commit -m "feat: complete Forex AI platform with unified Render runner"
git push origin main
```

---

## 📋 Step 2: Create Web Service on Render

1. Log into your [Render Dashboard](https://dashboard.render.com/).
2. Click **"New +"** in the top right and select **"Web Service"**.
3. Connect your GitHub repository.
4. Fill in the deployment settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `forex-ai-engine` (or your choice) |
| **Region** | Oregon (US West) or Frankfurt (EU Central) |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm run start:render` |
| **Instance Type** | `Free` |

---

## 📋 Step 3: Configure Environment Variables

Under the **"Environment Variables"** tab on Render, add the following:

| Key | Value | Description |
| :--- | :--- | :--- |
| `NODE_VERSION` | `22.12.0` | Node.js runtime version |
| `NODE_ENV` | `production` | Production environment |
| `DEMO_MODE` | `true` | Runs realistic market walk simulator (or `false` for live feeds) |
| `MARKET_DATA_PROVIDER` | `DEMO` | Or `POLYGON` |
| `TELEGRAM_BOT_TOKEN` | `123456789:ABCdefGHIjklMNO...` | **Your Bot Token from @BotFather** |
| `TELEGRAM_DEFAULT_CHANNEL_ID` | `@YourVIPChannel` | Your Telegram channel username or chat ID |
| `OPENAI_API_KEY` | `sk-...` | *(Optional)* For custom AI explanations (deterministic templates active by default) |
| `OPENAI_MODEL` | `gpt-4o-mini` | AI Model name |
| `JWT_SECRET` | *(Random 32-char string)* | Auth secret |
| `JWT_REFRESH_SECRET` | *(Random 32-char string)* | Refresh auth secret |
| `BRAND_NAME` | `ALPHA QUANT FX` | Your brand display name |
| `BRAND_WEBSITE` | `https://your-brand-website.com` | Your website |
| `BRAND_TELEGRAM` | `@YourVIPChannel` | Telegram community handle |

---

## 📋 Step 4: Click "Create Web Service"

Render will now:
1. Clone your GitHub repository.
2. Run `npm install`.
3. Launch `npm run start:render`.
4. Monitor the `/health` endpoint until green.

---

## 🧪 Step 5: Test Live in Telegram & Browser

Once the build finishes and shows **"Live"**:

### 1. Test the Web API:
Open `https://<your-service-name>.onrender.com/docs` in your browser to view the interactive Swagger OpenAPI documentation.

Check health status:
```bash
curl https://<your-service-name>.onrender.com/health
```

### 2. Test the Live Telegram Bot:
Open your bot in Telegram and send:
- `/start` — Welcome message and command list
- `/signals` — View currently active trading setups
- `/market` — Live quotes and spreads across all 14 pairs
- `/signal EURUSD` — Real-time quantitative signal breakdown
- `/signal XAUUSD` — Gold signal breakdown
- `/analyze GBPUSD` — Multi-timeframe technical confluence breakdown
- `/performance` — Win rate & statistics
- `/status` — System health & scanner state
