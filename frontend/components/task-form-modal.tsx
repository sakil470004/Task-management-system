"use client";

import { useState } from "react";
import type { Task, TaskStatus, User } from "@/lib/types";

interface TaskFormValues {
  title: string;
  assigneeId: number;
  status: TaskStatus;
}

interface TaskFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  users: User[];
  initialTask?: Task;
  onClose: () => void;
  onSubmit: (payload: TaskFormValues) => void;
}

/**
 * Provides one controlled form surface for both create and edit task actions.
 */
export function TaskFormModal({
  isOpen,
  mode,
  users,
  initialTask,
  onClose,
  onSubmit,
}: TaskFormModalProps) {
  const defaultAssigneeId = users[0]?.id ?? 0;

  const [title, setTitle] = useState(() =>
    mode === "edit" && initialTask ? initialTask.title : "",
  );
  const [assigneeId, setAssigneeId] = useState<number>(() =>
    mode === "edit" && initialTask ? initialTask.assigneeId : defaultAssigneeId,
  );
  const [status, setStatus] = useState<TaskStatus>(() =>
    mode === "edit" && initialTask ? initialTask.status : "Todo",
  );

  if (!isOpen) {
    return null;
  }

  /**
   * Prevents empty submissions to keep table data clean during demos.
   */
  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const normalizedTitle = title.trim();
    if (!normalizedTitle || !assigneeId) {
      return;
    }

    onSubmit({
      title: normalizedTitle,
      assigneeId,
      status,
    });
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Task Form Dialog">
      <div className="modal-panel">
        <h3>{mode === "create" ? "Create Task" : "Edit Task"}</h3>

        <form onSubmit={handleSubmit} className="task-form-grid">
          <label>
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Task title"
            />
          </label>

          <label>
            Assignee
            <select
              value={assigneeId}
                onChange={(event) => setAssigneeId(Number(event.target.value))}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
               </label>

          <label>
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as TaskStatus)}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="button secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button primary">
              {mode === "create" ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
