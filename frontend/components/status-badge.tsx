import type { TaskStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: TaskStatus;
}

/**
 * Uses a fixed color mapping so status meaning stays visually consistent.
 */
export function StatusBadge({ status }: StatusBadgeProps) {
  const classNameByStatus: Record<TaskStatus, string> = {
    Todo: "status-badge todo",
    "In Progress": "status-badge in-progress",
    Done: "status-badge done",
  };

  return <span className={classNameByStatus[status]}>{status}</span>;
}
