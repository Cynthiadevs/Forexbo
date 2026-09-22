MASTER BUILD PROMPT

AI Forex Intelligence, Signal Generation & Telegram Automation Platform

You are a senior software architect, quantitative developer, AI engineer, UI/UX designer, DevOps engineer, cybersecurity engineer, and full-stack developer.

Your task is to design and build a complete production-ready AI Forex Intelligence & Telegram Automation Platform from scratch.

This is NOT a simple Telegram bot and NOT a static dashboard.

The platform must combine:

- Live Forex market data
- Technical analysis
- Quantitative signal scoring
- Multi-timeframe analysis
- Market/news filtering
- AI-assisted market interpretation
- OpenAI API integration
- Automatic Forex signal generation
- Automatic signal image generation
- AI-generated captions
- Telegram channel/group automation
- Signal outcome tracking
- Backtesting
- Performance analytics
- Admin dashboard
- User management
- Subscription architecture
- Secure API/key management
- Scheduled background jobs
- Complete logging and monitoring

The final product should feel like a professional commercial SaaS product.

---

1. PRODUCT OBJECTIVE

Build a platform that continuously monitors financial markets and can identify predefined technical trading setups.

When a valid setup is detected, the system should:

1. Collect current market data.
2. Calculate technical indicators.
3. Analyze multiple timeframes.
4. Detect trend and market structure.
5. Apply strategy rules.
6. Apply risk filters.
7. Check economic/news events.
8. Calculate a signal score.
9. Decide between:
   - BUY
   - SELL
   - WAIT / NO TRADE
10. Generate entry, stop-loss and take-profit levels.
11. Store the signal in the database.
12. Send structured information to the AI layer.
13. Generate a professional market explanation.
14. Generate a Telegram caption.
15. Generate a branded signal image.
16. Publish the signal automatically to configured Telegram channels/groups.
17. Continue monitoring the trade.
18. Detect TP/SL outcomes.
19. Update the signal result.
20. Publish result updates when configured.
21. Include the result in performance analytics.

The system must never fabricate market data.

If market data is unavailable or stale, the system must clearly indicate that and avoid generating a live signal.

---

2. IMPORTANT AI DESIGN PRINCIPLE

Do NOT build the system as:

MARKET DATA → ChatGPT → BUY/SELL

Instead build:

MARKET DATA
↓
DATA VALIDATION
↓
TECHNICAL INDICATORS
↓
MARKET STRUCTURE
↓
MULTI-TIMEFRAME ANALYSIS
↓
STRATEGY ENGINE
↓
RISK FILTERS
↓
NEWS/EVENT FILTER
↓
QUANTITATIVE SIGNAL SCORE
↓
VALIDATION
↓
OPENAI AI ANALYSIS
↓
CONTENT GENERATION
↓
TELEGRAM AUTOMATION

OpenAI should assist with:

- Market explanation
- Structured interpretation
- Signal reasoning
- Natural-language analysis
- Telegram captions
- Daily market reports
- Educational content
- News explanations
- Content personalization

The deterministic/quantitative system must remain responsible for validating whether a signal qualifies.

Never ask the LLM to invent prices, entries, stop losses or market conditions.

All numerical market values must originate from the market-data/analysis engine.

---

3. TECHNOLOGY STACK

Use a modern production architecture.

Frontend

Use:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide icons
- Recharts or another high-quality charting library
- Responsive design
- Dark mode
- Light mode

The dashboard must work beautifully on:

- Desktop
- Tablet
- Mobile

Backend

Prefer:

- Node.js
- TypeScript
- NestJS

Use REST APIs and WebSocket functionality where appropriate.

Database

Use:

- PostgreSQL

Use Prisma ORM.

Design the database carefully for future scale.

Cache / Queue

Use:

- Redis
- BullMQ

Background workers must handle:

- Market polling
- Signal generation
- Signal monitoring
- Telegram posting
- Image generation
- Scheduled reports
- News checks
- Retry jobs
- Performance calculations

Do not make the entire application dependent on request/response HTTP cycles.

---

4. PROJECT ARCHITECTURE

Use a monorepo architecture.

Recommended structure:

