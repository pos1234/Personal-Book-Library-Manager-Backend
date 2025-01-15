import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { ForbiddenException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  const result = {
    userData: {
      id: 1,
      email: 'test@example.com',
      name: 'abebe',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    token: { access_token: 'mockJwtToken' },
  };
  describe('signup', () => {
    it('should successfully sign up a user', async () => {
      jest.spyOn(authService, 'signup').mockResolvedValue(result);

      const dto: AuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      expect(await authController.signup(dto)).toEqual(result);
    });

    it('should throw an exception if email is already taken', async () => {
      jest
        .spyOn(authService, 'signup')
        .mockRejectedValue(
          new ForbiddenException('User with the same email already exists'),
        );

      const dto: AuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      await expect(authController.signup(dto)).rejects.toThrow(
        'User with the same email already exists',
      );
    });
  });

  describe('signin', () => {
    it('should successfully sign in a user', async () => {
      jest.spyOn(authService, 'signin').mockResolvedValue(result);

      const dto: AuthDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      expect(await authController.singin(dto)).toEqual(result);
    });

    it('should throw an exception for incorrect email or password', async () => {
      jest
        .spyOn(authService, 'signin')
        .mockRejectedValue(
          new ForbiddenException('Incorrect Email or Password'),
        );

      const dto: AuthDto = {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      };
      await expect(authController.singin(dto)).rejects.toThrow(
        'Incorrect Email or Password',
      );
    });
  });
});
