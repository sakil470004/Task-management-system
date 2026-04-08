import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogEntity } from '../entities/audit-log.entity';
import { TaskEntity } from '../entities/task.entity';
import { UserEntity } from '../entities/user.entity';
import { SeedService } from './seed.service';

/**
 * Contains database bootstrap helpers such as deterministic seed data.
 * SeedService automatically populates demo records on app startup if DB is empty.
 */
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TaskEntity, AuditLogEntity])],
  providers: [SeedService],
})
export class DatabaseModule {}
