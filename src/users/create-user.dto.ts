import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ description: 'Last name of the user' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ description: 'Email address of the user', required: false })
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Phone number of the user', required: false })
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Password for the user account', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
