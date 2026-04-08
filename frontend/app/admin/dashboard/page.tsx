"use client";

import { useMemo, useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { TaskFormModal } from "@/components/task-form-modal";
import { useAppState } from "@/hooks/use-app-state";
import type { Task } from "@/lib/types";

const ADMIN_NAVIGATION = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/audit-logs", label: "Audit Logs" },
  { href: "/login", label: "Users" },
];

/**
 * Renders admin task management with in-memory CRUD interactions.
 */
export default function AdminDashboardPage() {
  const router = useRouter();
  const { currentUser, tasks, users, createTask, editTask, deleteTask } = useAppState();

  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "admin") {
      router.replace("/user/dashboard");
    }
  }, [currentUser, router]);

  const usersById = useMemo(() => {
    const entries = users.map((user) => [user.id, user.name] as const);
    return Object.fromEntries(entries);
  }, [users]);

  const editingTask = useMemo<Task | undefined>(() => {
    if (!editingTaskId) {
      return undefined;
    }

    return tasks.find((task) => task.id === editingTaskId);
  }, [tasks, editingTaskId]);

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  /**
   * Opens form in create mode so admin can add a new task row.
   */
  function handleOpenCreate(): void {
    setModalMode("create");
    setEditingTaskId(null);
    setIsModalOpen(true);
  }

  /**
   * Opens form in edit mode with selected task prefilled for updates.
   */
  function handleOpenEdit(taskId: number): void {
    setModalMode("edit");
    setEditingTaskId(taskId);
    setIsModalOpen(true);
  }

  /**
   * Routes submit payload to the proper action based on current modal mode.
   */
  function handleModalSubmit(payload: {
    title: string;
    assigneeId: number;
    status: "Todo" | "In Progress" | "Done";
  }): void {
    if (modalMode === "create") {
      createTask(payload);
    } else if (editingTaskId) {
      editTask(editingTaskId, payload);
    }

    setIsModalOpen(false);
  }

  return (
    <>
      <AppShell
        sidebarTitle="Admin Dashboard"
        heading="Admin Dashboard"
        navigation={ADMIN_NAVIGATION}
      >
        <section className="section-block">
          <div className="section-header-row">
            <h2>Task Management</h2>
            <button type="button" className="button primary" onClick={handleOpenCreate}>
              Create Task
            </button>
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Assignee</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{usersById[task.assigneeId] ?? "Unknown"}</td>
                    <td>
                      <StatusBadge status={task.status} />
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          type="button"
                          className="button ghost"
                          onClick={() => handleOpenEdit(task.id)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="button danger"
                          onClick={() => deleteTask(task.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </AppShell>

      <TaskFormModal
        key={`${modalMode}-${editingTaskId ?? "new"}-${isModalOpen ? "open" : "closed"}`}
        isOpen={isModalOpen}
        mode={modalMode}
        users={users}
        initialTask={editingTask}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </>
  );
}
