import { IsIn, IsInt, IsString, MaxLength, MinLength } from 'class-validator';
import {
  TASK_STATUS_VALUES,
  type TaskStatus,
} from '../../entities/task.entity';

/**
 * Validates task creation payload used by admin workflow.
 */
export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title: string;

  @IsInt()
  assigneeId: number;

  @IsIn(TASK_STATUS_VALUES)
  status: TaskStatus;
}
