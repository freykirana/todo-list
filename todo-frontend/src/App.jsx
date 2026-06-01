import React, { useState, useEffect } from 'react'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import Notification from './components/Notification'
import { NotificationProvider } from './context/NotificationContext'
import './App.css'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) {
    return <div className="app-loading">Loading...</div>
  }

  return (
    <NotificationProvider>
      <Notification />
      <div className="app">
        {user ? (
          <Dashboard user={user} onLogout={handleLogout} />
        ) : (
          <Auth onLogin={handleLogin} />
        )}
      </div>
    </NotificationProvider>
  )
}

