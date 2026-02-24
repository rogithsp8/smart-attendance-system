import { useEffect, useState } from 'react';
import { useAuth } from '../auth.jsx';
import api from '../api';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import AttendanceTable from '../components/AttendanceTable';

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

  useEffect(() => {
    loadSubjects();
    loadStudents();
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
    <div className="dashboard">
      <Sidebar user={user} onLogout={logout} />
      
      <div className="main-content">
        <div className="header">
          <h1>📊 Faculty Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <div className="stats-grid">
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

        <div className="content-grid">
          <div className="card">
            <h3>📱 Create QR Attendance Session</h3>
            
            <div className="form-group">
              <label>Select Subject</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
              >
                <option value="">Choose a subject...</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={createSession}
              disabled={!subjectId || loading}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Generate QR Code'}
            </button>

            {qrUrl && (
              <div className="qr-display">
                <div className="alert info">
                  ℹ️ QR Code Active: Students can scan this code for attendance
                </div>
                <div className="qr-image">
                  <img src={qrUrl} alt="QR Code" />
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h3>✍️ Manual Attendance</h3>
            
            {!sessionId ? (
              <div className="alert warning">
                ⚠️ Please create a QR session first before marking attendance
              </div>
            ) : (
              <div>
                <div className="form-group">
                  <label>Attendance Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="PRESENT">Present</option>
                    <option value="ABSENT">Absent</option>
                    <option value="LATE">Late</option>
                  </select>
                </div>

                <button
                  onClick={markAttendance}
                  disabled={selectedStudents.length === 0 || loading}
                  className="btn btn-success"
                >
                  {loading ? 'Marking...' : `Mark ${selectedStudents.length} Student(s) as ${status}`}
                </button>
              </div>
            )}
          </div>
        </div>

        <AttendanceTable 
          students={students} 
          onAttendanceChange={setSelectedStudents}
        />
      </div>
    </div>
  );
}

