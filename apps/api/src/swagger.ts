export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Alpha Quant Forex Intelligence & Telegram Automation API',
    version: '1.0.0',
    description: 'Enterprise REST & WebSocket API for real-time Forex market ingestion, quantitative signals, AI analysis, backtesting, and Telegram automated publishing.'
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Local Development Server'
    }
  ],
  paths: {
    '/market': {
      get: {
        summary: 'List all supported Forex and Metal instruments with live ticks',
        responses: { 200: { description: 'Success' } }
      }
    },
    '/market/{symbol}': {
      get: {
        summary: 'Get tick and historical candles for a symbol',
        parameters: [{ name: 'symbol', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Success' } }
      }
    },
    '/signals': {
      get: {
        summary: 'Query historical and active trading signals',
        responses: { 200: { description: 'Success' } }
      }
    },
    '/signals/generate': {
      post: {
        summary: 'Run quantitative evaluation and generate signal for symbol',
        responses: { 201: { description: 'Signal Generated' } }
      }
    },
    '/backtest/run': {
      post: {
        summary: 'Execute historical backtest simulation',
        responses: { 200: { description: 'Backtest Result' } }
      }
    },
    '/system/health': {
      get: {
        summary: 'Get operational health status of all platform services',
        responses: { 200: { description: 'Health Status' } }
      }
    }
  }
};
