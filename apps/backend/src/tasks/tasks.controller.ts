import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  CreateTaskDto,
  UpdateTaskDto,
  ChangeTaskStatusDto,
  AssignTaskDto,
} from '../common/dtos/task.dto';

/**
 * Tasks Controller
 * Exposes task management endpoints with role-based access control
 */
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  /**
   * POST /tasks
   * Create a new task (admin only)
   */
  @Post()
  @Roles('ADMIN')
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user.id);
  }

  /**
   * GET /tasks
   * Get all tasks (admin sees all, user sees only assigned)
   */
  @Get()
  async getAll(@Request() req) {
    return this.tasksService.getAll(req.user.id, req.user.role);
  }

  /**
   * GET /tasks/:id
   * Get a single task by ID
   */
  @Get(':id')
  async getById(@Param('id') id: string, @Request() req) {
    return this.tasksService.getById(parseInt(id), req.user.id, req.user.role);
  }

  /**
   * PATCH /tasks/:id
   * Update a task (admin only)
   */
  @Patch(':id')
  @Roles('ADMIN')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.update(parseInt(id), updateTaskDto, req.user.id);
  }

  /**
   * DELETE /tasks/:id
   * Delete a task (admin only)
   */
  @Delete(':id')
  @Roles('ADMIN')
  async delete(@Param('id') id: string, @Request() req) {
    return this.tasksService.delete(parseInt(id), req.user.id);
  }

  /**
   * PATCH /tasks/:id/status
   * Change task status (admin can change any, user can change assigned)
   */
  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body() changeStatusDto: ChangeTaskStatusDto,
    @Request() req,
  ) {
    return this.tasksService.changeStatus(
      parseInt(id),
      changeStatusDto,
      req.user.id,
      req.user.role,
    );
  }

  /**
   * PATCH /tasks/:id/assign
   * Assign a task to a user (admin only)
   */
  @Patch(':id/assign')
  @Roles('ADMIN')
  async assign(
    @Param('id') id: string,
    @Body() assignTaskDto: AssignTaskDto,
    @Request() req,
  ) {
    return this.tasksService.assign(parseInt(id), assignTaskDto, req.user.id);
  }
}
