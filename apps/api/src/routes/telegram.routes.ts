import { Router, Request, Response } from 'express';
import { TelegramPublisher } from '@forex/telegram';
import { AppConfig } from '@forex/config';
import { DestinationType } from '@forex/shared';

export const telegramRouter = Router();
const publisher = new TelegramPublisher();

const destinations = [
  {
    id: 'dest-1',
    name: 'Primary VIP Signals Channel',
    chatId: AppConfig.telegram.defaultChannelId,
    type: DestinationType.CHANNEL,
    enabled: true,
    signalsEnabled: true,
    analysisEnabled: true,
    newsEnabled: true,
    dailyReportEnabled: true,
    resultUpdatesEnabled: true,
    createdAt: new Date()
  },
  {
    id: 'dest-2',
    name: 'Forex Community Discussion Group',
    chatId: '@AlphaQuant_Community',
    type: DestinationType.GROUP,
    enabled: true,
    signalsEnabled: false,
    analysisEnabled: true,
    newsEnabled: true,
    dailyReportEnabled: true,
    resultUpdatesEnabled: false,
    createdAt: new Date()
  }
];

telegramRouter.get('/destinations', (req: Request, res: Response) => {
  return res.json({ success: true, data: destinations });
});

telegramRouter.post('/destinations', (req: Request, res: Response) => {
  const { name, chatId, type, signalsEnabled, analysisEnabled, newsEnabled, dailyReportEnabled, resultUpdatesEnabled } = req.body;
  const newDest = {
    id: `dest-${Date.now()}`,
    name: name || 'New Channel',
    chatId: chatId || '@CustomChannel',
    type: type || DestinationType.CHANNEL,
    enabled: true,
    signalsEnabled: signalsEnabled ?? true,
    analysisEnabled: analysisEnabled ?? true,
    newsEnabled: newsEnabled ?? true,
    dailyReportEnabled: dailyReportEnabled ?? true,
    resultUpdatesEnabled: resultUpdatesEnabled ?? true,
    createdAt: new Date()
  };
  destinations.push(newDest);
  return res.status(201).json({ success: true, data: newDest });
});

telegramRouter.post('/test', async (req: Request, res: Response) => {
  const { chatId = AppConfig.telegram.defaultChannelId, message = '🧪 Test message from Alpha Quant FX Platform.' } = req.body;
  const result = await publisher.publishBroadcast(
    {
      id: 'test',
      name: 'Test Destination',
      chatId,
      type: DestinationType.CHANNEL,
      enabled: true,
      signalsEnabled: true,
      analysisEnabled: true,
      newsEnabled: true,
      dailyReportEnabled: true,
      resultUpdatesEnabled: true
    },
    message
  );

  return res.json({ success: result, message: result ? 'Test message dispatched successfully.' : 'Failed to dispatch test message.' });
});
