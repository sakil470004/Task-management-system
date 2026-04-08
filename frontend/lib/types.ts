/**
 * Represents the only status values used by the task workflow.
 */
export type TaskStatus = "Todo" | "In Progress" | "Done";

/**
 * Represents the two user roles supported by this mock UI.
 */
export type UserRole = "admin" | "user";

/**
 * Represents a user identity for auth and task assignment.
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

/**
 * Represents one task row shown in dashboards.
 */
export interface Task {
  id: number;
  title: string;
  assigneeId: number;
  assigneeName?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents one audit trail entry rendered in admin audit logs.
 */
export interface AuditLog {
  id: number;
  timestamp: string;
  userName: string;
  action: string;
  details: string;
}
