import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email?: string;

  @IsString()
  phone?: string;

  @IsString()
  @MinLength(6)
  password: string;
}
