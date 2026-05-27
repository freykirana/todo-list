import React from 'react';
import { tasksAPI } from '../services/api';
import '../styles/tasklist.css';

const StatusBadge = ({ status }) => {
  const statusMap = {
    pending: { icon: '⏳', label: 'Pending', color: 'yellow' },
    progress: { icon: '🔄', label: 'In Progress', color: 'purple' },
    selesai: { icon: '✅', label: 'Completed', color: 'green' },
  };

  const { icon, label, color } = statusMap[status] || statusMap.pending;

  return (
    <span className={`status-badge status-${color}`}>
      {icon} {label}
    </span>
  );
};

const TaskCard = ({ task, onDelete, onEdit, onStatusToggle }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getNextStatus = (current) => {
    const statuses = ['pending', 'progress', 'selesai'];
    const currentIndex = statuses.indexOf(current);
    return statuses[(currentIndex + 1) % statuses.length];
  };

  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <span className="task-category">📁 {task.category.nama_kategori}</span>
        <span className="task-date">📅 {formatDate(task.due_date)}</span>
      </div>

      <div className="task-actions">
        <button
          className="btn-icon"
          title="Next Status"
          onClick={() => onStatusToggle(task.id, getNextStatus(task.status))}
        >
          ↻
        </button>
        <button
          className="btn-icon btn-edit"
          title="Edit"
          onClick={() => onEdit(task)}
        >
          ✏️
        </button>
        <button
          className="btn-icon btn-delete"
          title="Delete"
          onClick={() => {
            if (confirm('Delete this task?')) onDelete(task.id);
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default function TaskList({
  tasks = [],
  onDelete,
  onEdit,
  onStatusToggle,
  loading = false,
}) {
  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>🎯 No tasks found. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
          onStatusToggle={onStatusToggle}
        />
      ))}
    </div>
  );
}
