import { AppConfig } from '../../../packages/config/src/index.ts';
import { TelegramBotHandler } from '../../../packages/telegram/src/index.ts';
import { MarketDataService } from '../../../packages/market-engine/src/index.ts';

async function bootstrapTelegramService() {
  console.log('🤖 Initializing Telegram Bot Service...');
  const handler = new TelegramBotHandler();
  const botToken = AppConfig.telegram.botToken;
  const isMock = !botToken || botToken.includes('mock') || AppConfig.isDemoMode;

  // Initialize market feed for queries
  const marketService = MarketDataService.getInstance();
  await marketService.start();

  if (isMock) {
    console.log('🤖 Telegram Bot running in SIMULATION/DEMO mode.');
    console.log('Testing sample command /start:');
    const startRes = await handler.handleMessage({ messageId: 1, chatId: 'test', userId: 123, text: '/start' });
    console.log(startRes);

    console.log('\nTesting sample command /signal EURUSD:');
    const sigRes = await handler.handleMessage({ messageId: 2, chatId: 'test', userId: 123, text: '/signal EURUSD' });
    console.log(sigRes);
    return;
  }

  // Real Polling Loop for Live Telegram Bot API
  let offset = 0;
  console.log('🚀 Telegram Bot Long-Polling started with token:', botToken.substring(0, 8) + '...');

  const poll = async () => {
    try {
      const res = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&timeout=25`);
      const data = (await res.json()) as any;
      const updates = data?.result || [];
      for (const update of updates) {
        offset = update.update_id + 1;
        const msg = update.message;
        if (msg && msg.text) {
          const responseText = await handler.handleMessage({
            messageId: msg.message_id,
            chatId: msg.chat.id,
            userId: msg.from?.id || 0,
            username: msg.from?.username,
            text: msg.text
          });

          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: msg.chat.id,
              text: responseText,
              parse_mode: 'Markdown'
            })
          });
        }
      }
    } catch (err: any) {
      console.warn('[TelegramBot] Polling warning:', err.message);
    }

    setTimeout(poll, 1000);
  };

  poll();
}

bootstrapTelegramService().catch(console.error);
