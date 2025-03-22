import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { BadRequestException } from '@nestjs/common';
import { Document } from './entities/document.entity';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDocument: Document = {
    id: 1,
    title: 'Test Document',
    fileName: 'test.pdf',
    fileType: 'application/pdf',
    fileSize: 12345,
    filePath: '/uploads/test.pdf',
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastProcessedAt: null,
    retryCount: 0,
    statusMessage: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: {
            create: jest.fn(),
            triggerIngestion: jest
              .fn()
              .mockResolvedValue({ message: 'Ingestion initiated' }),
          },
        },
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

  describe('create', () => {
    it('should create a document with valid file', async () => {
      const createDto: CreateDocumentDto = { title: 'Test Document' };
      const mockFile = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 12345,
        path: '/uploads/test.pdf',
      } as Express.Multer.File;

      jest.spyOn(service, 'create').mockResolvedValue(mockDocument);

      const result = await controller.create(createDto, mockFile);
      expect(result).toEqual(mockDocument);
      expect(service.create).toHaveBeenCalledWith(createDto, mockFile);
    });

    it('should throw error if no file is provided', async () => {
      const createDto: CreateDocumentDto = { title: 'Test Document' };
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException('File is required'));

      await expect(controller.create(createDto, null)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('triggerIngestion', () => {
    it('should initiate ingestion for a document', async () => {
      const documentId = '1';
      const result = await controller.triggerIngestion(documentId);
      expect(result).toEqual({ message: 'Ingestion initiated' });
      expect(service.triggerIngestion).toHaveBeenCalledWith(1);
    });
  });
});
