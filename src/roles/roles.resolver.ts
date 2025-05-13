import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { Role } from 'src/entities/role.entity';

@Resolver(() => Role)
export class RolesResolver {
  constructor(private readonly rolesService: RolesService) {}

  @Mutation(() => Role, { description: 'Create a new role' })
  async createRole(@Args('name', { type: () => String }) name: string): Promise<Role> {
    return this.rolesService.create({ name });
  }

  @Query(() => [Role], { description: 'Retrieve all roles' })
  async findAllRoles(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Query(() => Role, { description: 'Retrieve a role by ID', nullable: true })
  async findRoleById(@Args('id', { type: () => Int }) id: number): Promise<Role | undefined> {
    return this.rolesService.findOne(id);
  }

  @Mutation(() => Role, { description: 'Update a role by ID' })
  async updateRole(
    @Args('id', { type: () => Int }) id: number,
    @Args('role') role: string,
  ): Promise<Role> {
    return this.rolesService.update(id, { name: role });
  }

  @Mutation(() => Boolean, { description: 'Delete a role by ID' })
  async removeRole(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    await this.rolesService.remove(id);
    return true;
  }

  @Mutation(() => Role, { description: 'Assign permissions to a role' })
  async assignPermissionsToRole(
    @Args('id', { type: () => Int }) roleId: number,
    @Args('permissionNames', { type: () => [String] }) permissionNames: string[],
  ): Promise<Role> {
    return this.rolesService.assignPermissionsToRole(roleId, permissionNames);
  }

  @Mutation(() => Role, { description: 'Remove permissions from a role' })
  async removePermissionsFromRole(
    @Args('id', { type: () => Int }) roleId: number,
    @Args('permissionNames', { type: () => [String], nullable: true }) permissionNames?: string[],
  ): Promise<Role> {
    return this.rolesService.removePermissionsFromRole(roleId, permissionNames);
  }
}