forex-ai-platform/
│
├── apps/
│   ├── web/
│   │   └── Next.js dashboard
│   │
│   ├── api/
│   │   └── NestJS API
│   │
│   ├── worker/
│   │   └── Background workers
│   │
│   └── telegram/
│       └── Telegram bot/automation
│
├── packages/
│   ├── database/
│   ├── market-engine/
│   ├── strategy-engine/
│   ├── ai/
│   ├── image-renderer/
│   ├── telegram/
│   ├── shared/
│   └── config/
│
├── docker/
├── scripts/
├── docs/
├── tests/
│
├── docker-compose.yml
├── package.json
├── turbo.json
└── README.md

Use clean separation of responsibilities.

---

5. SUPPORTED MARKETS

Initially support:

Forex

- EURUSD
- GBPUSD
- USDJPY
- USDCHF
- AUDUSD
- NZDUSD
- USDCAD
- EURGBP
- EURJPY
- GBPJPY
- GBPCHF
- AUDJPY

Metals

- XAUUSD
- XAGUSD

Design the system so additional instruments can be added from the admin panel.

Do not hard-code the supported assets throughout the codebase.

---

6. MARKET DATA ABSTRACTION

Create a market-data provider interface.

Example:

MarketDataProvider

The application should be able to support different providers without rewriting the signal engine.

Example providers:

Provider A
Provider B
Provider C
Demo Provider

Configuration should allow:

Provider:
API Key:
API URL:
Polling interval:
Enabled:

Never expose API keys to frontend clients.

---

7. MARKET DATA VALIDATION

Before analysis, validate:

- Timestamp
- Bid
- Ask
- Spread
- OHLC
- Volume if available
- Data freshness
- Missing candles
- Duplicate candles
- Invalid prices

If data is stale:

DATA_STATUS = STALE

Do not generate a live signal.

---

8. TIMEFRAMES

Support:

- 1 minute
- 5 minute
- 15 minute
- 30 minute
- 1 hour
- 4 hour
- 1 day

Allow the admin to enable/disable timeframes.

---

9. TECHNICAL ANALYSIS ENGINE

Implement indicators such as:

- EMA
- SMA
- RSI
- MACD
- ATR
- ADX
- Bollinger Bands
- Stochastic
- VWAP where applicable
- Pivot levels

Also implement:

- Support detection
- Resistance detection
- Swing highs
- Swing lows
- Higher High
- Higher Low
- Lower High
- Lower Low
- Break of Structure
- Change of Character
- Trend detection
- Volatility detection

The engine must expose structured results.

Example:

{
  "symbol": "XAUUSD",
  "timeframe": "15m",
  "trend": "BULLISH",
  "rsi": 61.4,
  "macd": "BULLISH",
  "emaAlignment": true,
  "volatility": "MODERATE",
  "support": 2648.5,
  "resistance": 2662.2
}

---

10. MULTI-TIMEFRAME ENGINE

Create a configurable multi-timeframe system.

Example:

4H  → Major trend
1H  → Market structure
15M → Setup
5M  → Entry confirmation

The system should compare timeframes.

Example:

4H = BULLISH
1H = BULLISH
15M = BULLISH
5M = BULLISH

This produces stronger alignment.

If timeframes conflict, reduce the signal score or return:

WAIT

Make the weighting configurable.

---

11. SIGNAL ENGINE

Create a dedicated strategy engine.

Signal states:

BUY
SELL
WAIT
EXPIRED
CANCELLED
TP1
TP2
TP3
SL
BREAKEVEN

Create a scoring model.

Example:

Trend              20
Market Structure   20
Momentum            15
Support/Resistance 15
EMA Alignment       10
RSI/MACD            10
Volatility            5
News Filter           5

Total:

100

Signal classification:

0–39   NO TRADE
40–59  WEAK
60–69  MODERATE
70–79  STRONG
80–100 VERY STRONG

Make all weights configurable.

Do not describe the score as a guaranteed probability of success.

Display:

Signal Strength: 82/100

rather than:

82% guaranteed win

---

12. ENTRY / STOP LOSS / TAKE PROFIT

The system should calculate:

- Entry
- Stop Loss
- TP1
- TP2
- TP3
- Risk/Reward

Use configurable methodologies such as:

