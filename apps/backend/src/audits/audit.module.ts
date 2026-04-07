import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { PrismaService } from '../prisma.service';

/**
 * Audit Module
 * Handles audit logging and log viewing
 */
@Module({
  providers: [AuditService, PrismaService],
  controllers: [AuditController],
  exports: [AuditService], // Export so other modules can use this
})
export class AuditModule {}
