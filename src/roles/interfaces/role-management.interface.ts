import { Role } from 'src/entities/role.entity';
import { Permission } from 'src/entities/permission.entity';

export interface IRoleManagement {
  create(role: Partial<Role>): Promise<Role>;
  findAll(): Promise<Role[]>;
  findOne(id: number): Promise<Role>;
  update(id: number, updatedRole: Partial<Role>): Promise<Role>;
  remove(id: number): Promise<void>;
}

export interface IPermissionManagement {
  ensurePermissionExists(permissionName: string): Promise<Permission>;
  assignPermissionsToRole(roleId: number, permissionNames: string[]): Promise<Role>;
  removePermissionsFromRole(roleId: number, permissionNames?: string[]): Promise<Role>;
}
