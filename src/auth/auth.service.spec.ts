import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../users/password.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let passwordService: PasswordService;
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    phone: '+1234567890',
    password_hash: 'hashedPassword',
    first_name: 'Test',
    last_name: 'User',
    avatar: 'avatar.jpg',
    telegram_id: 12345,
    role: null
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    findByPhone: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockPasswordService = {
    validatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    passwordService = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user with email successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.validatePassword.mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password');      expect(result).toBeDefined();
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockPasswordService.validatePassword).toHaveBeenCalledWith('password', mockUser.password_hash);
    });

    it('should validate user with phone successfully', async () => {
      mockUsersService.findByPhone.mockResolvedValue(mockUser);
      mockPasswordService.validatePassword.mockResolvedValue(true);

      const result = await service.validateUser('+1234567890', 'password');      expect(result).toBeDefined();
      expect(mockUsersService.findByPhone).toHaveBeenCalledWith('+1234567890');
      expect(mockPasswordService.validatePassword).toHaveBeenCalledWith('password', mockUser.password_hash);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.validateUser('test@example.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      mockPasswordService.validatePassword.mockResolvedValue(false);

      await expect(service.validateUser('test@example.com', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should return access token and user', async () => {
      const mockToken = 'jwt-token';
      mockJwtService.sign.mockReturnValue(mockToken);
      const { password_hash, ...userWithoutPassword } = mockUser;

      const result = await service.login(userWithoutPassword);

      expect(result.access_token).toBe(mockToken);
      expect(result.user).toEqual(userWithoutPassword);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: mockUser.id });
    });
  });
});
