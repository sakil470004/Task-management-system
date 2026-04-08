import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import type { UserRole } from '../entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

interface RequestUser {
  id: number;
  role: UserRole;
  name: string;
}

interface RequestWithUser extends Request {
  user: RequestUser;
}

/**
 * Exposes task endpoints for both user and admin dashboard flows.
 */
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getAll(@Req() request: RequestWithUser) {
    return this.tasksService.findAll(request.user);
  }

  @Post()
  @Roles('admin')
  create(@Req() request: RequestWithUser, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(request.user, dto);
  }

  @Patch(':id')
  @Roles('admin')
  update(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(request.user, taskId, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) taskId: number,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateStatus(request.user, taskId, dto.status);
  }

  @Delete(':id')
  @Roles('admin')
  delete(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) taskId: number,
  ) {
    return this.tasksService.delete(request.user, taskId);
  }
}