- ATR-based SL
- Support/resistance SL
- Structure-based SL
- Fixed R:R
- Dynamic TP

Example:

Entry: 2650
SL: 2640

TP1: 2660
TP2: 2670
TP3: 2680

All calculations must be deterministic and traceable.

Store the exact calculation method used.

---

13. RISK ENGINE

Create a dedicated risk engine.

Features:

- Minimum R:R
- Maximum spread
- Maximum volatility
- Maximum signals per asset
- Maximum signals per day
- Cooldown between signals
- News blackout
- Duplicate setup prevention
- Session filters
- Optional trading hours

Example:

Minimum R:R = 1:2
Maximum spread = configurable
News blackout = configurable

If risk conditions fail:

WAIT

---

14. NEWS / ECONOMIC CALENDAR

Create an economic-event abstraction.

Events should contain:

currency
event
impact
scheduled_time
actual
forecast
previous

Support:

LOW
MEDIUM
HIGH

Allow administrators to configure:

Pause signals:
15 minutes before HIGH impact

Resume:
30 minutes after

Do not generate fake economic events.

---

15. OPENAI INTEGRATION

Create a dedicated AI service.

Never expose the OpenAI API key to the browser.

Use environment variables.

Example:

OPENAI_API_KEY=
OPENAI_MODEL=

Create separate prompts for:

Signal explanation

Market analysis

Telegram caption

Daily market outlook

Weekly report

Educational content

News explanation

All AI outputs must be based on structured verified data.

---

16. AI STRUCTURED OUTPUT

Require the AI service to return structured JSON where appropriate.

Example:

{
  "summary": "...",
  "marketBias": "BULLISH",
  "keyFactors": [
    "...",
    "...",
    "..."
  ],
  "riskFactors": [
    "..."
  ],
  "caption": "...",
  "disclaimer": "..."
}

Validate AI output using a schema.

If invalid:

1. Retry
2. If still invalid, use a deterministic fallback template.

Never allow malformed AI output to break Telegram publishing.

---

17. TELEGRAM BOT

Implement Telegram Bot API integration.

Features:

/start
/help
/signals
/market
/pairs
/signal EURUSD
/analyze EURUSD
/performance
/status

Use secure webhook handling.

Support:

- Channels
- Groups
- Private groups
- Multiple destinations

---

18. TELEGRAM DESTINATION MANAGEMENT

Admin dashboard must allow:

Add destination
Remove destination
Enable/disable destination
Test destination
Configure content

Each destination should have:

name
chat_id
type
enabled
signals_enabled
analysis_enabled
news_enabled
daily_report_enabled
result_updates_enabled

---

19. AUTOMATIC TELEGRAM POSTING

When a valid signal is generated:

Signal Engine
↓
Database
↓
AI Explanation
↓
Caption
↓
Image
↓
Telegram Queue
↓
Destination

Use BullMQ for posting.

Implement:

- Retry
- Exponential backoff
- Failure tracking
- Duplicate prevention

Do not publish the same signal twice accidentally.

---

20. SIGNAL IMAGE GENERATOR

Create a professional programmatic signal-image generator.

Use:

- SVG
- Sharp

Create templates for:

BUY

Green/positive visual treatment.

SELL

Red/negative visual treatment.

WAIT

Neutral treatment.

Image should contain:

BRAND LOGO

XAUUSD
GOLD

BUY

ENTRY
SL
TP1
TP2
TP3

TIMEFRAME

SIGNAL STRENGTH

MARKET BIAS

DATE/TIME

Risk disclaimer

Make image dimensions configurable.

Default social format:

1080 × 1080

Also support:

1080 × 1350
1200 × 675

The image should look like a premium financial-media graphic, not a basic HTML screenshot.

---

21. BRANDING ENGINE

Create configurable branding.

Admin can upload:

- Logo
- Favicon
- Background
- Brand colors

Configure:

Primary color
Secondary color
Accent color
Font
Footer
Telegram username
Website
Disclaimer

The signal image renderer should automatically use these settings.

---

22. SIGNAL LIFECYCLE

Every signal must have a lifecycle.

Example:

GENERATED
↓
PUBLISHED
↓
ACTIVE
↓
TP1 HIT
↓
TP2 HIT
↓
TP3 HIT

