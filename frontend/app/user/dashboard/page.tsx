"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { useAppState } from "@/hooks/use-app-state";
import type { TaskStatus } from "@/lib/types";

const USER_NAVIGATION = [
  { href: "/user/dashboard", label: "My Tasks" },
  { href: "/login", label: "Profile" },
];

/**
 * Shows the logged-in user's tasks with an editable status dropdown.
 */
export default function UserDashboardPage() {
  const router = useRouter();
  const { authReady, currentUser, tasks, updateTaskStatus } = useAppState();

  useEffect(() => {
    if (!authReady) {
      return;
    }

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (currentUser.role !== "user") {
      router.replace("/admin/dashboard");
    }
  }, [authReady, currentUser, router]);

  if (!authReady || !currentUser || currentUser.role !== "user") {
    return null;
  }

  const userTasks = tasks.filter((task) => task.assigneeId === currentUser.id);

  /**
   * Applies immediate local state updates to mimic optimistic API behavior.
   */
  async function handleStatusChange(taskId: number, nextStatus: string): Promise<void> {
    await updateTaskStatus(taskId, nextStatus as TaskStatus);
  }

  return (
    <AppShell
      sidebarTitle="User Dashboard"
      heading="User Dashboard"
      navigation={USER_NAVIGATION}
    >
      <section className="section-block">
        <h2>My Tasks</h2>

        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>
                    <select
                      value={task.status}
                      onChange={(event) => {
                        void handleStatusChange(task.id, event.target.value);
                      }}
                      className="status-select"
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
