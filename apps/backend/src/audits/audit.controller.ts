import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

/**
 * Audit Controller
 * Exposes audit log endpoints (admin read-only)
 */
@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AuditController {
  constructor(private auditService: AuditService) {}

  /**
   * GET /audit-logs
   * Get all audit logs (admin only)
   * Query params: limit (default 100), offset (default 0)
   */
  @Get()
  async getAllLogs(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const parsedLimit = limit ? parseInt(limit) : 100;
    const parsedOffset = offset ? parseInt(offset) : 0;

    return this.auditService.getAllLogs(parsedLimit, parsedOffset);
  }

  /**
   * GET /audit-logs/task/:taskId
   * Get audit logs for a specific task
   */
  @Get('task/:taskId')
  async getTaskLogs(@Param('taskId') taskId: string) {
    return this.auditService.getLogsForTask(parseInt(taskId));
  }
}
