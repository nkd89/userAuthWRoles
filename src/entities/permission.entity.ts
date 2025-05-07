import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { ManyToMany } from "typeorm";

@ObjectType()
@Entity('permissions')
export class Permission {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: false })
  @Column({ unique: true, nullable: false })
  name: string;

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[];
}