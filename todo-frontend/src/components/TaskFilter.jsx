import React from 'react';
import '../styles/taskfilter.css';

export default function TaskFilter({
  onSearch,
  onStatusChange,
  onCategoryChange,
  categories = [],
}) {
  return (
    <div className="filter-bar">
      <div className="filter-item">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          onChange={(e) => onSearch(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-item">
        <select onChange={(e) => onStatusChange(e.target.value)} className="filter-select">
          <option value="">All Status</option>
          <option value="pending">⏳ Pending</option>
          <option value="progress">🔄 In Progress</option>
          <option value="selesai">✅ Completed</option>
        </select>
      </div>

      <div className="filter-item">
        <select onChange={(e) => onCategoryChange(e.target.value)} className="filter-select">
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nama_kategori}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
