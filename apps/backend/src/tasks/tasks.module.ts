import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from '../prisma.service';
import { AuditModule } from '../audits/audit.module';

/**
 * Tasks Module
 * Handles task management and CRUD operations
 */
@Module({
  imports: [AuditModule],
  providers: [TasksService, PrismaService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
