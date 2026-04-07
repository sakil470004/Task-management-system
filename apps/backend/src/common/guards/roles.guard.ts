import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Roles Guard
 * Checks if the authenticated user has the required role to access a route
 * Used with @Roles('ADMIN') decorator
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from the route metadata
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

    // If no roles are specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get the request object and the user from it
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user exists
    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    // Check if user role matches any of the allowed roles
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`User role "${user.role}" does not have access to this resource`);
    }

    return true;
  }
}
