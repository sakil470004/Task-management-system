"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createTaskApi,
  deleteTaskApi,
  editTaskApi,
  getAuditLogsApi,
  getTasksApi,
  getUsersApi,
  loginApi,
  updateTaskStatusApi,
} from "@/lib/api-client";
import type { AuditLog, Task, TaskStatus, User } from "@/lib/types";

const STORAGE_KEY = "task-mgmt-auth";

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
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  updateTaskStatus: (taskId: number, nextStatus: TaskStatus) => Promise<void>;
  createTask: (payload: UpdateTaskPayload) => Promise<void>;
  editTask: (taskId: number, payload: UpdateTaskPayload) => Promise<void>;
  deleteTask: (taskId: number) => Promise<void>;
}

interface PersistedAuthState {
  accessToken: string;
  currentUser: User;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

/**
 * Safely restores auth state so browser refresh does not force re-login.
 */
function loadPersistedAuthState(): PersistedAuthState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedAuthState;
  } catch {
    return null;
  }
}

/**
 * Provides global app state backed by real backend APIs.
 */
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [bootstrapAuth] = useState<PersistedAuthState | null>(() => loadPersistedAuthState());
  const [accessToken, setAccessToken] = useState<string | null>(
    bootstrapAuth?.accessToken ?? null,
  );
  const [currentUser, setCurrentUser] = useState<User | null>(
    bootstrapAuth?.currentUser ?? null,
  );
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!accessToken || !currentUser) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const state: PersistedAuthState = {
      accessToken,
      currentUser,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [accessToken, currentUser]);

  /**
   * Fetches task list for the currently authenticated principal.
   */
  const refreshTasks = useCallback(async (token: string) => {
    const rows = await getTasksApi(token);
    setTasks(rows);
  }, []);

  /**
   * Fetches admin-only user directory used for assignment controls.
   */
  const refreshUsers = useCallback(async (token: string, role: User["role"]) => {
    if (role !== "admin") {
      setUsers([]);
      return;
    }

    const rows = await getUsersApi(token);
    setUsers(rows);
  }, []);

  /**
   * Fetches admin-only audit rows shown in the audit page.
   */
  const refreshAuditLogs = useCallback(async (token: string, role: User["role"]) => {
    if (role !== "admin") {
      setAuditLogs([]);
      return;
    }

    const rows = await getAuditLogsApi(token);
    setAuditLogs(rows);
  }, []);

  useEffect(() => {
    if (!accessToken || !currentUser) {
      return;
    }

    void (async () => {
      try {
        await Promise.all([
          refreshTasks(accessToken),
          refreshUsers(accessToken, currentUser.role),
          refreshAuditLogs(accessToken, currentUser.role),
        ]);
      } catch {
        setAccessToken(null);
        setCurrentUser(null);
        setTasks([]);
        setUsers([]);
        setAuditLogs([]);
      }
    })();
  }, [accessToken, currentUser, refreshTasks, refreshUsers, refreshAuditLogs]);

  /**
   * Authenticates against backend and bootstraps authenticated app data.
   */
  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await loginApi(email, password);
      setAccessToken(response.accessToken);
      setCurrentUser(response.user);
      return { success: true };
    } catch {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }
  }, []);

  /**
   * Clears in-memory and persisted auth state for a clean logout flow.
   */
  const logout = useCallback(() => {
    setAccessToken(null);
    setCurrentUser(null);
    setTasks([]);
    setUsers([]);
    setAuditLogs([]);
  }, []);

  /**
   * Updates task status through API, then refreshes dependent views.
   */
  const updateTaskStatus = useCallback(
    async (taskId: number, nextStatus: TaskStatus) => {
      if (!accessToken || !currentUser) {
        return;
      }

      await updateTaskStatusApi(accessToken, taskId, nextStatus);
      await refreshTasks(accessToken);
      await refreshAuditLogs(accessToken, currentUser.role);
    },
    [accessToken, currentUser, refreshTasks, refreshAuditLogs],
  );

  /**
   * Creates a task via backend and then refreshes task/audit data.
   */
  const createTask = useCallback(
    async (payload: UpdateTaskPayload) => {
      if (!accessToken || !currentUser) {
        return;
      }

      await createTaskApi(accessToken, payload);
      await refreshTasks(accessToken);
      await refreshAuditLogs(accessToken, currentUser.role);
    },
    [accessToken, currentUser, refreshTasks, refreshAuditLogs],
  );

  /**
   * Edits task data via backend and then refreshes task/audit data.
   */
  const editTask = useCallback(
    async (taskId: number, payload: UpdateTaskPayload) => {
      if (!accessToken || !currentUser) {
        return;
      }

      await editTaskApi(accessToken, taskId, payload);
      await refreshTasks(accessToken);
      await refreshAuditLogs(accessToken, currentUser.role);
    },
    [accessToken, currentUser, refreshTasks, refreshAuditLogs],
  );

  /**
   * Deletes task via backend and then refreshes task/audit data.
   */
  const deleteTask = useCallback(
    async (taskId: number) => {
      if (!accessToken || !currentUser) {
        return;
      }

      await deleteTaskApi(accessToken, taskId);
      await refreshTasks(accessToken);
      await refreshAuditLogs(accessToken, currentUser.role);
    },
    [accessToken, currentUser, refreshTasks, refreshAuditLogs],
  );

  const value = useMemo<AppStateContextValue>(
    () => ({
      users,
      tasks,
      auditLogs,
      currentUser,
      login,
      logout,
      updateTaskStatus,
      createTask,
      editTask,
      deleteTask,
    }),
    [users, tasks, auditLogs, currentUser, login, logout, updateTaskStatus, createTask, editTask, deleteTask],
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
