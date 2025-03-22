  import { Injectable } from '@nestjs/common';
  import { Document } from '../documents/entities/document.entity';

  @Injectable()
  export class IngestionService {
    private processingQueue = new Map<number, NodeJS.Timeout>();
    private statusStore = new Map<number, any>();

    async startIngestion(document: Document): Promise<void> {
      if (this.processingQueue.has(document.id)) {
        clearTimeout(this.processingQueue.get(document.id));
      }

      const processingTime = 5000 + Math.random() * 5000;
      const willSucceed = Math.random() < 0.8;

      this.statusStore.set(document.id, {
        status: 'processing',
        progress: 0,
        documentId: document.id,
      });

      const timeout = setTimeout(() => {
        if (willSucceed) {
          this.statusStore.set(document.id, {
            status: 'completed',
            progress: 100,
            message: 'Processing complete',
          });
        } else {
          this.statusStore.set(document.id, {
            status: 'failed',
            message: 'Mock processing failure',
          });
        }
        this.processingQueue.delete(document.id);
      }, processingTime);

      this.processingQueue.set(document.id, timeout);
    }

    getStatus(documentId: number) {
      return (
        this.statusStore.get(documentId) || {
          status: 'not_found',
          message: 'Document not in processing queue',
        }
      );
    }
  }
