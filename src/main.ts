import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true, // Enable built-in body parser with default settings
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
}
bootstrap();
