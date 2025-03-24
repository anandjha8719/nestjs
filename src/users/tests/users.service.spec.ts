import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException, NotFoundException } from '@nestjs/common';

jest.mock('bcrypt');

const mockUser = {
  id: 1,
  email: 'test@example.com',
  password: 'hashed',
  name: 'Test User',
  role: 'VIEWER',
};

const mockRepo = {
  findOne: jest.fn(),
  create: jest.fn().mockReturnValue(mockUser),
  save: jest.fn().mockResolvedValue(mockUser),
  find: jest.fn().mockResolvedValue([mockUser]),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  beforeEach(async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      mockRepo.findOne.mockResolvedValueOnce(null);
      const result = await service.create(dto);
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'VIEWER',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
    });

    it('should throw conflict error', async () => {
      mockRepo.findOne.mockResolvedValueOnce(mockUser);
      await expect(
        service.create({ email: 'test@example.com', password: 'password' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      mockRepo.findOne.mockResolvedValueOnce(mockUser);
      const result = await service.findOne(1);
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        role: 'VIEWER',
      });
    });

    it('should throw not found', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = { name: 'Updated' };
      mockRepo.findOne.mockResolvedValueOnce(mockUser);
      const result = await service.update(1, dto);
      expect(result.name).toEqual('Updated');
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockRepo.findOne.mockResolvedValueOnce(mockUser);
      await service.remove(1);
      expect(repo.delete).toHaveBeenCalledWith(1);
    });
  });
});
