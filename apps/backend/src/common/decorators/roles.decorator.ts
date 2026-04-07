import { SetMetadata } from '@nestjs/common';

/**
 * Roles Decorator
 * Used to protect routes based on user role
 * Example: @Roles('ADMIN')
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
