import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { JwtAuthGuard } from '../jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({
              access_token: 'token',
              user: mockUser,
            }),
            validateUser: jest.fn(),
            login: jest.fn().mockResolvedValue({
              access_token: 'token',
              user: mockUser,
            }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a user and return token', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password',
        name: 'Test User',
      };
      await expect(controller.register(createUserDto)).resolves.toEqual({
        access_token: 'token',
        user: mockUser,
      });
      expect(authService.register).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('login', () => {
    it('should return token for valid credentials', async () => {
      (authService.validateUser as jest.Mock).mockResolvedValue(mockUser);
      await expect(
        controller.login({
          email: 'test@example.com',
          password: 'password',
        }),
      ).resolves.toEqual({
        access_token: 'token',
        user: mockUser,
      });
      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'password',
      );
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      (authService.validateUser as jest.Mock).mockResolvedValue(null);
      await expect(
        controller.login({
          email: 'wrong@example.com',
          password: 'wrong',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('profile', () => {
    it('should return user data', () => {
      const req = { user: mockUser };
      expect(controller.getProfile(req)).toEqual(mockUser);
    });
  });
});
