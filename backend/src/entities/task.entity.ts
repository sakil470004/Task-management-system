import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

export const TASK_STATUS_VALUES = ['Todo', 'In Progress', 'Done'] as const;
export type TaskStatus = (typeof TASK_STATUS_VALUES)[number];

/**
 * Represents one work item managed by user and admin dashboards.
 */
@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ name: 'assignee_id' })
  assigneeId: number;

  @ManyToOne(() => UserEntity, (user) => user.assignedTasks, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'assignee_id' })
  assignee: UserEntity;

  @Column({ type: 'varchar', length: 20, default: 'Todo' })
  status: TaskStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
