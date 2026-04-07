'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import apiClient from '@/lib/api';
import { Task } from '@/lib/task-types';
import { ProtectedRoute } from '@/lib/protected-route';

/**
 * Admin Dashboard
 * Shows all tasks and audit logs
 */
function AdminDashboardContent() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'tasks' | 'audit'>('tasks');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await apiClient.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    try {
      const res = await apiClient.get('/audit-logs');
      setAuditLogs(res.data);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchTasks(), fetchAuditLogs()]).finally(() => setLoading(false));
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/tasks', newTask);
      setNewTask({ title: '', description: '' });
      setShowCreateModal(false);
      fetchTasks();
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (confirm('Delete this task?')) {
      try {
        await apiClient.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <span>{user?.email}</span>
            <button onClick={handleLogout} className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto my-6">
        <div className="flex gap-4 border-b">
          <button
            onClick={() => setTab('tasks')}
            className={`px-4 py-2 font-medium ${
              tab === 'tasks'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setTab('audit')}
            className={`px-4 py-2 font-medium ${
              tab === 'audit'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Audit Logs
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : tab === 'tasks' ? (
          <div className="py-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
            >
              Create Task
            </button>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Assigned To</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3">{task.title}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            task.status === 'DONE'
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'PROCESSING'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="px-6 py-3">{task.assignedUser?.email || '-'}</td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="py-6 bg-white rounded-lg shadow">
            {auditLogs.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No audit logs</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.map((log: any) => (
                  <div key={log.id} className="border-b p-4">
                    <div className="flex justify-between">
                      <span className="font-medium">{log.actionType}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      Actor: {log.actor.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
