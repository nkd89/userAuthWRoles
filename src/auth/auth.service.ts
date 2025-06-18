import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PasswordService } from '../users/password.service';
import { IAuthService, IAuthenticationResult } from './interfaces/auth.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
  ) {}

  async validateUser(login: string, password: string) {
    const isEmail = login.includes('@');
    const user = isEmail
      ? await this.usersService.findByEmail(login)
      : await this.usersService.findByPhone(login);

    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await this.passwordService.validatePassword(password, user.password_hash);
    if (!isMatch) throw new UnauthorizedException('Invalid password');

    const { password_hash, ...result } = user;
    return result;
  }

  async login(user: any): Promise<IAuthenticationResult> {
    const payload = { sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user
    };
  }
}
