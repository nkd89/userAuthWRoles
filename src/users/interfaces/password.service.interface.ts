import { User } from 'src/entities/user.entity';

export interface IPasswordService {
  hashPassword(password: string): Promise<string>;
  validatePassword(password: string, hash: string): Promise<boolean>;
}
