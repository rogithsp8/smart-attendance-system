import { useEffect, useState } from 'react';
import { useAuth } from '../auth.jsx';
import api from '../api';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [curriculum, setCurriculum] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  
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
      } else if (activeTab === 'overview') {
        const res = await api.get('/auth/users');
        setUsers(res.data);
        const subRes = await api.get('/subjects');
        setSubjects(subRes.data);
        const currRes = await api.get('/curriculum');
        setCurriculum(currRes.data);
        
        setAttendanceData([
          { month: 'Jan', attendance: 85 },
          { month: 'Feb', attendance: 88 },
          { month: 'Mar', attendance: 92 },
          { month: 'Apr', attendance: 87 },
          { month: 'May', attendance: 90 },
        ]);
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
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} onLogout={logout} />
      
      <div className="ml-64 pt-20">
        <div className="px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {error && <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>}
        {success && <div className="mx-6 mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">{success}</div>}

        <div className="px-6 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <div className="flex space-x-1 p-1">
                {['overview', 'users', 'subjects', 'curriculum'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activeTab === tab 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">📊 System Overview</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-800 mb-4">Attendance Trends</h4>
                      <BarChart width={400} height={200} data={attendanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="attendance" fill="#6366f1" />
                      </BarChart>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-800 mb-4">Quick Stats</h4>
                      <div className="space-y-2">
                        <p className="text-gray-600">Total Users: <span className="font-semibold">{stats.totalUsers}</span></p>
                        <p className="text-gray-600">Active Subjects: <span className="font-semibold">{stats.totalSubjects}</span></p>
                        <p className="text-gray-600">Curriculum Items: <span className="font-semibold">{stats.totalCurriculum}</span></p>
                        <p className="text-gray-600">System Status: <span className="font-semibold text-green-600">✓ Operational</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">👥 User Management</h3>
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium">{user.name}</td>
                              <td className="px-6 py-4 text-gray-600">{user.email}</td>
                              <td className="px-6 py-4">
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-600">{user.id}</td>
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
                  <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Subject Management</h3>
                  <form onSubmit={addSubject} className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                      <input
                        type="text"
                        value={subjectName}
                        onChange={(e) => setSubjectName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
                      <input
                        type="text"
                        value={subjectCode}
                        onChange={(e) => setSubjectCode(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Lectures</label>
                      <input
                        type="number"
                        value={totalLectures}
                        onChange={(e) => setTotalLectures(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors" disabled={loading}>
                      {loading ? 'Adding...' : 'Add Subject'}
                    </button>
                  </form>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Code</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Lectures</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {subjects.map((subject) => (
                          <tr key={subject.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{subject.name}</td>
                            <td className="px-6 py-4 text-gray-600">{subject.code}</td>
                            <td className="px-6 py-4 text-gray-600">{subject.totalLecturesPlanned}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">� Curriculum Management</h3>
                  <form onSubmit={addCurriculum} className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date Covered</label>
                      <input
                        type="date"
                        value={dateCovered}
                        onChange={(e) => setDateCovered(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors" disabled={loading}>
                      {loading ? 'Adding...' : 'Add Topic'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
