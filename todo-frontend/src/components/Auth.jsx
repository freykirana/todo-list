import React, { useState } from 'react';
import { authAPI } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import '../styles/auth.css';

export default function Auth({ onLogin, onSwitchView }) {
  const { showNotification } = useNotification();
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
        showNotification('Login berhasil!', 'success', 2000);
        onLogin(data.user);
      } else {
        await authAPI.register(formData.nama, formData.email, formData.password);
        showNotification('Registrasi berhasil! Silakan login.', 'success', 3000);
        setIsLogin(true);
        setFormData({ nama: '', email: '', password: '' });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Terjadi kesalahan';
      showNotification(errorMessage, 'error', 4000);
      setError(errorMessage);
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
