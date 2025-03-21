import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { IngestionModule } from './ingestion.module';
import { INGESTION_PORT } from './constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    IngestionModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: INGESTION_PORT,
      },
    },
  );
  await app.listen();
}
bootstrap();
