import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * DTO for user login request
 */
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

/**
 * DTO for login response with JWT token
 */
export class LoginResponseDto {
  accessToken: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}
