import { Injectable } from '@nestjs/common';
import { Document } from '../documents/entities/document.entity';

@Injectable()
export class IngestionService {
  private processingQueue = new Map<number, NodeJS.Timeout>();
  private statusStore = new Map<number, any>();

  startIngestion(
    document: Document,
  ): Promise<{ status: string; message: string; documentId: number }> {
    if (this.processingQueue.has(document.id)) {
      clearTimeout(this.processingQueue.get(document.id));
    }

    const processingTime = 5000 + Math.random() * 5000;
    const willSucceed = Math.random() < 0.8;

    this.statusStore.set(document.id, {
      status: 'PROCESSING',
      progress: 0,
      documentId: document.id,
    });

    const timeout = setTimeout(() => {
      if (willSucceed) {
        this.statusStore.set(document.id, {
          status: 'COMPLETED',
          progress: 100,
          message: 'Processing complete',
        });
      } else {
        this.statusStore.set(document.id, {
          status: 'FAILED',
          message: 'Mock processing failure',
        });
      }
      this.processingQueue.delete(document.id);
    }, processingTime);

    this.processingQueue.set(document.id, timeout);
    return Promise.resolve({
      status: 'PROCESSING',
      message: 'Ingestion started successfully',
      documentId: document.id,
    });
  }

  getStatus(documentId: number): {
    status: string;
    message?: string;
    documentId?: number;
    progress?: number;
  } {
    const status = this.statusStore.get(documentId);

    return (
      status ?? {
        status: 'not_found',
        message: 'Document not in processing queue',
      }
    );
  }
}
