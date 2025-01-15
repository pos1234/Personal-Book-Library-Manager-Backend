import { AuthService } from './auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import * as argon from 'argon2';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PrismaService,
        ConfigService,
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mockJwtToken'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should sign up a user successfully', async () => {
      jest.spyOn(argon, 'hash').mockResolvedValue('hashedPassword');
      jest.spyOn(prismaService.users, 'create').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        hash: 'hashedPassword',
      } as any);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('fake-jwt-token');

      const result = await authService.signup({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result?.userData.email).toBe('test@example.com');
      expect(result?.token.access_token).toBe('fake-jwt-token');
    });

    it('should throw an exception when email is already taken', async () => {
      jest.spyOn(prismaService.users, 'create').mockRejectedValue( new PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: '3.0.0',
      })) as any

      await expect(
        authService.signup({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow('User with the same email already exists');
    });
  });

  describe('signin', () => {
    it('should sign in a user successfully', async () => {
      jest.spyOn(prismaService.users, 'findUnique').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        hash: 'hashedPassword',
      } as any);
      jest.spyOn(argon, 'verify').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('fake-jwt-token');

      const result = await authService.signin({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.userData.email).toBe('test@example.com');
      expect(result.token.access_token).toBe('fake-jwt-token');
    });

    it('should throw an exception if email is not found', async () => {
      jest.spyOn(prismaService.users, 'findUnique').mockResolvedValue(null);

      await expect(
        authService.signin({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw an exception if password is incorrect', async () => {
      jest.spyOn(prismaService.users, 'findUnique').mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        hash: 'hashedPassword',
      } as any);
      jest.spyOn(argon, 'verify').mockResolvedValue(false);

      await expect(
        authService.signin({
          email: 'test@example.com',
          password: 'wrongPassword',
        }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
