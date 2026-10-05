import { fileURLToPath } from 'node:url';

import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module.js';

const builtWebApp = fileURLToPath(new URL('../../frontend/dist', import.meta.url));

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({ origin: process.env.FRONTEND_URL });
  app.useStaticAssets(builtWebApp);
  await app.listen(process.env.PORT ?? 3000);
};

await bootstrap();
