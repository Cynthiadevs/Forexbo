import { APIServer } from './server.ts';
import { AppConfig } from '../../../packages/config/src/index.ts';

async function bootstrap() {
  const server = new APIServer();
  const port = Number(process.env.PORT || AppConfig.port || 4000);
  await server.start(port);

  const shutdown = async () => {
    console.log('\n🛑 Gracefully shutting down API server...');
    await server.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch((err) => {
  console.error('❌ Fatal error in API server bootstrap:', err);
  process.exit(1);
});
