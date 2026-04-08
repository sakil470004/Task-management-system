import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Validates login payloads before authentication logic is executed.
 */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
