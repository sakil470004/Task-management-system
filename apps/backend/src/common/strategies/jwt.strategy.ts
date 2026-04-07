import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

/**
 * JWT Strategy for Passport
 * Extracts JWT from Authorization header and validates it
 * Attaches decoded user to request.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  /**
   * Validate JWT payload and attach user to request
   * This is called after JWT is successfully verified
   */
  async validate(payload: any) {
    // Fetch full user object from database
    const user = await this.usersService.findById(payload.sub);
    
    if (!user) {
      return null;
    }

    // Attach user to request
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
