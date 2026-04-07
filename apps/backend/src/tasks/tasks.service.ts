import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AuditService } from '../audits/audit.service';
import { CreateTaskDto, UpdateTaskDto, ChangeTaskStatusDto, AssignTaskDto } from '../common/dtos/task.dto';

/**
 * Tasks Service
 * Handles task CRUD operations with automatic audit logging
 * - Create, read, update, delete tasks
 * - Assign tasks to users
 * - Update task status
 */
@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  /**
   * Create a new task (admin only)
   * Logs: TASK_CREATED audit event
   */
  async create(createTaskDto: CreateTaskDto, adminId: number) {
    const { title, description, assignedUserId } = createTaskDto;

    // If assignedUserId provided, verify user exists
    if (assignedUserId) {
      const user = await this.prisma.user.findUnique({
        where: { id: assignedUserId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${assignedUserId} not found`);
      }
    }

    // Create the task
    const task = await this.prisma.task.create({
      data: {
        title,
        description,
        status: 'PENDING',
        createdById: adminId,
        assignedUserId: assignedUserId || null,
      },
    });

    // Log the action
    await this.auditService.log(
      adminId,
      'TASK_CREATED',
      'TASK',
      task.id,
      null,
      {
        title: task.title,
        description: task.description,
        status: task.status,
        assignedUserId: task.assignedUserId,
      },
    );

    return task;
  }

  /**
   * Get all tasks
   * - Admin sees all tasks
   * - User sees only assigned tasks
   */
  async getAll(userId: number, userRole: string) {
    if (userRole === 'ADMIN') {
      // Admin sees all tasks
      return this.prisma.task.findMany({
        include: {
          assignedUser: {
            select: {
              id: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // Regular user sees only their assigned tasks
      return this.prisma.task.findMany({
        where: {
          assignedUserId: userId,
        },
        include: {
          assignedUser: {
            select: {
              id: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }
  }

  /**
   * Get a single task by ID
   * Verify user has access to this task
   */
  async getById(id: number, userId: number, userRole: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignedUser: {
          select: {
            id: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // User can only see tasks assigned to them
    if (userRole !== 'ADMIN' && task.assignedUserId !== userId) {
      throw new ForbiddenException('You do not have access to this task');
    }

    return task;
  }

  /**
   * Update a task (admin only)
   * Logs: TASK_UPDATED audit event
   */
  async update(id: number, updateTaskDto: UpdateTaskDto, adminId: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Store before state for audit
    const beforeData = {
      title: task.title,
      description: task.description,
      status: task.status,
      assignedUserId: task.assignedUserId,
    };

    // Update the task
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
      include: {
        assignedUser: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    // Store after state for audit
    const afterData = {
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      assignedUserId: updatedTask.assignedUserId,
    };

    // Log the action
    await this.auditService.log(
      adminId,
      'TASK_UPDATED',
      'TASK',
      id,
      beforeData,
      afterData,
    );

    return updatedTask;
  }

  /**
   * Delete a task (admin only)
   * Logs: TASK_DELETED audit event
   */
  async delete(id: number, adminId: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Store task data before deletion
    const beforeData = {
      title: task.title,
      description: task.description,
      status: task.status,
      assignedUserId: task.assignedUserId,
    };

    // Delete the task
    await this.prisma.task.delete({ where: { id } });

    // Log the action
    await this.auditService.log(
      adminId,
      'TASK_DELETED',
      'TASK',
      id,
      beforeData,
      null,
    );

    return { message: 'Task deleted successfully' };
  }

  /**
   * Change task status
   * - Admin can change any task status
   * - User can only change status of assigned tasks
   */
  async changeStatus(
    id: number,
    changeStatusDto: ChangeTaskStatusDto,
    userId: number,
    userRole: string,
  ) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Users can only change status of assigned tasks
    if (userRole !== 'ADMIN' && task.assignedUserId !== userId) {
      throw new ForbiddenException(
        'You can only update status of tasks assigned to you',
      );
    }

    const beforeStatus = task.status;

    // Update status
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        status: changeStatusDto.status,
      },
    });

    // Log the action
    await this.auditService.log(
      userId,
      'TASK_STATUS_CHANGED',
      'TASK',
      id,
      { status: beforeStatus },
      { status: updatedTask.status },
    );

    return updatedTask;
  }

  /**
   * Assign a task to a user (admin only)
   * Logs: TASK_ASSIGNED audit event
   */
  async assign(id: number, assignTaskDto: AssignTaskDto, adminId: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    // Verify the user exists
    const user = await this.prisma.user.findUnique({
      where: { id: assignTaskDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `User with ID ${assignTaskDto.userId} not found`,
      );
    }

    const beforeAssignee = task.assignedUserId;

    // Assign the task
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
        assignedUserId: assignTaskDto.userId,
      },
      include: {
        assignedUser: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    // Log the action
    await this.auditService.log(
      adminId,
      'TASK_ASSIGNED',
      'TASK',
      id,
      { assignedUserId: beforeAssignee },
      { assignedUserId: updatedTask.assignedUserId, assignedTo: updatedTask.assignedUser?.email },
    );

    return updatedTask;
  }
}
