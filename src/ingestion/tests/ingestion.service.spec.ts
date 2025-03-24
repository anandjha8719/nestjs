import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from '../ingestion.service';
import { Document } from '../../documents/entities/document.entity';

jest.useFakeTimers();

describe('IngestionService', () => {
  let service: IngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngestionService],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should start ingestion and update status to processing', async () => {
    const document: Document = { id: 1 } as Document;

    await service.startIngestion(document);
    expect(service.getStatus(1)).toMatchObject({
      status: 'PROCESSING',
      progress: 0,
    });

    jest.runAllTimers();
  });

  it('should complete processing successfully', async () => {
    const document: Document = { id: 2 } as Document;

    jest.spyOn(global.Math, 'random').mockReturnValue(0.5);
    await service.startIngestion(document);

    jest.runAllTimers();
    expect(service.getStatus(2)).toMatchObject({
      status: 'COMPLETED',
      progress: 100,
    });

    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should fail processing when random condition fails', async () => {
    const document: Document = { id: 3 } as Document;

    jest.spyOn(global.Math, 'random').mockReturnValue(0.9);
    await service.startIngestion(document);

    jest.runAllTimers();
    expect(service.getStatus(3)).toMatchObject({
      status: 'FAILED',
      message: 'Mock processing failure',
    });

    jest.spyOn(global.Math, 'random').mockRestore();
  });

  it('should return not_found status for unknown document', () => {
    expect(service.getStatus(999)).toMatchObject({
      status: 'not_found',
      message: 'Document not in processing queue',
    });
  });

  it('should restart processing if document is re-ingested', async () => {
    const document: Document = { id: 4 } as Document;

    await service.startIngestion(document);
    expect(service.getStatus(4)).toMatchObject({
      status: 'PROCESSING',
      progress: 0,
    });

    await service.startIngestion(document);
    expect(service.getStatus(4)).toMatchObject({
      status: 'PROCESSING',
      progress: 0,
    });

    jest.runAllTimers();
  });
});
