import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document, DocumentStatus } from './entities/document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import * as fs from 'fs';
import { INGESTION_SERVICE } from '../ingestion/constants';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @Inject(INGESTION_SERVICE) private readonly client: ClientProxy,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const document = this.documentsRepository.create({
      title: createDocumentDto.title,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      filePath: file.path,
      status: DocumentStatus.PENDING,
    });

    const savedDocument = await this.documentsRepository.save(document);

    return savedDocument;
  }

  async findAll() {
    return this.documentsRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const document = await this.documentsRepository.findOne({
      where: { id },
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    const document = await this.findOne(id);

    if (document.status === DocumentStatus.PROCESSING) {
      throw new BadRequestException(
        'Cannot update document while it is being processed',
      );
    }

    await this.documentsRepository.update(id, updateDocumentDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const document = await this.findOne(id);

    if (document.status === DocumentStatus.PROCESSING) {
      throw new BadRequestException(
        'Cannot delete document while it is being processed',
      );
    }

    if (document.filePath && fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await this.documentsRepository.delete(id);
    return { id };
  }

  async triggerIngestion(documentId: number) {
    const document = await this.findOne(documentId);

    // document.lastProcessedAt = new Date();
    // document.status = DocumentStatus.PROCESSING;
    // await this.documentsRepository.save(document);
    this.client.send({ cmd: 'start_ingestion' }, document).subscribe({
      next: () => console.log(`Ingestion started for doc ${documentId}`),
      error: (err) => console.error('Microservice error:', err),
    });

    return { message: 'Ingestion initiated' };
  }

  async retryIngestion(id: number) {
    const document = await this.findOne(id);

    if (document.status === DocumentStatus.PROCESSING) {
      throw new BadRequestException('Document is already being processed');
    }

    // Reset retry count if it was previously marked as failed
    if (document.status === DocumentStatus.FAILED) {
      await this.documentsRepository.update(id, {
        retryCount: 0,
        status: DocumentStatus.PENDING,
        statusMessage: 'Retrying ingestion',
      });
    }

    return this.triggerIngestion(id);
  }

  async getIngestionStatus(id: number) {
    const response = await firstValueFrom(
      this.client.send({ cmd: 'get_status' }, id),
    );
    if (response.status === 'completed' || response.status === 'failed') {
      await this.documentsRepository.update(id, {
        status:
          response.status === 'completed'
            ? DocumentStatus.COMPLETED
            : DocumentStatus.FAILED,
        statusMessage: response.message,
      });
    }
    return response;
  }
}
