import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { AuthProvider, useAuth } from './auth.jsx';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute({ children, role }) {
  const { user } = useAuth();
  if (!user || user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <RoleRoute role="ADMIN">
              <AdminDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/faculty"
        element={
          <PrivateRoute>
            <RoleRoute role="FACULTY">
              <FacultyDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route
        path="/student"
        element={
          <PrivateRoute>
            <RoleRoute role="STUDENT">
              <StudentDashboard />
            </RoleRoute>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

