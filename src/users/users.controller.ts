import { Body, Controller, Delete, Get, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PermissionGuard } from 'src/permissions/permissions.guard';
import { PermissionsAll, PermissionsAny } from 'src/permissions/permissions.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'The user was successfully created', type: User })
  @ApiBody({ type: CreateUserDto })
  @Post('register')
  async register(@Body() body: CreateUserDto): Promise<User> {
    return this.usersService.createUser(body);
  }

  @ApiOperation({ summary: 'Get the profile of the currently authenticated user' })
  @ApiResponse({ status: 200, description: "The user's profile", type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req): Promise<User | null> {
    return this.usersService.findById(req.user.id);
  }

  @ApiOperation({ summary: 'Update the profile of the currently authenticated user' })
  @ApiResponse({ status: 200, description: 'The updated user profile', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateMe(@Request() req, @Body() dto: UpdateUserDto): Promise<User | null> {
    return this.usersService.update(req.user.userId, dto);
  }

  @ApiOperation({ summary: "Delete the currently authenticated user's account" })
  @ApiResponse({ status: 204, description: 'No content' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  deleteMe(@Request() req): Promise<void> {
    return this.usersService.remove(req.user.userId);
  }

  @ApiOperation({ summary: 'Retrieve a list of all users (requires permission)' })
  @ApiResponse({ status: 200, description: 'A list of users', type: [User] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiParam({
    name: 'Permissions',
    required: true,
    description: 'Permission header',
    schema: { type: 'string', example: 'user:read' },
  })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  @PermissionsAny('user:read')
  @Get()
  findAllUsers() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Update the role of a user (requires permission)' })
  @ApiResponse({ status: 200, description: 'The updated user with new role', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBody({ schema: { type: 'object', properties: { role: { type: 'string', example: 'admin' } } } })
  @UseGuards(JwtAuthGuard, PermissionGuard)
  // TODO: Расскоментировать с нужной ролью
  // @PermissionsAll('user:permission:write')
  @Put('me/role')
  assignRole(@Request() req, @Body('role') role: number): Promise<User | null> {
    const userId = req.user.id;
    return this.usersService.assignRole( role, userId);
  }

  @ApiOperation({ summary: 'Upload an avatar for the currently authenticated user' })
  @ApiResponse({ status: 200, description: 'The updated user with new avatar', type: User })
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('me/avatar')
  async uploadAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File
  ): Promise<User | null> {
    const userId = req.user.id;
    const avatarUrl = await this.usersService.uploadAvatarToS3(file);
    return this.usersService.uploadAvatar(userId, avatarUrl);
  }
}
