import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    if (!userDto.email && !userDto.phone) {
      throw new BadRequestException('Either email or phone must be provided');
    }

    if (userDto.email && await this.findByEmail(userDto.email)) {
      throw new BadRequestException('Email already registered');
    }

    if (userDto.phone && await this.findByPhone(userDto.phone)) {
      throw new BadRequestException('Phone already registered');
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
    return this.userRepo.findOne({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async update(id: number, updateUserDto: Partial<User>): Promise<User | null> {
    await this.userRepo.update(id, updateUserDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }

}
