import { User } from 'src/entities/user.entity';
import { CreateUserDto } from '../create-user.dto';

export interface IUserManagement {
  createUser(userDto: CreateUserDto): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findByPhone(phone: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: number, updateUserDto: Partial<User>): Promise<User | null>;
  remove(id: number): Promise<void>;
}
