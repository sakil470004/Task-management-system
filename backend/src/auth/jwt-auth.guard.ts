import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Wraps Passport JWT strategy for Nest route guards.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
