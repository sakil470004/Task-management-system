import type { AuditLog, Task, User } from "@/lib/types";

/**
 * Provides known login identities for mock authentication.
 */
export const DUMMY_USERS: User[] = [
  {
    id: 1,
    name: "admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  },
  {
    id: 2,
    name: "jane",
    email: "jane@example.com",
    password: "password123",
    role: "user",
  },
  {
    id: 3,
    name: "john",
    email: "john@example.com",
    password: "password123",
    role: "user",
  },
];

/**
 * Seeds a mixed dataset that reflects both user and admin screenshots.
 */
export const DUMMY_TASKS: Task[] = [
  {
    id: 101,
    title: "Fix Bug #123",
    assigneeId: 2,
    status: "In Progress",
    createdAt: "2026-04-01T10:30:00.000Z",
    updatedAt: "2026-04-07T09:45:00.000Z",
  },
  {
    id: 102,
    title: "Write Documentation",
    assigneeId: 3,
    status: "Todo",
    createdAt: "2026-04-02T09:15:00.000Z",
    updatedAt: "2026-04-02T09:15:00.000Z",
  },
  {
    id: 103,
    title: "Design New UI",
    assigneeId: 2,
    status: "Done",
    createdAt: "2026-04-03T14:00:00.000Z",
    updatedAt: "2026-04-08T16:20:00.000Z",
  },
  {
    id: 104,
    title: "Code Review",
    assigneeId: 2,
    status: "Todo",
    createdAt: "2026-04-06T11:00:00.000Z",
    updatedAt: "2026-04-06T11:00:00.000Z",
  },
];

/**
 * Seeds baseline audit history so the admin page is populated immediately.
 */
export const DUMMY_AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    timestamp: "2026-04-08T10:30:00.000Z",
    userName: "admin",
    action: "Task Created",
    details: 'Task Created: "Write Documentation"',
  },
  {
    id: 2,
    timestamp: "2026-04-08T09:45:00.000Z",
    userName: "jane",
    action: "Status Changed",
    details: 'Status Changed: "Fix Bug #123" from "Todo" to "In Progress"',
  },
  {
    id: 3,
    timestamp: "2026-04-08T09:15:00.000Z",
    userName: "admin",
    action: "Task Assigned",
    details: 'Task Assigned: "Design New UI" to "jane"',
  },
  {
    id: 4,
    timestamp: "2026-04-07T14:00:00.000Z",
    userName: "john",
    action: "Task Deleted",
    details: 'Task Deleted: "Old Feature Task"',
  },
];
