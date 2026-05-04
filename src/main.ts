import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      timestamp: true,
      logLevels: ['log', 'error', 'warn'],
      colors: true,
      prefix: '[blog-api]',
      json: true
    }),
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
