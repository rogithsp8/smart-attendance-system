import { useEffect, useState } from 'react';
import { useAuth } from '../auth.jsx';
import api from '../api';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import QRScanner from '../components/QRScanner';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState({ total: 0, present: 0, percentage: 100 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [subjectWiseAttendance, setSubjectWiseAttendance] = useState([]);

  useEffect(() => {
    loadSummary();
    // Mock attendance data for charts
    setAttendanceData([
      { name: 'Present', value: summary.present, color: '#10b981' },
      { name: 'Absent', value: summary.total - summary.present, color: '#ef4444' },
    ]);
    
    setSubjectWiseAttendance([
      { subject: 'Mathematics', attendance: 92 },
      { subject: 'Physics', attendance: 88 },
      { subject: 'Chemistry', attendance: 85 },
      { subject: 'Computer Science', attendance: 95 },
    ]);
  }, []);

  const loadSummary = () => {
    api.get('/attendance/summary')
      .then((res) => setSummary(res.data))
      .catch(() => setError('Failed to load attendance data'));
  };

  const low = summary.percentage < 75;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} onLogout={logout} />
      
      <div className="ml-64 pt-20">
        <div className="px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎓 Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {error && <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
        {success && <div className="mx-6 mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>}

        {low && (
          <div className="mx-6 mb-4 p-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg">
            ⚠️ Warning: Your attendance is below 75%. Please attend classes regularly.
          </div>
        )}

        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1">
              <DashboardCard
                title="Attendance Percentage"
                value={`${summary.percentage}%`}
                icon="📊"
                color={low ? 'red' : 'green'}
                subtitle="Overall attendance"
              />
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Attendance Overview</h3>
                <div className="flex items-center justify-center">
                  <PieChart width={300} height={200}>
                    <Pie
                      data={attendanceData}
                      cx={150}
                      cy={100}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {attendanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Present</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Absent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Subject-wise Attendance</h3>
              <BarChart width={400} height={200} data={subjectWiseAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="attendance" fill="#6366f1" />
              </BarChart>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📱 Quick Actions</h3>
              <div className="space-y-4">
                <button
                  onClick={() => setShowQRScanner(!showQRScanner)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  {showQRScanner ? 'Hide QR Scanner' : 'Scan QR for Attendance'}
                </button>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Curriculum Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Overall Progress</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showQRScanner && (
            <div className="mb-8">
              <QRScanner
                onScanSuccess={(result) => {
                  setSuccess(`Attendance marked successfully! QR: ${result}`);
                  setTimeout(() => setSuccess(''), 3000);
                  setShowQRScanner(false);
                }}
                onScanError={(error) => {
                  setError('Scan failed: ' + error);
                  setTimeout(() => setError(''), 3000);
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              subtitle="Present days"
            />
            <DashboardCard
              title="Classes Missed"
              value={summary.total - summary.present}
              icon="❌"
              color="red"
              subtitle="Absent days"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

