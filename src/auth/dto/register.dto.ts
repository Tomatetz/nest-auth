import { IsPasswordContainsSymbols } from '@common/decorators';
import { IsEmail, IsString, MinLength, Validate } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @Validate(IsPasswordContainsSymbols)
  password: string;
}
