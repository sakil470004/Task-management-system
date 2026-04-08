import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../../entities/user.entity';

export const ROLES_KEY = 'roles';

/**
 * Marks a route handler with the minimum role list allowed to execute it.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
