import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Role } from "src/entities/role.entity";
import { RolesService } from "./roles.service";
import { RolesController } from "./roles.controller";
import { Permission } from "src/entities/permission.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission])],
  providers: [RolesService],
  controllers: [RolesController],
  exports: [RolesService],
})
export class RolesModule {}