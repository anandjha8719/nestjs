import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from '../documents.controller';
import { DocumentsService } from '../documents.service';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { UpdateDocumentDto } from '../dto/update-document.dto';
import { DocumentStatus } from '../entities/document.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { BadRequestException } from '@nestjs/common';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDocument = {
    id: 1,
    title: 'Test',
    fileName: 'test.txt',
    fileType: 'text/plain',
    fileSize: 1000,
    status: DocumentStatus.PENDING,
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn().mockResolvedValue(mockDocument),
      findAll: jest.fn().mockResolvedValue([mockDocument]),
      findOne: jest.fn().mockResolvedValue(mockDocument),
      update: jest
        .fn()
        .mockResolvedValue({ ...mockDocument, title: 'Updated' }),
      remove: jest.fn().mockResolvedValue({ id: 1 }),
      triggerIngestion: jest
        .fn()
        .mockResolvedValue({ message: 'Ingestion initiated' }),
      retryIngestion: jest
        .fn()
        .mockResolvedValue({ message: 'Ingestion initiated' }),
      getIngestionStatus: jest.fn().mockResolvedValue({ status: 'completed' }),
    };

    const mockClientProxy = { send: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        { provide: DocumentsService, useValue: mockService },
        { provide: 'INGESTION_SERVICE', useValue: mockClientProxy },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  // describe('create', () => {
  //   it('should create a document', async () => {
  //     const dto: CreateDocumentDto = { title: 'Test' };
  //     const file = {
  //       originalname: 'test.txt',
  //       mimetype: 'text/plain',
  //       size: 1000,
  //       path: '/uploads/test.txt',
  //     } as Express.Multer.File;
  //     expect(await controller.create(dto, file)).toEqual(mockDocument);
  //     expect(service.create).toHaveBeenCalledWith(dto, file);
  //   });

  //   it('should throw error if no file', async () => {
  //     await expect(
  //       controller.create({ title: 'Test' }, undefined),
  //     ).rejects.toThrow(BadRequestException);
  //   });
  // });

  describe('findAll', () => {
    it('should return all documents', async () => {
      expect(await controller.findAll()).toEqual([mockDocument]);
    });
  });

  describe('findOne', () => {
    it('should return a document', async () => {
      expect(await controller.findOne('1')).toEqual(mockDocument);
    });
  });

  describe('update', () => {
    it('should update a document', async () => {
      const dto: UpdateDocumentDto = { title: 'Updated' };
      expect(await controller.update('1', dto)).toEqual({
        ...mockDocument,
        title: 'Updated',
      });
    });
  });

  describe('remove', () => {
    it('should delete a document', async () => {
      expect(await controller.remove('1')).toEqual({ id: 1 });
    });
  });

  describe('triggerIngestion', () => {
    it('should trigger ingestion', async () => {
      expect(await controller.triggerIngestion('1')).toEqual({
        message: 'Ingestion initiated',
      });
    });
  });
});
