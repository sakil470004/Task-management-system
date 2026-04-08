import { IsIn } from 'class-validator';
import {
  TASK_STATUS_VALUES,
  type TaskStatus,
} from '../../entities/task.entity';

/**
 * Restricts status updates to known task state values.
 */
export class UpdateTaskStatusDto {
  @IsIn(TASK_STATUS_VALUES)
  status: TaskStatus;
}