Or:

GENERATED
↓
PUBLISHED
↓
ACTIVE
↓
SL HIT

Also support:

EXPIRED
CANCELLED
BREAKEVEN

Store every event.

---

23. SIGNAL MONITOR

A worker must continuously monitor active signals.

Example:

Signal:
XAUUSD BUY

Entry:
2650

SL:
2640

TP1:
2660

TP2:
2670

When price reaches TP1:

TP1 HIT

Automatically update database.

If configured:

POST TP1 UPDATE

When SL is hit:

SL HIT

Publish the result.

---

24. PERFORMANCE SYSTEM

Track:

- Total signals
- BUY signals
- SELL signals
- TP1
- TP2
- TP3
- SL
- Cancelled
- Expired
- Average R:R
- Average signal score
- Results by pair
- Results by timeframe
- Results by strategy
- Results by session

Do not hide losing signals.

Historical results must be transparent.

---

25. BACKTESTING ENGINE

Create a backtesting module.

Inputs:

Strategy
Pair
Timeframe
Start date
End date
Initial balance
Risk per trade

Output:

Total trades
Wins
Losses
Win rate
Average R:R
Profit factor
Maximum drawdown
Net result
Average trade
Largest win
Largest loss

Allow users to inspect individual historical trades.

Avoid look-ahead bias and document assumptions.

---

26. ADMIN DASHBOARD

Build a premium dashboard.

Main navigation:

Dashboard
Market
Signals
Active Trades
Performance
Backtesting
Strategies
Telegram
AI
News
Content
Users
Subscriptions
Branding
System
Logs
Settings

---

27. DASHBOARD HOME

Display:

Market Status
Active Signals
Signals Today
TP Hits
SL Hits
Signal Strength Average
Telegram Posts
AI Requests
System Health

Charts:

Signal activity
Results
Pair performance
Session performance

Use attractive cards and charts.

---

28. MARKET PAGE

Display live market information.

Example:

EURUSD
1.17...
BULLISH

GBPUSD
...
WAIT

XAUUSD
...
BULLISH

Allow filtering by:

- Asset
- Timeframe
- Signal
- Strength

---

29. SIGNALS PAGE

Table columns:

ID
Asset
Direction
Entry
SL
TP1
TP2
TP3
Strength
Timeframe
Status
Created

Clicking a signal should open detailed analysis.

---

30. SIGNAL DETAIL PAGE

Show:

Signal information

Market snapshot

Technical indicators

Multi-timeframe analysis

Strategy score

Risk analysis

AI explanation

Telegram publication history

Signal lifecycle

Final result

---

31. TELEGRAM MANAGEMENT PAGE

Show:

Connected destinations

Channel/group name
Chat ID
Type
Status

Signals
Analysis
News
Daily reports
Result updates

Buttons:

Test
Edit
Disable
Delete

---

32. AI MANAGEMENT PAGE

Show:

AI provider
Model
API status
Usage
Requests
Errors
Average latency

Prompt management:

Signal Prompt
Caption Prompt
Daily Report Prompt
News Prompt
Education Prompt

Allow administrators to edit prompts.

Version prompts.

Store prompt versions.

---

33. CONTENT AUTOMATION

Add an AI content scheduler.

Content types:

Market Outlook
Forex Education
Trading Psychology
Economic News
Weekly Recap
Daily Recap
Market Summary

Configure:

Time
Destination
Frequency
Content type
Enabled

The system generates the content and posts it automatically.

---

34. USER SYSTEM

Prepare architecture for:

ADMIN
SUPER_ADMIN
ANALYST
EDITOR
USER

Use RBAC.

Administrators can control permissions.

---

35. AUTHENTICATION

Implement:

- Email/password
- Secure password hashing
- JWT/session authentication
- Refresh tokens
- Password reset
- Email verification
- Optional 2FA

Protect all admin endpoints.

---

36. SUBSCRIPTION ARCHITECTURE

Prepare for:

FREE
PRO
VIP
ENTERPRISE

Subscription restrictions should be configurable.

Examples:

Signals/day
Available pairs
Historical data
AI analysis
Telegram destinations
Backtesting
Reports

Do not hard-code subscription limits.

