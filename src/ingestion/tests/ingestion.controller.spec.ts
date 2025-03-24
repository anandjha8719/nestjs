import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from '../ingestion.controller';
import { IngestionService } from '../ingestion.service';
import { Document } from '../../documents/entities/document.entity';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  const mockService = {
    startIngestion: jest.fn(),
    getStatus: jest.fn().mockResolvedValue({ status: 'completed' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [{ provide: IngestionService, useValue: mockService }],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  describe('handleIngestion', () => {
    it('should handle ingestion', async () => {
      const doc = new Document();
      await controller.handleIngestion(doc);
      expect(service.startIngestion).toHaveBeenCalledWith(doc);
    });
  });

  describe('handleStatusCheck', () => {
    it('should return status', async () => {
      expect(await controller.handleStatusCheck(1)).toEqual({
        status: 'completed',
      });
    });
  });
});
