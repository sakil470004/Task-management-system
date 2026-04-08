import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { AuditLogEntity } from '../entities/audit-log.entity';
import { TaskEntity } from '../entities/task.entity';
import { UserEntity } from '../entities/user.entity';

/**
 * Seeds deterministic demo records so fresh environments can be tested instantly.
 */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
    @InjectRepository(AuditLogEntity)
    private readonly auditLogsRepository: Repository<AuditLogEntity>,
  ) {}

  async onApplicationBootstrap() {
    const existingUsersCount = await this.usersRepository.count();
    if (existingUsersCount > 0) {
      return;
    }

    const passwordHash = await hash('password123', 10);

    const admin = this.usersRepository.create({
      name: 'admin',
      email: 'admin@example.com',
      passwordHash,
      role: 'admin',
    });

    const jane = this.usersRepository.create({
      name: 'jane',
      email: 'jane@example.com',
      passwordHash,
      role: 'user',
    });

    const john = this.usersRepository.create({
      name: 'john',
      email: 'john@example.com',
      passwordHash,
      role: 'user',
    });

    const savedUsers = await this.usersRepository.save([admin, jane, john]);
    const [savedAdmin, savedJane, savedJohn] = savedUsers;

    const tasks = this.tasksRepository.create([
      {
        title: 'Fix Bug #123',
        assigneeId: savedJane.id,
        status: 'In Progress',
      },
      {
        title: 'Write Documentation',
        assigneeId: savedJohn.id,
        status: 'Todo',
      },
      {
        title: 'Design New UI',
        assigneeId: savedJane.id,
        status: 'Done',
      },
      {
        title: 'Code Review',
        assigneeId: savedJane.id,
        status: 'Todo',
      },
    ]);

    await this.tasksRepository.save(tasks);

    const auditEntries = this.auditLogsRepository.create([
      {
        userId: savedAdmin.id,
        action: 'Task Created',
        details: 'Task Created: "Write Documentation"',
      },
      {
        userId: savedJane.id,
        action: 'Status Changed',
        details: 'Status Changed: "Fix Bug #123" from "Todo" to "In Progress"',
      },
      {
        userId: savedAdmin.id,
        action: 'Task Assigned',
        details: 'Task Assigned: "Design New UI" to "jane"',
      },
      {
        userId: savedJohn.id,
        action: 'Task Deleted',
        details: 'Task Deleted: "Old Feature Task"',
      },
    ]);

    await this.auditLogsRepository.save(auditEntries);

    this.logger.log('Seeded demo users, tasks, and audit logs.');
  }
}
