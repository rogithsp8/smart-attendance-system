import { useEffect, useState } from 'react';
import { useAuth } from '../auth.jsx';
import api from '../api';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [curriculum, setCurriculum] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [totalLectures, setTotalLectures] = useState('');
  
  const [selectedSubject, setSelectedSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [dateCovered, setDateCovered] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await api.get('/auth/users');
        setUsers(res.data);
      } else if (activeTab === 'subjects') {
        const res = await api.get('/subjects');
        setSubjects(res.data);
      } else if (activeTab === 'curriculum') {
        const res = await api.get('/curriculum');
        setCurriculum(res.data);
        const subRes = await api.get('/subjects');
        setSubjects(subRes.data);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addSubject = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/subjects', {
        name: subjectName,
        code: subjectCode,
        totalLecturesPlanned: parseInt(totalLectures)
      });
      setSuccess('Subject added successfully!');
      setSubjectName('');
      setSubjectCode('');
      setTotalLectures('');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add subject');
    } finally {
      setLoading(false);
    }
  };

  const addCurriculum = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/curriculum', {
        subjectId: parseInt(selectedSubject),
        topic,
        description,
        dateCovered
      });
      setSuccess('Curriculum added successfully!');
      setSelectedSubject('');
      setTopic('');
      setDescription('');
      setDateCovered('');
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add curriculum');
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalUsers: users.length,
    students: users.filter(u => u.role === 'STUDENT').length,
    faculty: users.filter(u => u.role === 'FACULTY').length,
    admins: users.filter(u => u.role === 'ADMIN').length,
    totalSubjects: subjects.length,
    totalCurriculum: curriculum.length
  };

  return (
    <div className="dashboard">
      <Sidebar user={user} onLogout={logout} />
      
      <div className="main-content">
        <div className="header">
          <h1>📊 Admin Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>

        {error && <div className="alert error">{error}</div>}
        {success && <div className="alert success">{success}</div>}

        <div className="stats-grid">
          <DashboardCard
            title="Total Students"
            value={stats.students}
            icon="👥"
            color="blue"
            subtitle="Active students"
          />
          <DashboardCard
            title="Total Faculty"
            value={stats.faculty}
            icon="🎓"
            color="green"
            subtitle="Teaching staff"
          />
          <DashboardCard
            title="Total Subjects"
            value={stats.totalSubjects}
            icon="📚"
            color="yellow"
            subtitle="Available courses"
          />
          <DashboardCard
            title="Curriculum Topics"
            value={stats.totalCurriculum}
            icon="📈"
            color="indigo"
            subtitle="Total topics"
          />
        </div>

        <div className="tabs">
          {['overview', 'users', 'subjects', 'curriculum'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="card">
          {activeTab === 'overview' && (
            <div>
              <h3>📊 System Overview</h3>
              <div className="overview-grid">
                <div className="overview-item">
                  <h4>Recent Activity</h4>
                  <p>System is running smoothly with all services operational.</p>
                </div>
                <div className="overview-item">
                  <h4>Quick Stats</h4>
                  <p>Total Users: {stats.totalUsers}</p>
                  <p>Active Subjects: {stats.totalSubjects}</p>
                  <p>Curriculum Items: {stats.totalCurriculum}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3>👥 User Management</h3>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>
                            <span className={`badge ${user.role.toLowerCase()}`}>
                              {user.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'subjects' && (
            <div>
              <div className="section-header">
                <h3>📚 Subject Management</h3>
                <button
                  onClick={() => setActiveTab('add-subject')}
                  className="btn btn-primary"
                >
                  Add Subject
                </button>
              </div>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Total Lectures</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((subject) => (
                        <tr key={subject.id}>
                          <td>{subject.name}</td>
                          <td>{subject.code}</td>
                          <td>{subject.totalLecturesPlanned}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div>
              <div className="section-header">
                <h3>📈 Curriculum Management</h3>
                <button
                  onClick={() => setActiveTab('add-curriculum')}
                  className="btn btn-primary"
                >
                  Add Topic
                </button>
              </div>
              {loading ? (
                <div className="loading">Loading...</div>
              ) : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Topic</th>
                        <th>Description</th>
                        <th>Date Covered</th>
                      </tr>
                    </thead>
                    <tbody>
                      {curriculum.map((item) => (
                        <tr key={item.id}>
                          <td>{item.subject?.name ?? '-'}</td>
                          <td>{item.topic}</td>
                          <td>{item.description}</td>
                          <td>{item.dateCovered}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'add-subject' && (
            <div>
              <h3>➕ Add New Subject</h3>
              <form onSubmit={addSubject}>
                <div className="form-group">
                  <label>Subject Name</label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Subject Code</label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Total Lectures Planned</label>
                  <input
                    type="number"
                    value={totalLectures}
                    onChange={(e) => setTotalLectures(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Subject'}
                </button>
                <button type="button" onClick={() => setActiveTab('subjects')} className="btn btn-secondary">
                  Cancel
                </button>
              </form>
            </div>
          )}

          {activeTab === 'add-curriculum' && (
            <div>
              <h3>➕ Add Curriculum Topic</h3>
              <form onSubmit={addCurriculum}>
                <div className="form-group">
                  <label>Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    required
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date Covered</label>
                  <input
                    type="date"
                    value={dateCovered}
                    onChange={(e) => setDateCovered(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Topic'}
                </button>
                <button type="button" onClick={() => setActiveTab('curriculum')} className="btn btn-secondary">
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
