import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { INGESTION_SERVICE, INGESTION_PORT } from '../ingestion/constants';
@Module({
  imports: [
    TypeOrmModule.forFeature([Document]),
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
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
