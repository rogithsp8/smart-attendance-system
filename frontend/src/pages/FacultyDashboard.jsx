import { useEffect, useState } from 'react';
import { useAuth } from '../auth.jsx';
import api from '../api';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import AttendanceTable from '../components/AttendanceTable';
import QRScanner from '../components/QRScanner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';

export default function FacultyDashboard() {
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [qrUrl, setQrUrl] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [status, setStatus] = useState('PRESENT');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [showQRScanner, setShowQRScanner] = useState(false);

  useEffect(() => {
    loadSubjects();
    loadStudents();
    // Mock attendance data for chart
    setAttendanceData([
      { date: 'Mon', attendance: 85 },
      { date: 'Tue', attendance: 88 },
      { date: 'Wed', attendance: 92 },
      { date: 'Thu', attendance: 87 },
      { date: 'Fri', attendance: 90 },
    ]);
  }, []);

  useEffect(() => {
    if (sessionId) {
      setQrUrl(`http://localhost:8080/api/attendance/session/${sessionId}/qr`);
    }
  }, [sessionId]);

  const loadSubjects = async () => {
    try {
      const res = await api.get('/curriculum');
      const uniqueSubjects = [];
      const seen = new Set();
      res.data.forEach(curr => {
        if (!seen.has(curr.subject.id)) {
          seen.add(curr.subject.id);
          uniqueSubjects.push(curr.subject);
        }
      });
      setSubjects(uniqueSubjects);
    } catch (err) {
      console.error('Failed to load subjects');
    }
  };

  const loadStudents = async () => {
    try {
      const res = await api.get('/auth/users');
      setStudents(res.data.filter(u => u.role === 'STUDENT'));
    } catch (err) {
      setStudents([]);
    }
  };

  const createSession = async () => {
    if (!subjectId) {
      setError('Please select a subject');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/attendance/session?subjectId=' + subjectId);
      setSessionId(res.data.id);
      setSuccess('QR Session created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    if (!sessionId) {
      setError('Please create a session first');
      return;
    }
    if (selectedStudents.length === 0) {
      setError('Please select at least one student');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/attendance/mark', {
        attendanceId: sessionId,
        studentIds: selectedStudents,
        status: status
      });
      setSuccess(`Marked ${selectedStudents.length} students as ${status}`);
      setSelectedStudents([]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} onLogout={logout} />
      
      <div className="ml-64 pt-20">
        <div className="px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Faculty Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {error && <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
        {success && <div className="mx-6 mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>}

        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <DashboardCard
              title="Total Students"
              value={students.length}
              icon="👥"
              color="blue"
              subtitle="Enrolled students"
            />
            <DashboardCard
              title="Subjects"
              value={subjects.length}
              icon="📚"
              color="green"
              subtitle="Your subjects"
            />
            <DashboardCard
              title="Active Session"
              value={sessionId ? 'Yes' : 'No'}
              icon="📱"
              color={sessionId ? 'green' : 'yellow'}
              subtitle="QR Session status"
            />
            <DashboardCard
              title="Marked Today"
              value={selectedStudents.length}
              icon="✅"
              color="indigo"
              subtitle="Attendance marked"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Attendance Trends</h3>
              <LineChart width={400} height={200} data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="attendance" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📱 QR Attendance Session</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={createSession}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Generate QR'}
                  </button>
                  <button
                    onClick={() => setShowQRScanner(!showQRScanner)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {showQRScanner ? 'Hide Scanner' : 'Show Scanner'}
                  </button>
                </div>
                {sessionId && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">
                    <p className="font-semibold">Session Active!</p>
                    <p className="text-sm">Session ID: {sessionId}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showQRScanner && (
            <div className="mb-8">
              <QRScanner
                onScanSuccess={(result) => {
                  setSuccess(`QR Scanned: ${result}`);
                  setTimeout(() => setSuccess(''), 3000);
                }}
                onScanError={(error) => {
                  setError('Scan failed: ' + error);
                  setTimeout(() => setError(''), 3000);
                }}
              />
            </div>
          )}

          <AttendanceTable
            students={students}
            onAttendanceChange={setSelectedStudents}
          />

          <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">✅ Mark Attendance</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="PRESENT">Present</option>
                  <option value="ABSENT">Absent</option>
                  <option value="LATE">Late</option>
                </select>
              </div>
              <button
                onClick={markAttendance}
                disabled={loading || selectedStudents.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Marking...' : `Mark ${selectedStudents.length} student(s) as ${status}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

