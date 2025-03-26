import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'VIEWER',
  };

  beforeEach(async () => {
    const mockService = {
      create: jest.fn().mockResolvedValue(mockUser),
      findAll: jest.fn().mockResolvedValue([mockUser]),
      findOne: jest.fn().mockResolvedValue(mockUser),
      update: jest.fn().mockResolvedValue({ ...mockUser, name: 'Updated' }),
      remove: jest.fn().mockResolvedValue({ id: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
      };
      expect(await controller.create(dto)).toEqual(mockUser);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  // describe('findAll', () => {
  //   it('should return all users', async () => {
  //     expect(await controller.findAll()).toEqual([mockUser]);
  //   });
  // });

  describe('findOne', () => {
    it('should return a user', async () => {
      expect(await controller.findOne('1')).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = { name: 'Updated' };
      expect(await controller.update('1', dto)).toEqual({
        ...mockUser,
        name: 'Updated',
      });
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      expect(await controller.remove('1')).toEqual({ id: 1 });
    });
  });
});
