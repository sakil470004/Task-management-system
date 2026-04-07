import { IsNotEmpty, IsString, IsInt, IsOptional, IsEnum } from 'class-validator';

/**
 * Task Status enum
 */
export enum TaskStatusEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
}

/**
 * DTO for creating a new task (admin only)
 */
export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsInt()
  assignedUserId?: number;
}

/**
 * DTO for updating a task (admin only)
 */
export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status?: TaskStatusEnum;
}

/**
 * DTO for changing task status
 */
export class ChangeTaskStatusDto {
  @IsNotEmpty()
  @IsEnum(TaskStatusEnum)
  status: TaskStatusEnum;
}

/**
 * DTO for assigning a task to a user
 */
export class AssignTaskDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;
}
