import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

/**
 * Represents immutable history entries for critical auth/task actions.
 */
@Entity({ name: 'audit_logs' })
export class AuditLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number | null;

  @ManyToOne(() => UserEntity, (user) => user.auditLogs, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity | null;

  @Column({ length: 120 })
  action: string;

  @Column({ type: 'text' })
  details: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