---

37. SYSTEM LOGGING

Create structured logs for:

Market data errors
Signal generation
AI requests
AI errors
Telegram requests
Telegram failures
Worker jobs
Authentication
Admin actions
Database errors

Create an admin log viewer.

---

38. HEALTH MONITORING

Create:

/health

Check:

API
Database
Redis
Market data
OpenAI
Telegram
Workers

Dashboard should show:

🟢 Operational
🟡 Degraded
🔴 Offline

---

39. SECURITY

Implement:

- Input validation
- Rate limiting
- CSRF protection where applicable
- CORS configuration
- Secure headers
- SQL injection prevention through ORM
- XSS protection
- Authentication middleware
- RBAC
- Secret management
- Telegram webhook verification
- API request logging
- Audit logs

Never expose:

OPENAI_API_KEY
TELEGRAM_BOT_TOKEN
DATABASE_URL
REDIS_URL

to the frontend.

---

40. ERROR HANDLING

The system must gracefully handle:

- API timeout
- Market-data outage
- OpenAI outage
- Telegram outage
- Redis outage
- Database outage
- Invalid AI response
- Missing candles
- Duplicate signals
- Worker crashes

Use retries where appropriate.

Never silently lose jobs.

---

41. UI/UX DESIGN

The interface should feel like a premium financial intelligence platform.

Style:

Modern
Professional
Premium
Minimal
Data-rich
Fast

Use:

- Dark mode by default
- Glassmorphism sparingly
- High-quality cards
- Clear typography
- Financial dashboards
- Responsive tables
- Charts
- Subtle animations

Avoid:

- childish gradients
- excessive animations
- clutter
- generic template appearance

Create a coherent design system.

---

42. PUBLIC LANDING PAGE

Build a public website with:

Hero

AI-POWERED
FOREX INTELLIGENCE

Analyze markets.
Generate signals.
Automate your Telegram.

Buttons:

Get Started
View Demo

Sections:

How it works
AI analysis
Signal engine
Telegram automation
Performance tracking
Backtesting
Pricing
FAQ
Risk disclaimer

---

43. PUBLIC SIGNAL PAGE

Create a public signal feed.

Example:

Latest Signals

XAUUSD BUY
Signal Strength 82/100

EURUSD SELL
Signal Strength 76/100

Only expose information configured as public.

---

44. API DESIGN

Create documented APIs.

Example:

POST /auth/login
GET /market
GET /market/:symbol
GET /signals
GET /signals/:id
POST /signals/generate
GET /performance
GET /telegram/destinations
POST /telegram/destinations
POST /telegram/test
GET /strategies
POST /strategies
GET /news
GET /system/health

Use OpenAPI/Swagger.

---

45. WEBHOOKS

Prepare webhook architecture for:

Telegram
Payment provider
Market data provider
External integrations

Validate all incoming webhook requests.

---

46. ENVIRONMENT CONFIGURATION

Create:

.env.example

Include placeholders such as:

DATABASE_URL=
REDIS_URL=

OPENAI_API_KEY=
OPENAI_MODEL=

TELEGRAM_BOT_TOKEN=

MARKET_DATA_API_KEY=
MARKET_DATA_API_URL=

NEWS_API_KEY=

JWT_SECRET=

Never put real secrets in Git.

---

47. DOCKER

Create:

docker-compose.yml

Services:

web
api
worker
telegram
postgres
redis

Make local development possible with:

docker compose up

---

48. TESTING

Create automated tests.

Unit tests:

Indicators
Signal scoring
Risk calculations
Entry/SL/TP
News filters
Signal lifecycle

Integration tests:

Database
OpenAI service
Telegram service
Market-data provider
Queue

End-to-end tests:

Market data
→ signal
→ AI
→ image
→ Telegram
→ tracking

Create mock providers so the application can be tested without spending API credits.

---

49. DEMO / SIMULATION MODE

This is mandatory.

Create:

DEMO_MODE=true

When enabled:

- Use simulated market data
- Generate deterministic signals
- Use mock Telegram provider
- Use mock AI responses if desired
- Run the entire system locally

This allows development without real API costs.

---

50. DATABASE REQUIREMENTS

Create Prisma schema containing at minimum:

