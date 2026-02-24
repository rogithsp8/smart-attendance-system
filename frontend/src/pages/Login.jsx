import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'FACULTY') navigate('/faculty');
      else navigate('/student');
    } catch (err) {
      let errorMsg = 'Invalid email or password. Please try again.';
      
      if (err.response) {
        if (err.response.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.response.status === 401) {
          errorMsg = 'Invalid email or password.';
        } else if (err.response.status === 500) {
          errorMsg = 'Server error. Please check backend console.';
        }
      } else if (err.request) {
        errorMsg = 'Cannot connect to server. Please ensure backend is running.';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="text-center mb-6">
          <h2>🎓 Smart Attendance</h2>
          <p>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

