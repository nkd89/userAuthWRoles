import { Field, ID } from "@nestjs/graphql";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Permission } from "./permission.entity";
import { User } from "./user.entity";

@Entity('roles')
export class Role {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String, { nullable: false })
  @Column({ unique: true, nullable: false })
  name: string;

  @Field(() => [Permission])
  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable()
  permissions: Permission[];

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}