User
Role
Permission
TelegramDestination
ForexPair
MarketCandle
IndicatorSnapshot
MarketAnalysis
Strategy
StrategyRule
Signal
SignalEvent
SignalResult
AIRequest
AIResponse
GeneratedImage
TelegramPost
NewsEvent
Backtest
BacktestTrade
Subscription
Plan
SystemSetting
AuditLog

Use proper:

- indexes
- foreign keys
- timestamps
- unique constraints

Optimize queries for historical signal analysis.

---

51. CRON / SCHEDULING

Use BullMQ repeatable jobs or an appropriate scheduler.

Jobs:

market-update
indicator-update
signal-scan
signal-monitor
news-check
telegram-publish
daily-report
weekly-report
performance-update
cleanup

All jobs must be observable.

---

52. DUPLICATE SIGNAL PREVENTION

Before creating a signal:

Check:

same asset
same direction
same timeframe
same setup
recent timestamp

If an equivalent signal already exists, do not publish a duplicate.

---

53. SIGNAL EXPIRATION

Signals must expire.

Example:

15M signal → configurable expiration
1H signal → configurable expiration
4H signal → configurable expiration

If the entry is never reached within the configured period:

EXPIRED

---

54. TELEGRAM CAPTION TEMPLATE

Generate captions similar to:

🟢 XAUUSD BUY SIGNAL

📌 Entry: XXXX
🛑 Stop Loss: XXXX

🎯 TP1: XXXX
🎯 TP2: XXXX
🎯 TP3: XXXX

⏱ Timeframe: 15M

📊 Signal Strength: 82/100

Market bias:
Bullish

Why:
[AI-generated explanation based only on verified analysis]

⚠️ Risk management is essential.
Market conditions can change rapidly.

Do not use misleading guarantees.

---

55. DAILY REPORT

Automatically generate:

DAILY FOREX MARKET REPORT

Major pairs

Gold

Major indices

Important economic events

Market sentiment

Potential areas to watch

Previous signal performance

Generate both:

Text
+
Image

and optionally publish them to Telegram.

---

56. PERFORMANCE REPORT

Generate weekly:

Weekly AI Signal Report

Signals generated:
XXX

TP results:
XXX

SL results:
XXX

Cancelled:
XXX

Average signal strength:
XX/100

Most active pair:
...

Best-performing setup:
...

Worst-performing setup:
...

Use factual historical statistics.

---

57. FINANCIAL RISK DISCLAIMER

Display clearly throughout the product:

This platform provides automated market analysis and educational information.
It does not guarantee trading outcomes or profits and does not constitute
personalized financial advice. Forex and other financial markets involve
substantial risk. Users are responsible for their own trading decisions.

Do not market signals as guaranteed profits.

---

58. DOCUMENTATION

Create:

README.md
ARCHITECTURE.md
API.md
DATABASE.md
DEPLOYMENT.md
TELEGRAM_SETUP.md
OPENAI_SETUP.md
MARKET_DATA.md
BACKTESTING.md
SECURITY.md
CONTRIBUTING.md

Include exact setup instructions.

---

59. DEPLOYMENT

Provide production deployment documentation.

Architecture:

Cloud/VPS
│
├── Reverse Proxy
├── Next.js
├── NestJS
├── Workers
├── Telegram service
├── PostgreSQL
└── Redis

Use HTTPS.

Use environment variables.

Configure backups.

Configure process monitoring.

---

60. OBSERVABILITY

Include:

Structured logging
Error tracking
Job monitoring
API metrics
AI usage metrics
Telegram metrics
Database health

Dashboard should show:

System uptime
Worker status
Queue size
Failed jobs
AI requests
Telegram failures

---

61. PERFORMANCE

Optimize for:

- Low API latency
- Efficient database queries
- Cached market data
- Background processing
- Batched calculations
- Queue-based workloads
- Rate limits
- API cost control

Do not call OpenAI unnecessarily.

Only use AI when AI adds value.

---

62. AI COST CONTROL

Implement:

Prompt caching where appropriate
Request deduplication
Configurable AI model
Token usage tracking
Daily AI budget
Per-user AI limits
Fallback templates

If AI budget is exceeded:

