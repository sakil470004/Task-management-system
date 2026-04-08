import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditService } from '../audit/audit.service';
import { TaskEntity, type TaskStatus } from '../entities/task.entity';
import { UserEntity, type UserRole } from '../entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

interface Actor {
  id: number;
  role: UserRole;
  name: string;
}

/**
 * Implements task querying and mutation flows with audit logging.
 */
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly tasksRepository: Repository<TaskEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly auditService: AuditService,
  ) {}

  async findAll(actor: Actor) {
    const where = actor.role === 'admin' ? {} : { assigneeId: actor.id };

    const rows = await this.tasksRepository.find({
      where,
      relations: {
        assignee: true,
      },
      order: {
        updatedAt: 'DESC',
        id: 'DESC',
      },
    });

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      assigneeId: row.assigneeId,
      assigneeName: row.assignee?.name ?? 'Unknown',
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  async create(actor: Actor, dto: CreateTaskDto) {
    const assignee = await this.usersRepository.findOne({
      where: {
        id: dto.assigneeId,
      },
    });

    if (!assignee) {
      throw new NotFoundException('Assignee user does not exist.');
    }

    const entity = this.tasksRepository.create({
      title: dto.title,
      assigneeId: dto.assigneeId,
      status: dto.status,
    });

    const saved = await this.tasksRepository.save(entity);

    await this.auditService.log(
      actor.id,
      'Task Created',
      `Task Created: "${saved.title}" assigned to "${assignee.name}"`,
    );

    return saved;
  }

  async update(actor: Actor, taskId: number, dto: UpdateTaskDto) {
    const existing = await this.tasksRepository.findOne({
      where: {
        id: taskId,
      },
      relations: {
        assignee: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Task not found.');
    }

    const previousTitle = existing.title;
    const previousAssigneeName = existing.assignee?.name ?? 'Unknown';
    let nextAssigneeName = previousAssigneeName;

    const patch: Partial<TaskEntity> = {};

    if (
      dto.assigneeId !== undefined &&
      dto.assigneeId !== existing.assigneeId
    ) {
      const assignee = await this.usersRepository.findOne({
        where: { id: dto.assigneeId },
      });

      if (!assignee) {
        throw new NotFoundException('Assignee user does not exist.');
      }

      patch.assigneeId = dto.assigneeId;
      nextAssigneeName = assignee.name;
    }

    if (dto.title !== undefined) {
      patch.title = dto.title;
    }

    if (dto.status !== undefined) {
      patch.status = dto.status;
    }

    if (Object.keys(patch).length === 0) {
      return existing;
    }

    await this.tasksRepository.update({ id: taskId }, patch);

    const updated = await this.tasksRepository.findOne({
      where: {
        id: taskId,
      },
      relations: {
        assignee: true,
      },
    });

    if (!updated) {
      throw new NotFoundException('Task not found after update.');
    }

    if (updated.assignee?.name) {
      nextAssigneeName = updated.assignee.name;
    }

    await this.auditService.log(
      actor.id,
      'Task Edited',
      `Task Edited: "${previousTitle}" -> "${updated.title}", assignee "${previousAssigneeName}" -> "${nextAssigneeName}"`,
    );

    return updated;
  }

  async updateStatus(actor: Actor, taskId: number, nextStatus: TaskStatus) {
    const existing = await this.tasksRepository.findOne({
      where: {
        id: taskId,
      },
    });

    if (!existing) {
      throw new NotFoundException('Task not found.');
    }

    if (actor.role !== 'admin' && existing.assigneeId !== actor.id) {
      throw new ForbiddenException(
        'Users can only update their own task statuses.',
      );
    }

    const previousStatus = existing.status;
    existing.status = nextStatus;

    const updated = await this.tasksRepository.save(existing);

    await this.auditService.log(
      actor.id,
      'Status Changed',
      `Status Changed: "${existing.title}" from "${previousStatus}" to "${nextStatus}"`,
    );

    return updated;
  }

  async delete(actor: Actor, taskId: number) {
    const existing = await this.tasksRepository.findOne({
      where: {
        id: taskId,
      },
    });

    if (!existing) {
      throw new NotFoundException('Task not found.');
    }

    await this.tasksRepository.remove(existing);

    await this.auditService.log(
      actor.id,
      'Task Deleted',
      `Task Deleted: "${existing.title}"`,
    );

    return {
      success: true,
    };
  }
}
