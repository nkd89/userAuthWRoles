import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Role } from './role.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(()=> String, { nullable: true })
  @Column({ nullable: false })
  first_name: string;

  @Field(()=> String, { nullable: true })
  @Column({ nullable: false })
  last_name: string;

  @Field(()=> String, { nullable: true })
  @Column({ nullable: true })
  avatar: string;

  @Field(()=> String, { nullable: true })
  @Column({ unique: true, nullable: true })
  phone: string;

  @Field(()=> String, { nullable: true })
  @Column({ unique: true, nullable: true })
  email: string;

  @Field(()=> String, { nullable: true })
  @Column({ unique: true, nullable: true })
  telegram_id: number;

  @Column()
  password_hash: string;

  @Field(() => Role)
  @ManyToOne(() => Role, { eager: true})
  role: Role;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password_hash && !this.password_hash.startsWith('$2b$')) {
      this.password_hash = await bcrypt.hash(this.password_hash, 10);
    }
  }
}
