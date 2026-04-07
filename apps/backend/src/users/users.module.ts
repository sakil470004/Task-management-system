import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';

/**
 * Users Module
 * Provides user management services
 */
@Module({
  providers: [UsersService, PrismaService],
  exports: [UsersService], // Export so other modules can use this
})
export class UsersModule {}
