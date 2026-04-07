import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

/**
 * Audit Service
 * Logs all important actions (task creation, update, delete, status change, assignment)
 * Stores actor, action type, target entity, and before/after data
 */
@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create an audit log entry
   * @param actorId - ID of the user performing the action
   * @param actionType - Type of action (TASK_CREATED, TASK_UPDATED, etc.)
   * @param targetEntity - Entity being acted upon (e.g., "TASK")
   * @param targetId - ID of the entity
   * @param beforeData - State before the action (optional)
   * @param afterData - State after the action (optional)
   */
  async log(
    actorId: number,
    actionType: string,
    targetEntity: string,
    targetId: number,
    beforeData?: any,
    afterData?: any,
  ) {
    try {
      // Map string to AuditAction enum
      const validActions = ['TASK_CREATED', 'TASK_UPDATED', 'TASK_DELETED', 'TASK_STATUS_CHANGED', 'TASK_ASSIGNED'];
      const mappedAction = validActions.includes(actionType) ? actionType : 'TASK_UPDATED';

      const auditLog = await this.prisma.auditLog.create({
        data: {
          actorId,
          actionType: mappedAction as any,
          targetEntity,
          targetId,
          beforeData: beforeData ? beforeData : undefined,
          afterData: afterData ? afterData : undefined,
        },
      });

      // Fetch actor details for logging
      const actor = await this.prisma.user.findUnique({
        where: { id: actorId },
      });

      console.log(
        `📝 Audit Log: ${actionType} by ${actor?.email} on ${targetEntity}:${targetId}`,
      );

      return auditLog;
    } catch (error) {
      console.error('Error creating audit log:', error);
      throw error;
    }
  }

  /**
   * Get all audit logs (admin view)
   */
  async getAllLogs(limit: number = 100, offset: number = 0) {
    const logs = await this.prisma.auditLog.findMany({
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        targetTask: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      skip: offset,
    });

    return logs.map((log) => ({
      id: log.id,
      timestamp: log.timestamp,
      actor: log.actor,
      actionType: log.actionType,
      targetEntity: log.targetEntity,
      targetId: log.targetId,
      targetTask: log.targetTask,
      beforeData: log.beforeData,
      afterData: log.afterData,
    }));
  }

  /**
   * Get audit logs for a specific task
   */
  async getLogsForTask(taskId: number) {
    const logs = await this.prisma.auditLog.findMany({
      where: {
        targetId: taskId,
        targetEntity: 'TASK',
      },
      include: {
        actor: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return logs.map((log) => ({
      id: log.id,
      timestamp: log.timestamp,
      actor: log.actor,
      actionType: log.actionType,
      beforeData: log.beforeData,
      afterData: log.afterData,
    }));
  }
}
