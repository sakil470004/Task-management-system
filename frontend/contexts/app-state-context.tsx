"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DUMMY_AUDIT_LOGS, DUMMY_TASKS, DUMMY_USERS } from "@/lib/dummy-data";
import type { AuditLog, Task, TaskStatus, User } from "@/lib/types";

const STORAGE_KEY = "task-mgmt-frontend-state";

interface LoginResult {
  success: boolean;
  message?: string;
}

interface UpdateTaskPayload {
  title: string;
  assigneeId: number;
  status: TaskStatus;
}

interface AppStateContextValue {
  users: User[];
  tasks: Task[];
  auditLogs: AuditLog[];
  currentUser: User | null;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
  updateTaskStatus: (taskId: number, nextStatus: TaskStatus) => void;
  createTask: (payload: UpdateTaskPayload) => void;
  editTask: (taskId: number, payload: UpdateTaskPayload) => void;
  deleteTask: (taskId: number) => void;
}

interface PersistedState {
  currentUser: User | null;
  tasks: Task[];
  auditLogs: AuditLog[];
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

/**
 * Formats an ISO date in a compact format that resembles the screenshot tables.
 */
function toTableDateTime(isoValue: string): string {
  const parsed = new Date(isoValue);
  return parsed.toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Safely loads persisted mock state to preserve in-progress UI demos on refresh.
 */
function loadPersistedState(): PersistedState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as PersistedState;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Provides one global in-memory application store for mock frontend flows.
 */
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [bootstrapState] = useState<PersistedState | null>(() => loadPersistedState());
  const [currentUser, setCurrentUser] = useState<User | null>(
    bootstrapState?.currentUser ?? null,
  );
  const [tasks, setTasks] = useState<Task[]>(bootstrapState?.tasks ?? DUMMY_TASKS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(
    bootstrapState?.auditLogs ?? DUMMY_AUDIT_LOGS,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stateToPersist: PersistedState = {
      currentUser,
      tasks,
      auditLogs,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
  }, [currentUser, tasks, auditLogs]);

  /**
   * Prepends a new audit event so the latest action appears first in the table.
   */
  const recordAudit = useCallback(
    (action: string, details: string, actorName?: string) => {
      const author = actorName ?? currentUser?.name ?? "system";

      setAuditLogs((previousLogs) => {
        const nextLog: AuditLog = {
          id: previousLogs.length ? previousLogs[0].id + 1 : 1,
          timestamp: new Date().toISOString(),
          userName: author,
          action,
          details,
        };
        return [nextLog, ...previousLogs];
      });
    },
    [currentUser?.name],
  );

  /**
   * Authenticates using local dummy users only for this frontend-first phase.
   */
  const login = useCallback((email: string, password: string): LoginResult => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = DUMMY_USERS.find(
      (candidate) =>
        candidate.email.toLowerCase() === normalizedEmail &&
        candidate.password === password,
    );

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    setCurrentUser(user);
    recordAudit("User Login", `User Login: \"${user.name}\"`, user.name);

    return {
      success: true,
    };
  }, [recordAudit]);

  /**
   * Clears active session while keeping task and audit demo state intact.
   */
  const logout = useCallback(() => {
    if (currentUser) {
      recordAudit("User Logout", `User Logout: \"${currentUser.name}\"`);
    }

    setCurrentUser(null);
  }, [currentUser, recordAudit]);

  /**
   * Updates task status and records a detailed status transition in audit logs.
   */
  const updateTaskStatus = useCallback(
    (taskId: number, nextStatus: TaskStatus) => {
      setTasks((previousTasks) => {
        const sourceTask = previousTasks.find((item) => item.id === taskId);
        if (!sourceTask || sourceTask.status === nextStatus) {
          return previousTasks;
        }

        const updatedTasks = previousTasks.map((item) => {
          if (item.id !== taskId) {
            return item;
          }

          return {
            ...item,
            status: nextStatus,
            updatedAt: new Date().toISOString(),
          };
        });

        recordAudit(
          "Status Changed",
          `Status Changed: \"${sourceTask.title}\" from \"${sourceTask.status}\" to \"${nextStatus}\"`,
        );

        return updatedTasks;
      });
    },
    [recordAudit],
  );

  /**
   * Creates a new task in-memory for admin dashboard demos.
   */
  const createTask = useCallback(
    (payload: UpdateTaskPayload) => {
      const assignee = DUMMY_USERS.find((user) => user.id === payload.assigneeId);
      if (!assignee) {
        return;
      }

      setTasks((previousTasks) => {
        const nextId = previousTasks.length
          ? Math.max(...previousTasks.map((task) => task.id)) + 1
          : 1;

        const now = new Date().toISOString();
        const nextTask: Task = {
          id: nextId,
          title: payload.title,
          assigneeId: payload.assigneeId,
          status: payload.status,
          createdAt: now,
          updatedAt: now,
        };

        recordAudit(
          "Task Created",
          `Task Created: \"${payload.title}\" assigned to \"${assignee.name}\"`,
        );

        return [nextTask, ...previousTasks];
      });
    },
    [recordAudit],
  );

  /**
   * Edits an existing task and keeps audit history explicit for traceability.
   */
  const editTask = useCallback(
    (taskId: number, payload: UpdateTaskPayload) => {
      const assignee = DUMMY_USERS.find((user) => user.id === payload.assigneeId);
      if (!assignee) {
        return;
      }

      setTasks((previousTasks) => {
        const sourceTask = previousTasks.find((item) => item.id === taskId);
        if (!sourceTask) {
          return previousTasks;
        }

        const updatedTasks = previousTasks.map((item) => {
          if (item.id !== taskId) {
            return item;
          }

          return {
            ...item,
            title: payload.title,
            assigneeId: payload.assigneeId,
            status: payload.status,
            updatedAt: new Date().toISOString(),
          };
        });

        recordAudit(
          "Task Edited",
          `Task Edited: \"${sourceTask.title}\" updated to \"${payload.title}\" for \"${assignee.name}\"`,
        );

        return updatedTasks;
      });
    },
    [recordAudit],
  );

  /**
   * Removes a task from the mock store and records the deletion event.
   */
  const deleteTask = useCallback(
    (taskId: number) => {
      setTasks((previousTasks) => {
        const sourceTask = previousTasks.find((item) => item.id === taskId);
        if (!sourceTask) {
          return previousTasks;
        }

        recordAudit("Task Deleted", `Task Deleted: \"${sourceTask.title}\"`);
        return previousTasks.filter((item) => item.id !== taskId);
      });
    },
    [recordAudit],
  );

  const value = useMemo<AppStateContextValue>(
    () => ({
      users: DUMMY_USERS,
      tasks,
      auditLogs: auditLogs.map((item) => ({
        ...item,
        timestamp: toTableDateTime(item.timestamp),
      })),
      currentUser,
      login,
      logout,
      updateTaskStatus,
      createTask,
      editTask,
      deleteTask,
    }),
    [tasks, auditLogs, currentUser, login, logout, updateTaskStatus, createTask, editTask, deleteTask],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

/**
 * Exposes typed access to global app state and actions.
 */
export function useAppStateContext(): AppStateContextValue {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppStateContext must be used inside AppStateProvider.");
  }

  return context;
}
