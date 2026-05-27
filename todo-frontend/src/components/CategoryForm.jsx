import { useState } from 'react';
import { categoriesAPI } from '../services/api';
import '../styles/categoryform.css';

const CategoryForm = ({ onCategoryAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await categoriesAPI.create({
        nama_kategori: categoryName.trim()
      });
      
      const newCategory = response.data?.category;
      
      setCategoryName('');
      setShowForm(false);
      setError('');
      
      if (onCategoryAdded && newCategory) {
        onCategoryAdded(newCategory);
      }
    } catch (err) {
      console.error('Category create error:', err);
      setError(err.response?.data?.error || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  if (!showForm) {
    return (
      <button 
        className="btn-add-category"
        onClick={() => setShowForm(true)}
      >
        ➕ Add Category
      </button>
    );
  }

  return (
    <div className="category-form-overlay">
      <div className="category-form-modal">
        <h3>Add New Category</h3>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="categoryName">Category Name</label>
            <input
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g., Work, Personal, Shopping..."
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setCategoryName('');
                setError('');
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
