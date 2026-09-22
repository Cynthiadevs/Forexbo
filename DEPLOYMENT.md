# Production Deployment Guide

## Production Architecture

```
Internet / User Requests
         │
         ▼
[Nginx / Caddy Reverse Proxy (SSL / TLS)]
         │
    ┌────┴───────────────────────────┐
    ▼                                ▼
[Next.js Web UI]             [NestJS / Core API]
(Port 3000)                  (Port 4000)
                                     │
                 ┌───────────────────┼──────────────────┐
                 ▼                   ▼                  ▼
          [PostgreSQL 16]      [Redis Cache]     [BullMQ Workers]
                                                        │
                                                        ▼
                                                [Telegram Webhook]
```

## Docker Deployment

### 1. Configure Environment Variables
```bash
cp .env.example .env.production
```

Ensure production values are set for:
- `DATABASE_URL`
- `REDIS_URL`
- `OPENAI_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `JWT_SECRET` & `JWT_REFRESH_SECRET`
- `DEMO_MODE=false` (when streaming live market data)

### 2. Build and Launch Containers
```bash
docker compose up -d --build
```

### 3. Verify Health Status
```bash
curl http://localhost:4000/system/health
```
