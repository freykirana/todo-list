import React from 'react';
import { useNotification } from '../context/NotificationContext';
import '../styles/notification.css';

const Notification = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="notification-container">
      {notifications.map((notif) => (
        <div key={notif.id} className={`notification notification-${notif.type}`}>
          <div className="notification-content">
            {notif.type === 'success' && <span className="notification-icon">✅</span>}
            {notif.type === 'error' && <span className="notification-icon">❌</span>}
            {notif.type === 'info' && <span className="notification-icon">ℹ️</span>}
            <span className="notification-message">{notif.message}</span>
          </div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notif.id)}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
