import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { IPasswordService } from './interfaces/password.service.interface';

@Injectable()
export class PasswordService implements IPasswordService {
  private readonly SALT_ROUNDS = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
