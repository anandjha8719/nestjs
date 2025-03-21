import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { INGESTION_SERVICE, INGESTION_PORT } from './constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: INGESTION_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: INGESTION_PORT,
        },
      },
    ]),
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
  exports: [IngestionService],
})
export class IngestionModule {}
