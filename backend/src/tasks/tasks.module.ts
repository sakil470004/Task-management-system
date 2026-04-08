import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from '../audit/audit.module';
import { TaskEntity } from '../entities/task.entity';
import { UserEntity } from '../entities/user.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

/**
 * Bundles task endpoints with repositories and audit dependency.
 */
@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, UserEntity]), AuditModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
