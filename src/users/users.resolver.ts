import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './update-user.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => [User], { name: 'users' })
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User, { name: 'user', nullable: true })
  async findOne(@Context('req') req: any): Promise<User | null> {
    const id = req.user.id;
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Context('req') req: any,
    @Args('updateUserInput') updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const id = req.user.id;
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async removeUser(@Context('req') req: any): Promise<boolean> {
    const id = req.user.id;
    await this.usersService.remove(id);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User, { nullable: true })
  async assignRole(
    @Context('req') req: any,
    @Args('roleId', { type: () => Int }) roleId: number,
  ): Promise<User> {
    const userId = req.user.id;
    return this.usersService.assignRole(userId, roleId);
  }
}
