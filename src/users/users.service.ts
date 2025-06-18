import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { CreateUserDto } from './create-user.dto';
import { IUserManagement } from './interfaces/user-management.interface';
import { PasswordService } from './password.service';
import axios from 'axios';
import * as FormData from 'form-data';
import { Blob } from 'buffer';

@Injectable()
export class UsersService implements IUserManagement {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    private readonly passwordService: PasswordService,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    await this.validateUserDto(userDto);
    
    const user = this.userRepo.create({
      ...userDto,
      password_hash: await this.passwordService.hashPassword(userDto.password),
    });

    // If no role is specified, assign the default 'user' role
    if (!user.role) {
      const defaultRole = await this.roleRepo.findOne({ where: { name: 'user' } });
      if (!defaultRole) {
        throw new BadRequestException('Default user role not found. Please run database seeds.');
      }
      user.role = defaultRole;
    }

    return this.userRepo.save(user);
  }

  private async validateUserDto(userDto: CreateUserDto): Promise<void> {
    Object.keys(userDto).forEach((key) => {
      if (userDto[key] === undefined || userDto[key] === null || userDto[key] === '') {
        delete userDto[key];
      }
    });

    if (!userDto.first_name || !userDto.last_name) {
      throw new BadRequestException('First name and last name are required');
    }

    if (!userDto.email && !userDto.phone) {
      throw new BadRequestException('Either email or phone must be provided');
    }

    if (userDto.email && (await this.findByEmail(userDto.email))) {
      throw new BadRequestException('Email already registered');
    }

    if (userDto.phone && (await this.findByPhone(userDto.phone))) {
      throw new BadRequestException('Phone already registered');
    }

    if (!userDto?.password) {
      throw new BadRequestException('Password is required');
    }

    if (userDto.password.length < 6) {
      throw new BadRequestException('Password must be at least 6 characters long');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { phone } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { id }, relations: ['role'] });
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find({ relations: ['role'] });
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User | null> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
  
    await this.userRepo.save({...user, ...updateUserDto });
  
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }

  async assignRole(userId: number, roleId: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const role = await this.roleRepo.findOne({ where: { id: roleId } });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    user.role = role;
    return this.userRepo.save(user);
  }

  async uploadAvatar(userId: number, imgUrl: string): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!imgUrl) {
      throw new BadRequestException('Image URL is required');
    }

    user.avatar = imgUrl;
    return this.userRepo.save(user);
  }

  async uploadAvatarToS3(file: Express.Multer.File): Promise<string> {
    const S3_URL = process.env.S3_URL;
    const TOKEN = process.env.S3_UPLOAD_TOKEN;
  
    if (!S3_URL || !TOKEN) {
      throw new BadRequestException('S3_URL or token not set');
    }
  
    if (!file || !file.buffer) {
      throw new BadRequestException('File not received');
    }
  
    const form = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    form.append('file', blob, file.originalname);
  
    try {
      const response = await axios.post(S3_URL, form.getBuffer(), {
        headers: {
          ...form.getHeaders(),
          Authorization: `Bearer ${TOKEN}`,
          'Content-Type': `multipart/form-data; boundary=${form.getBoundary()}`
        },
        responseType: 'text',
      });
  
      return response.data;
    } catch (error) {
      const message = error.response?.data || error.message;
      console.error('S3 upload failed:', message);
      throw new BadRequestException('Upload failed: ' + message);
    }
  }
  
}
