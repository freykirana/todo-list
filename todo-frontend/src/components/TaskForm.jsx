import React, { useState, useEffect } from 'react';
import { tasksAPI, categoriesAPI } from '../services/api';
import '../styles/taskform.css';

export default function TaskForm({ onTaskCreated, editingTask, onEditComplete, categories }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    categoryId: '',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      const dueDateFormatted = editingTask.due_date
        ? new Date(editingTask.due_date).toISOString().split('T')[0]
        : '';
      setFormData({
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        categoryId: editingTask.categoryId,
        due_date: dueDateFormatted,
      });
      setShowForm(true);
    }
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate due date is not in the past
      if (formData.due_date) {
        const selectedDate = new Date(formData.due_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day

        if (selectedDate < today) {
          setError('Due date cannot be in the past');
          setLoading(false);
          return;
        }
      }

      const taskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        categoryId: parseInt(formData.categoryId),
        due_date: formData.due_date
          ? new Date(formData.due_date).toISOString()
          : null,
      };

      if (editingTask) {
        await tasksAPI.updateTask(editingTask.id, taskData);
        onEditComplete();
      } else {
        await tasksAPI.createTask(taskData);
      }

      setFormData({
        title: '',
        description: '',
        status: 'pending',
        categoryId: '',
        due_date: '',
      });
      setShowForm(false);
      onTaskCreated();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      categoryId: '',
      due_date: '',
    });
    setError('');
    if (editingTask) onEditComplete();
  };

  return (
    <div className="task-form-container">
      {!showForm ? (
        <button
          className="btn btn-primary btn-large"
          onClick={() => setShowForm(true)}
        >
          ➕ Add New Task
        </button>
      ) : (
        <div className="form-overlay">
          <div className="form-modal">
            <h2>{editingTask ? '✏️ Edit Task' : '➕ Create New Task'}</h2>

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Task title..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Task description..."
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="categoryId">Category</label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a category...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nama_kategori}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="progress">🔄 In Progress</option>
                    <option value="selesai">✅ Completed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="due_date">Due Date</label>
                <input
                  id="due_date"
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  min={getMinDate()}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Task'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
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
