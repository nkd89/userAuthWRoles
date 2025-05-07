import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail } from 'class-validator';

@InputType()
export class UpdateUserDto {
  @ApiProperty({ description: 'First name of the user', required: false })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  first_name?: string;

  @ApiProperty({ description: 'Last name of the user', required: false })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ description: 'Email address of the user', required: false })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Phone number of the user', required: false })
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;
}
