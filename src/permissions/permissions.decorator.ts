import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export const PERMISSIONS_ALL_KEY = 'permissions_all';
export const PERMISSIONS_ANY_KEY = 'permissions_any';

export const PermissionsAll = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_ALL_KEY, permissions);

export const PermissionsAny = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_ANY_KEY, permissions);
