import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
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

    const user = this.userRepo.create({
      ...userDto,
      password_hash: userDto.password,
    });

    return this.userRepo.save(user);
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
    await this.userRepo.update(id, updateUserDto);
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
  
  async updateRole(userId: string, roleName: string): Promise<User | null> {
    const user = await this.findById(Number(userId));
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const role = await this.roleRepo.findOne({ where: { name: roleName } });
    if (!role) {
      throw new BadRequestException('Role not found');
    }

    user.role = role;
    return this.userRepo.save(user);
  }
}
