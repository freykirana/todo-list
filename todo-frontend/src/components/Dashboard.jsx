import React, { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import TaskFilter from './TaskFilter';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { tasksAPI, categoriesAPI } from '../services/api';
import '../styles/dashboard.css';

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchTasks();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await categoriesAPI.getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchTasks = async (searchTerm = search, status = statusFilter, category = categoryFilter) => {
    setLoading(true);
    try {
      const { data } = await tasksAPI.getTasks(searchTerm, status, category);
      setTasks(data.tasks);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    fetchTasks(value, statusFilter, categoryFilter);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    fetchTasks(search, value, categoryFilter);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    fetchTasks(search, statusFilter, value);
  };

  const handleDeleteTask = async (id) => {
    try {
      await tasksAPI.deleteTask(id);
      fetchTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleStatusToggle = async (id, newStatus) => {
    try {
      await tasksAPI.updateTask(id, { status: newStatus });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📋 Task Dashboard</h1>
          <div className="header-user">
            <span>Welcome, <strong>{user.nama}</strong></span>
            <button className="btn btn-logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <StatsCards tasks={tasks} />

        {error && <div className="alert alert-error">{error}</div>}

        <TaskFilter
          onSearch={handleSearch}
          onStatusChange={handleStatusChange}
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />

        <TaskForm
          onTaskCreated={fetchTasks}
          editingTask={editingTask}
          onEditComplete={() => {
            setEditingTask(null);
            fetchTasks();
          }}
          categories={categories}
        />

        <TaskList
          tasks={tasks}
          onDelete={handleDeleteTask}
          onEdit={setEditingTask}
          onStatusToggle={handleStatusToggle}
          loading={loading}
        />
      </div>
    </div>
  );
}