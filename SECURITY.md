# Security Architecture & Best Practices

Alpha Quant FX incorporates strict enterprise security standards:

## 1. Secret & Key Protection
- Secrets (`OPENAI_API_KEY`, `TELEGRAM_BOT_TOKEN`, `DATABASE_URL`, `JWT_SECRET`) are stored in `.env` and never bundled or exposed in client frontend code.
- Role-Based Access Control (RBAC) protects all administrative mutation routes (`SUPER_ADMIN`, `ADMIN`, `ANALYST`, `EDITOR`, `USER`).

## 2. API Security
- JWT authentication with separate refresh tokens and expiry.
- CORS restricted to authorized frontend origins in production.
- Strict input validation via Zod schemas on all API routes and webhook payloads.
- Audit logging for all administrative actions (`USER_LOGIN`, `SIGNAL_GENERATE`, `SETTING_CHANGED`).

## 3. Reporting Vulnerabilities
Please report security concerns to `security@alphaquantfx.io`.
