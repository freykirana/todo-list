import React, { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import TaskFilter from './TaskFilter';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import CategoryForm from './CategoryForm';
import CategoryList from './CategoryList';
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

  const handleTaskCreatedOrUpdated = async () => {
    // Refresh both tasks and categories when task is created/updated
    // This ensures category task count is updated
    await fetchTasks();
    await fetchCategories();
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
      fetchCategories(); // Refresh category task count
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleStatusToggle = async (id, newStatus) => {
    try {
      await tasksAPI.updateTask(id, { status: newStatus });
      fetchTasks();
      fetchCategories(); // Refresh category task count
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const handleCategoryAdded = (newCategory) => {
    // Refresh categories from server to ensure consistency
    fetchCategories();
    // Refresh tasks in case any are related
    fetchTasks();
  };

  const handleDeleteCategory = (categoryId) => {
    // Refresh categories and tasks after deletion
    fetchCategories();
    // Reset category filter if the deleted category was selected
    if (categoryFilter === categoryId || categoryFilter === String(categoryId)) {
      setCategoryFilter('');
      fetchTasks(search, statusFilter, '');
    } else {
      fetchTasks();
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

        <CategoryForm onCategoryAdded={handleCategoryAdded} />

        <CategoryList 
          categories={categories}
          onCategoryDeleted={handleDeleteCategory}
        />

        <TaskFilter
          onSearch={handleSearch}
          onStatusChange={handleStatusChange}
          onCategoryChange={handleCategoryChange}
          categories={categories}
        />

        <TaskForm
          onTaskCreated={handleTaskCreatedOrUpdated}
          editingTask={editingTask}
          onEditComplete={() => {
            setEditingTask(null);
            handleTaskCreatedOrUpdated();
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