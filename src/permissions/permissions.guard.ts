import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_ALL_KEY, PERMISSIONS_ANY_KEY } from './permissions.decorator';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
    private roleService: RolesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissionsAll = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_ALL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requiredPermissionsAny = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_ANY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Access denied');
    }

    const userFromDb = await this.userService.findById(user.id);
    if (!userFromDb) {
      throw new ForbiddenException('User not found');
    }

    const userRole = userFromDb.role || null;

    if (!userRole) {
      throw new ForbiddenException('User role not found');
    }

    const roleFromDb = await this.roleService.findOne(userRole.id);

    const userPermissions = roleFromDb.permissions.map((perm) => perm.name);

    if (
      requiredPermissionsAll &&
      !requiredPermissionsAll.every((perm) => userPermissions.includes(perm))
    ) {
      throw new ForbiddenException('Access denied: missing required permissions');
    }

    if (
      requiredPermissionsAny &&
      !requiredPermissionsAny.some((perm) => userPermissions.includes(perm))
    ) {
      throw new ForbiddenException('Access denied: no matching permissions');
    }

    return true;
  }
}
