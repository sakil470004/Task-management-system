import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  TASK_STATUS_VALUES,
  type TaskStatus,
} from '../../entities/task.entity';

/**
 * Allows partial updates for admin edit operations.
 */
export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsInt()
  assigneeId?: number;

  @IsOptional()
  @IsIn(TASK_STATUS_VALUES)
  status?: TaskStatus;
}
