/**
 * Task types for TypeScript type safety
 */

export type TaskStatus = 'PENDING' | 'PROCESSING' | 'DONE';

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  assignedUserId: number | null;
  createdById: number;
  createdAt: string;
  updatedAt: string;
  assignedUser?: {
    id: number;
    email: string;
  };
  createdBy?: {
    id: number;
    email: string;
  };
}

export interface AuditLog {
  id: number;
  timestamp: string;
  actor: {
    id: number;
    email: string;
    role: string;
  };
  actionType: string;
  targetEntity: string;
  targetId: number;
  beforeData?: any;
  afterData?: any;
  targetTask?: {
    id: number;
    title: string;
    status: TaskStatus;
  };
}
