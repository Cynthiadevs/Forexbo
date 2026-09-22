# Telegram Bot & Channel Automation Setup

## 1. Create Your Telegram Bot
1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Send `/newbot` and follow instructions to choose a Bot Name and Username.
3. Copy the generated **HTTP API Bot Token**.
4. Add the token to `.env`:
   ```env
   TELEGRAM_BOT_TOKEN="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
   ```

## 2. Setup Channel / Group Automation
1. Create a Public or Private Telegram Channel / Group.
2. Add your bot as an **Administrator** with permission to:
   - Post Messages
   - Edit Messages
   - Delete Messages
3. Find your Channel Chat ID (e.g. `@YourForexVIPChannel` or numerical `-1001234567890`).
4. Set the default channel in `.env`:
   ```env
   TELEGRAM_DEFAULT_CHANNEL_ID="@YourForexVIPChannel"
   ```

## 3. Bot Interactive Commands

Users and subscribers can interact with the bot using:
- `/start` - Welcome message & quick links
- `/signals` - List latest active signals
- `/market` - Live quotes & spread monitor
- `/pairs` - List monitored assets
- `/signal <symbol>` - Detailed signal setup (e.g. `/signal XAUUSD`)
- `/analyze <symbol>` - Real-time MTF technical breakdown
- `/performance` - Transparent 30-day win rate & statistics
- `/status` - Engine status & market feed health
- `/help` - User manual & risk disclaimer
