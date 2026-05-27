import React, { useState, useEffect } from 'react';
import '../styles/dashboard.css';

const StatsCard = ({ title, value, icon, color }) => (
  <div className={`stats-card stats-card-${color}`}>
    <div className="stats-icon">{icon}</div>
    <div className="stats-content">
      <p className="stats-title">{title}</p>
      <h3 className="stats-value">{value}</h3>
    </div>
  </div>
);

export default function StatsCards({ tasks = [] }) {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    progress: 0,
    selesai: 0,
  });

  useEffect(() => {
    const newStats = {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'pending').length,
      progress: tasks.filter((t) => t.status === 'progress').length,
      selesai: tasks.filter((t) => t.status === 'selesai').length,
    };
    setStats(newStats);
  }, [tasks]);

  return (
    <div className="stats-grid">
      <StatsCard
        title="Total Tasks"
        value={stats.total}
        icon="📊"
        color="blue"
      />
      <StatsCard
        title="Pending"
        value={stats.pending}
        icon="⏳"
        color="yellow"
      />
      <StatsCard
        title="In Progress"
        value={stats.progress}
        icon="🔄"
        color="purple"
      />
      <StatsCard
        title="Completed"
        value={stats.selesai}
        icon="✅"
        color="green"
      />
    </div>
  );
}
