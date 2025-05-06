import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "src/entities/permission.entity";
import { Repository } from "typeorm";

@Injectable()
export class PermissionsService {
  constructor(@InjectRepository(Permission) private permissionRepo: Repository<Permission>) {}

  async create(permission: Permission): Promise<Permission> {
    return this.permissionRepo.save(permission);
  }

  async findAll(): Promise<Permission[]> {
    return this.permissionRepo.find();
  }

  async findOne(id: number): Promise<Permission | undefined> {
    const permission = await this.permissionRepo.findOne({ where: { id } });
    return permission ?? undefined;
  }

  async update(id: number, updatedPermission: Partial<Permission>): Promise<Permission> {
    await this.permissionRepo.update(id, updatedPermission);
    const permission = await this.findOne(id);
    if (!permission) {
      throw new Error(`Permission with id ${id} not found`);
    }
    return permission;
  }

  async remove(id: number): Promise<void> {
    await this.permissionRepo.delete(id);
  }
}