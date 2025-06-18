import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { PasswordService } from 'src/users/password.service';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;
  let passwordService: PasswordService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };  const mockRoleRepository = {
    findOne: jest.fn(),
  };

  const mockPasswordService = {
    hashPassword: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
        {
          provide: PasswordService,
          useValue: mockPasswordService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    passwordService = module.get<PasswordService>(PasswordService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const createUserDto = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      password: 'password123',
    };

    const defaultRole = {
      id: 1,
      name: 'user',
      permissions: [],
    };    it('should create a user with default role successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      mockPasswordService.hashPassword.mockResolvedValue(hashedPassword);
      mockRoleRepository.findOne.mockResolvedValue(defaultRole);
        const userWithoutRole = {
        ...createUserDto,
        password_hash: hashedPassword,
      };
      
      const userWithRole = {
        ...userWithoutRole,
        role: defaultRole,
      };
      
      mockUserRepository.create.mockReturnValue(userWithoutRole);
      mockUserRepository.save.mockResolvedValue(userWithRole);

      const result = await service.createUser(createUserDto);

      expect(result).toEqual(userWithRole);
      expect(mockPasswordService.hashPassword).toHaveBeenCalledWith(createUserDto.password);
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith({ where: { name: 'user' } });
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password_hash: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith({
        ...createUserDto,
        password_hash: hashedPassword,
        role: defaultRole,
      });
    });    it('should throw BadRequestException when default role is not found', async () => {
      const hashedPassword = 'hashedPassword123';
      mockPasswordService.hashPassword.mockResolvedValue(hashedPassword);
      mockRoleRepository.findOne.mockResolvedValue(null);
      
      mockUserRepository.create.mockReturnValue({
        ...createUserDto,
        password_hash: hashedPassword,
      });

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new BadRequestException('Default user role not found. Please run database seeds.'),
      );
    });

    it('should throw BadRequestException when first name is missing', async () => {
      const invalidUserDto = {
        ...createUserDto,
        first_name: '',
      };

      await expect(service.createUser(invalidUserDto)).rejects.toThrow(
        new BadRequestException('First name and last name are required'),
      );
    });

    it('should throw BadRequestException when last name is missing', async () => {
      const invalidUserDto = {
        ...createUserDto,
        last_name: '',
      };

      await expect(service.createUser(invalidUserDto)).rejects.toThrow(
        new BadRequestException('First name and last name are required'),
      );
    });
  });
});
