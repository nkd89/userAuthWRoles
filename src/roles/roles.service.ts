import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "src/entities/role.entity";
import { Permission } from "src/entities/permission.entity";
import { Repository } from "typeorm";

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private permissionRepo: Repository<Permission>
  ) {}

  async create(role: Partial<Role>): Promise<Role> {
    const existingRole = await this.roleRepo.findOne({ where: { name: role.name } });
    if (existingRole) {
      throw new NotFoundException(`Role with name ${role.name} already exists`);
    }
    return this.roleRepo.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepo.find({ relations: ["permissions"] });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepo.findOne({ where: { id }, relations: ["permissions"] });
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  async update(id: number, updatedRole: Partial<Role>): Promise<Role> {
    await this.roleRepo.update(id, updatedRole);
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    return role;
  }

  async remove(id: number): Promise<void> {
    await this.roleRepo.delete(id);
  }

  async ensurePermissionExists(permissionName: string): Promise<Permission> {
    let permission = await this.permissionRepo.findOne({ where: { name: permissionName } });
    if (!permission) {
      permission = this.permissionRepo.create({ name: permissionName });
      permission = await this.permissionRepo.save(permission);
    }
    return permission;
  }

  async assignPermissionsToRole(roleId: number, permissionNames: string[]): Promise<Role> {
    const role = await this.findOne(roleId);
    if (!role) {
      throw new NotFoundException(`Role with id ${roleId} not found`);
    }

    const permissions = await Promise.all(
      permissionNames.map((name) => this.ensurePermissionExists(name))
    );

    role.permissions = [...(role.permissions || []), ...permissions];
    return this.roleRepo.save(role);
  }

  async removePermissionsFromRole(roleId: number, permissionNames?: string[]): Promise<Role> {
    const role = await this.findOne(roleId);
    if (!role) {
      throw new NotFoundException(`Role with id ${roleId} not found`);
    }

    if (permissionNames && permissionNames.length > 0) {
      role.permissions = role.permissions.filter(
        (permission) => !permissionNames.includes(permission.name)
      );
    } else {
      role.permissions = [];
    }

    return this.roleRepo.save(role);
  }
}