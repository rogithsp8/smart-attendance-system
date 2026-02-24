import { useEffect, useState } from 'react';
import { useAuth } from '../auth.jsx';
import api from '../api';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState({ total: 0, present: 0, percentage: 100 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = () => {
    api.get('/attendance/summary')
      .then((res) => setSummary(res.data))
      .catch(() => setError('Failed to load attendance data'));
  };

  const low = summary.percentage < 75;

  return (
    <div className="dashboard">
      <Sidebar user={user} onLogout={logout} />
      
      <div className="main-content">
        <div className="header">
          <h1>🎓 Student Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        {low && (
          <div className="alert warning">
            ⚠️ Warning: Your attendance is below 75%. Please attend classes regularly.
          </div>
        )}

        <div className="stats-grid">
          <DashboardCard
            title="Total Classes"
            value={summary.total}
            icon="🎓"
            color="blue"
            subtitle="Classes conducted"
          />
          <DashboardCard
            title="Classes Attended"
            value={summary.present}
            icon="✅"
            color="green"
            subtitle="Present classes"
          />
          <DashboardCard
            title="Attendance Rate"
            value={`${summary.percentage.toFixed(1)}%`}
            icon="📈"
            color={low ? 'red' : 'green'}
            subtitle={low ? 'Below 75%' : 'Good standing'}
          />
          <DashboardCard
            title="Classes Missed"
            value={summary.total - summary.present}
            icon="❌"
            color="yellow"
            subtitle="Absent classes"
          />
        </div>

        <div className="card">
          <h3>📱 QR Attendance Scanner</h3>
          <p>Scan QR codes to mark attendance (Camera feature disabled in this version)</p>
          <button className="btn btn-primary" disabled>
            📷 Camera Scanner (Not Available)
          </button>
        </div>
      </div>
    </div>
  );
}

