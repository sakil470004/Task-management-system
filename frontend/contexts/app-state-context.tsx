"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
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

const authListeners = new Set<() => void>();

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
  authReady: boolean;
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

/**
 * Reads raw persisted auth payload for stable external-store snapshots.
 */
function readPersistedAuthRaw(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(STORAGE_KEY);
}

/**
 * Converts raw storage payload into typed auth state.
 */
function parsePersistedAuth(raw: string | null): PersistedAuthState | null {
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
 * Persists auth and notifies subscribers to update in the same tick.
 */
function writePersistedAuth(state: PersistedAuthState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  authListeners.forEach((listener) => listener());
}

/**
 * Clears persisted auth and notifies subscribers to update immediately.
 */
function clearPersistedAuth(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  authListeners.forEach((listener) => listener());
}

/**
 * Subscribes to auth changes across this tab and storage changes from other tabs.
 */
function subscribeAuth(listener: () => void): () => void {
  authListeners.add(listener);

  const handleStorageChange = (event: StorageEvent): void => {
    if (event.key === STORAGE_KEY) {
      listener();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageChange);
  }

  return () => {
    authListeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorageChange);
    }
  };
}

/**
 * Indicates hydration completion without state-in-effect patterns.
 */
function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

/**
 * Provides global app state backed by real backend APIs.
 */
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useHydrated();
  const persistedAuthRaw = useSyncExternalStore(
    subscribeAuth,
    readPersistedAuthRaw,
    () => null,
  );
  const persistedAuth = useMemo(
    () => parsePersistedAuth(persistedAuthRaw),
    [persistedAuthRaw],
  );
  const authReady = isHydrated;
  const accessToken = persistedAuth?.accessToken ?? null;
  const currentUser = persistedAuth?.currentUser ?? null;
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

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
    if (!authReady) {
      return;
    }

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
        clearPersistedAuth();
        setTasks([]);
        setUsers([]);
        setAuditLogs([]);
      }
    })();
  }, [authReady, accessToken, currentUser, refreshTasks, refreshUsers, refreshAuditLogs]);

  /**
   * Authenticates against backend and bootstraps authenticated app data.
   */
  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    try {
      const response = await loginApi(email, password);
      writePersistedAuth({
        accessToken: response.accessToken,
        currentUser: response.user,
      });
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
    clearPersistedAuth();
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
      authReady,
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
    [authReady, users, tasks, auditLogs, currentUser, login, logout, updateTaskStatus, createTask, editTask, deleteTask],
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
