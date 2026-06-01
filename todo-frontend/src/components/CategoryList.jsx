import React, { useState } from 'react';
import { categoriesAPI } from '../services/api';
import '../styles/categorylist.css';

const CategoryList = ({ categories, onCategoryDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setDeletingId(categoryId);
      
      await categoriesAPI.deleteCategory(categoryId);
      
      if (onCategoryDeleted) {
        onCategoryDeleted(categoryId);
      }
    } catch (err) {
      console.error('Category delete error:', err);
      setError(err.response?.data?.error || 'Failed to delete category');
      setDeletingId(null);
    } finally {
      setLoading(false);
    }
  };

  if (categories.length === 0) {
    return (
      <div className="categories-empty">
        <p>No categories yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <h3>📁 Categories</h3>
      
      {error && <div className="alert alert-error">{error}</div>}
      
      <div className="categories-list">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <div className="category-info">
              <span className="category-name">{category.nama_kategori}</span>
              <span className="category-tasks">
                {category.tasks.length} {category.tasks.length === 1 ? 'task' : 'tasks'}
              </span>
            </div>
            <button
              className="btn btn-delete-category"
              onClick={() => handleDeleteCategory(category.id)}
              disabled={loading || deletingId === category.id}
              title="Delete category"
            >
              {deletingId === category.id ? 'Deleting...' : '🗑️'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
