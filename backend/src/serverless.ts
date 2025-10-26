import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverless from 'serverless-http';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const expressApp = express();
let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  
  app.enableCors({
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
  });
  
  await app.init();
  return serverless(expressApp);
}

export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(req, res);
}
