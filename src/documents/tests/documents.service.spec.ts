import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentsService } from '../documents.service';
import { Document } from '../entities/document.entity';
import { CreateDocumentDto } from '../dto/create-document.dto';
import { DocumentStatus } from '../entities/document.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repo: Repository<Document>;

  const mockDocument = {
    id: 1,
    title: 'Test',
    fileName: 'test.txt',
    fileType: 'text/plain',
    fileSize: 1000,
    status: DocumentStatus.PENDING,
    save: jest.fn(),
  };

  const mockRepo = {
    create: jest.fn().mockReturnValue(mockDocument),
    save: jest.fn().mockResolvedValue(mockDocument),
    find: jest.fn().mockResolvedValue([mockDocument]),
    findOne: jest.fn().mockResolvedValue(mockDocument),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockClientProxy = {
    send: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: getRepositoryToken(Document), useValue: mockRepo },
        { provide: 'INGESTION_SERVICE', useValue: mockClientProxy },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repo = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  describe('create', () => {
    it('should create a document', async () => {
      const dto: CreateDocumentDto = { title: 'Test' };
      const file = {
        originalname: 'test.txt',
        mimetype: 'text/plain',
        size: 1000,
        path: '/uploads/test.txt',
      } as Express.Multer.File;
      expect(await service.create(dto, file)).toEqual(mockDocument);
      expect(repo.create).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a document', async () => {
      expect(await service.findOne(1)).toEqual(mockDocument);
    });

    it('should throw if not found', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a document', async () => {
      const dto = { title: 'Updated' };
      mockRepo.findOne.mockResolvedValueOnce({
        ...mockDocument,
        status: DocumentStatus.COMPLETED,
      });
      await service.update(1, dto);
      expect(repo.update).toHaveBeenCalled();
    });

    it('should throw if processing', async () => {
      mockRepo.findOne.mockResolvedValueOnce({
        ...mockDocument,
        status: DocumentStatus.PROCESSING,
      });
      await expect(service.update(1, {})).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a document', async () => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'unlinkSync').mockImplementation();
      await service.remove(1);
      expect(repo.delete).toHaveBeenCalled();
    });
  });
});
