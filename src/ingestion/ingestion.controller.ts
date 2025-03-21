import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IngestionService } from './ingestion.service';
import { Document } from '../documents/entities/document.entity';

@Controller()
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @MessagePattern({ cmd: 'start_ingestion' })
  async handleIngestion(@Payload() document: Document) {
    await this.ingestionService.startIngestion(document);
    return { received: true };
  }

  @MessagePattern({ cmd: 'get_status' })
  async handleStatusCheck(@Payload() documentId: number) {
    return this.ingestionService.getStatus(documentId);
  }
}
