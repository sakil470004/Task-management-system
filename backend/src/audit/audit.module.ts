import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from '../entities/audit-log.entity';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

/**
 * Bundles audit persistence and query endpoints.
 */
@Module({
  imports: [TypeOrmModule.forFeature([AuditLogEntity])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService, TypeOrmModule],
})
export class AuditModule {}
