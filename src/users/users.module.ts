import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from 'src/entities/user.entity';
import { Role } from 'src/entities/role.entity';
import { RolesModule } from 'src/roles/roles.module';
import { UsersResolver } from './users.resolver';
import { PasswordService } from './password.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role]), RolesModule],
  providers: [UsersService, UsersResolver, PasswordService],
  controllers: [UsersController],
  exports: [UsersService, PasswordService],
})
export class UsersModule {}
