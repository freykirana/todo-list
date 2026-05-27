import React, { useState } from 'react';
import { authAPI } from '../services/api';
import '../styles/auth.css';

export default function Auth({ onLogin, onSwitchView }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { data } = await authAPI.login(formData.email, formData.password);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
      } else {
        await authAPI.register(formData.nama, formData.email, formData.password);
        setIsLogin(true);
        setFormData({ nama: '', email: '', password: '' });
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">
          {isLogin ? '📝 Login' : '✍️ Register'}
        </h1>
        
        {error && <div className={`alert ${isLogin && error.includes('successful') ? 'alert-success' : 'alert-error'}`}>
          {error}
        </div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="nama">Full Name</label>
              <input
                id="nama"
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ nama: '', email: '', password: '' });
              }}
            >
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
