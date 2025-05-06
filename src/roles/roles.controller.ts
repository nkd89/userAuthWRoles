import { Controller, Get, Post, Put, Delete, Param, Body } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { Role } from "src/entities/role.entity";

import { ApiTags, ApiOperation, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Creates a new role.
   * @param role The role data to create.
   * @returns The created role.
   */
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({ description: 'Role data', type: Role })
  @Post()
  async create(@Body() role: Role): Promise<Role> {
    return this.rolesService.create(role);
  }

  /**
   * Retrieves all roles.
   * @returns A list of roles.
   */
  @ApiOperation({ summary: 'Retrieve all roles' })
  @Get()
  async findAll(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  /**
   * Retrieves a role by its ID.
   * @param id The ID of the role to retrieve.
   * @returns The role with the specified ID or undefined if not found.
   */
  @ApiOperation({ summary: 'Retrieve a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: Number })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Role | undefined> {
    return this.rolesService.findOne(id);
  }

  /**
   * Updates a role by its ID.
   * @param id The ID of the role to update.
   * @param updatedRole The updated role data.
   * @returns The updated role.
   */
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: Number })
  @ApiBody({ description: 'Updated role data', type: Role })
  @Put(':id')
  async update(@Param('id') id: number, @Body() updatedRole: Partial<Role>): Promise<Role> {
    return this.rolesService.update(id, updatedRole);
  }

  /**
   * Deletes a role by its ID.
   * @param id The ID of the role to delete.
   */
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: Number })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.rolesService.remove(id);
  }

  /**
   * Assigns permissions to a role.
   * @param roleId The ID of the role to assign permissions to.
   * @param permissionNames The list of permission names to assign.
   * @returns The updated role with assigned permissions.
   */
  @ApiOperation({ summary: 'Assign permissions to a role' })
  @ApiParam({ name: 'id', description: 'Role ID', type: Number })
  @ApiBody({ description: 'List of permission names', type: [String] })
  @Post(':id/permissions')
  async assignPermissionsToRole(
    @Param('id') roleId: number,
    @Body() permissionNames: string[]
  ): Promise<Role> {
    return this.rolesService.assignPermissionsToRole(roleId, permissionNames);
  }

  /**
   * Removes permissions from a role.
   * @param roleId The ID of the role to remove permissions from.
   * @param permissionNames Optional list of permission names to remove. If not provided, all permissions will be removed.
   * @returns The updated role with permissions removed.
   */
  @ApiOperation({ summary: 'Remove permissions from a role' })
  @ApiParam({ name: 'id', description: 'Role ID', type: Number })
  @ApiBody({ description: 'Optional list of permission names to remove', type: [String], required: false })
  @Delete(':id/permissions')
  async removePermissionsFromRole(
    @Param('id') roleId: number,
    @Body() permissionNames?: string[]
  ): Promise<Role> {
    return this.rolesService.removePermissionsFromRole(roleId, permissionNames);
  }
}