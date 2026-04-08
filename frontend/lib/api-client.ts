import type { AuditLog, Task, TaskStatus, User } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface TaskMutationPayload {
  title: string;
  assigneeId: number;
  status: TaskStatus;
}

interface RequestOptions extends RequestInit {
  token?: string | null;
}

/**
 * Reads HTTP responses safely and throws a useful error for UI feedback.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  headers.set("Content-Type", "application/json");

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/**
 * Authenticates a user and returns bearer token plus profile metadata.
 */
export function loginApi(email: string, password: string) {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Fetches task records for current user context from backend.
 */
export function getTasksApi(token: string) {
  return request<Task[]>("/tasks", {
    method: "GET",
    token,
  });
}

/**
 * Updates one task status and returns updated row from backend.
 */
export function updateTaskStatusApi(token: string, taskId: number, status: TaskStatus) {
  return request<Task>(`/tasks/${taskId}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });
}

/**
 * Creates a new task through admin API endpoint.
 */
export function createTaskApi(token: string, payload: TaskMutationPayload) {
  return request<Task>("/tasks", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

/**
 * Updates task fields through admin API endpoint.
 */
export function editTaskApi(token: string, taskId: number, payload: TaskMutationPayload) {
  return request<Task>(`/tasks/${taskId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

/**
 * Deletes a task by id through admin API endpoint.
 */
export function deleteTaskApi(token: string, taskId: number) {
  return request<{ success: boolean }>(`/tasks/${taskId}`, {
    method: "DELETE",
    token,
  });
}

/**
 * Fetches admin-only user directory for assignment dropdowns.
 */
export function getUsersApi(token: string) {
  return request<User[]>("/users", {
    method: "GET",
    token,
  });
}

/**
 * Fetches admin-only audit logs table data.
 */
export function getAuditLogsApi(token: string) {
  return request<AuditLog[]>("/audit-logs", {
    method: "GET",
    token,
  });
}