Continue using deterministic templates

instead of breaking the entire application.

---

63. DEVELOPMENT PHASES

Build in this order.

Phase 1

Create the monorepo and infrastructure.

Phase 2

Create PostgreSQL + Prisma.

Phase 3

Create market-data abstraction.

Phase 4

Create indicators.

Phase 5

Create strategy/signal engine.

Phase 6

Create risk engine.

Phase 7

Create OpenAI service.

Phase 8

Create image renderer.

Phase 9

Create Telegram integration.

Phase 10

Create signal monitoring.

Phase 11

Create performance analytics.

Phase 12

Create backtesting.

Phase 13

Create admin dashboard.

Phase 14

Create public website.

Phase 15

Create authentication/RBAC.

Phase 16

Create subscriptions.

Phase 17

Create production deployment.

---

64. DEVELOPMENT RULE

Do NOT generate a fake frontend with placeholder buttons and pretend the project is complete.

Every important button should connect to a real backend function.

Do not use fake market data in production mode.

Do not fabricate successful API responses.

Do not hard-code signal results.

Do not hard-code Telegram posts.

Do not hard-code dashboard statistics.

Everything should originate from the database, APIs, workers, or explicitly enabled demo mode.

---

65. CODE QUALITY

Use:

- TypeScript strict mode
- ESLint
- Prettier
- Zod/class-validator
- Prisma
- Clean architecture
- SOLID principles
- Reusable services
- Reusable UI components
- Strong typing
- Error boundaries
- Proper logging

Avoid:

- duplicated code
- giant components
- giant controllers
- hard-coded configuration
- secrets in source code
- unnecessary dependencies

---

66. FINAL DELIVERABLE

The finished project must include:

✓ Complete frontend
✓ Complete backend
✓ PostgreSQL schema
✓ Prisma migrations
✓ Redis
✓ Background workers
✓ Telegram bot
✓ Telegram automation
✓ Market-data abstraction
✓ Technical indicators
✓ Signal engine
✓ Risk engine
✓ Multi-timeframe analysis
✓ OpenAI integration
✓ AI explanations
✓ AI captions
✓ Signal image generator
✓ Signal lifecycle tracking
✓ TP/SL monitoring
✓ Performance dashboard
✓ Backtesting
✓ News filtering
✓ Authentication
✓ RBAC
✓ Subscription architecture
✓ Admin dashboard
✓ Public landing page
✓ API documentation
✓ Docker setup
✓ Demo mode
✓ Automated tests
✓ Security
✓ Logging
✓ Health monitoring
✓ Deployment documentation

---

67. HOW YOU SHOULD WORK

Do not attempt to dump the entire codebase into one response.

Work incrementally.

First:

1. Analyze the requirements.
2. Produce the final architecture.
3. Produce the folder structure.
4. Produce the database schema.
5. Identify dependencies.
6. Identify required external APIs.
7. Create the project.
8. Implement Phase 1.
9. Test Phase 1.
10. Continue to Phase 2.
11. Test every phase before continuing.

Whenever you encounter an implementation decision, choose the production-safe and scalable solution.

If an external API is required, create an abstraction around it rather than tightly coupling the application to that provider.

If an API key is unavailable, implement a provider interface and demo/mock provider so development can continue.

Never silently substitute fake data for live production data.

---

68. DEFINITION OF DONE

The project is only considered complete when I can:

1. Start the application locally.
2. Log into the admin dashboard.
3. Configure a market-data provider.
4. Configure OpenAI.
5. Configure a Telegram bot.
6. Add a Telegram channel/group.
7. Select Forex pairs.
8. Enable strategies.
9. Start the market engine.
10. Receive market data.
11. Calculate indicators.
12. Generate a valid signal.
13. Generate AI analysis.
14. Generate a branded image.
15. Generate a caption.
16. Automatically publish to Telegram.
17. Monitor the signal.
18. Detect TP/SL.
19. Publish the result.
20. View the result in the dashboard.
21. Run historical backtests.
22. View performance statistics.
23. Configure automated reports.
24. Run the system in demo mode.
25. Deploy the system to a production server.

Build the system with these requirements as the source of truth.

Start by creating the architecture and implementation plan, then begin building the actual application.
