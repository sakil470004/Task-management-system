import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuditLogEntity } from './audit-log.entity';
import { TaskEntity } from './task.entity';

export type UserRole = 'admin' | 'user';

/**
 * Represents a platform identity used for authentication and task ownership.
 */
@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 20, default: 'user' })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => TaskEntity, (task) => task.assignee)
  assignedTasks: TaskEntity[];

  @OneToMany(() => AuditLogEntity, (auditLog) => auditLog.user)
  auditLogs: AuditLogEntity[];
}
