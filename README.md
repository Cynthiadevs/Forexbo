# Alpha Quant FX: AI Forex Intelligence, Signal Generation & Telegram Automation Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.1-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

An enterprise-grade, institutional trading intelligence platform combining live multi-timeframe Forex & Metals market ingestion, quantitative technical analysis, Smart Money market structure detection (BOS, CHoCH, OrderBlocks), OpenAI market reasoning, high-definition branded social graphics generation, and multi-channel Telegram distribution with live TP/SL outcome tracking.

---

## 🌟 Key Features

1. **Deterministic Quantitative Foundation**
   - No blind LLM hallucinations. All prices, stops, and targets are computed deterministically.
   - Comprehensive technical indicators: EMA (20/50/200), SMA, RSI, MACD, ATR, ADX (+DI/-DI), Bollinger Bands, Stochastic, Classic Floor Pivots.
   - Institutional Smart Money Structure: Break of Structure (BOS), Change of Character (CHoCH), Horizontal S/R clustering, Higher High / Higher Low tracking.

2. **0–100 Multi-Factor Confluence Scoring**
   - Weighted 8-component model: Trend (20), Structure (20), Momentum (15), S/R (15), EMA Alignment (10), RSI/MACD (10), Volatility (5), News Filter (5).
   - Strict qualification: Only setups scoring **70+/100** qualify for live trade execution.

3. **OpenAI Intelligence Layer**
   - Generates institutional trade explanations, reasoning, and Telegram captions conforming to strict Zod JSON schemas.
   - Built-in token budget management and instant deterministic fallback templates.

4. **Programmatic Branded Graphic Generation**
   - Generates high-resolution vector SVG/PNG graphics with custom brand colors, neon accents, level badges, and risk disclaimers.

5. **Multi-Destination Telegram Automation**
   - Automated signal distribution to Telegram Channels, Groups, Supergroups, and Private rooms.
   - Interactive Telegram Bot supporting `/signals`, `/market`, `/pairs`, `/signal <pair>`, `/analyze <pair>`, `/performance`, and `/status`.

6. **Continuous Signal Lifecycle & TP/SL Trailing Monitor**
   - Real-time tick evaluation tracking `TP1`, `TP2`, `TP3`, and `SL`.
   - Automatic breakeven trailing stop adjustments upon reaching TP1.
   - Dispatches live outcome results to Telegram.

7. **Historical Backtesting Lab**
   - Zero look-ahead bias historical simulation engine across all timeframes.
   - Detailed performance reporting: Win Rate %, Profit Factor, Max Drawdown %, Net Profit $, and individual simulated trade logs.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js >= 18.0.0 (Node 20+ recommended)
- npm or pnpm
- Docker & Docker Compose (optional for containerized deployment)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/alphaquantfx/forex-ai-platform.git
cd forex-ai-platform

# Install monorepo dependencies
npm install

# Copy environment configuration
cp .env.example .env
```

### 3. Run the Verification Test Suite
```bash
npm run test:e2e
```

### 4. Start Development Services
```bash
# Start Core REST & WebSocket API (Port 4000)
npm run start:api

# In a separate terminal, start Background Workers (Market Scanner & Lifecycle Monitor)
npm run start:worker

# In a separate terminal, start Web Dashboard (Port 3000)
npm run start:web
```

---

## 📊 Monorepo Architecture

```
forex-ai-platform/
├── apps/
│   ├── web/                # Next.js 14 Dashboard & Public Landing Page
│   ├── api/                # Core REST API, WebSocket Gateway & Swagger Docs
│   ├── worker/             # BullMQ Background Scanner & Lifecycle Monitor
│   └── telegram/           # Interactive Telegram Bot Service
├── packages/
│   ├── database/           # Prisma PostgreSQL Schema, Migrations & Seeds
│   ├── shared/             # Domain Types, Enums, DTOs & Zod Schemas
│   ├── config/             # Central Environment Settings & Default Configs
│   ├── market-engine/      # Live & Demo Market Data Providers & Validators
│   ├── strategy-engine/    # Indicators, Market Structure, MTF, Scoring & Backtesting
│   ├── ai/                 # OpenAI Structured Intelligence & Fallback Templates
│   ├── image-renderer/     # Branded High-Res SVG Graphic Generator
│   └── telegram/           # Telegram Bot Client & Multi-Channel Publisher
├── docker/                 # Production Dockerfiles
├── tests/                  # End-to-End Simulation Test Suite
├── docker-compose.yml      # Orchestration definition
└── README.md
```

---

## 📖 API Documentation

Interactive Swagger OpenAPI documentation is accessible at:
```
http://localhost:4000/docs
```

---

## ⚠️ Financial Risk Disclaimer

This platform provides automated market analysis, quantitative trade setups, and educational information. It does not constitute personalized financial or investment advice. Trading Forex and financial markets carries significant risk of capital loss. Users are solely responsible for their own trading decisions.
