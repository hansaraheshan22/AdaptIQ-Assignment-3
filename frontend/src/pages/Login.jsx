import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!email || !password) {
      setApiError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Invalid email or password');
      }

      setUser({
        id: data.id,
        full_name: data.full_name,
        email: data.email,
      });

      navigate('/subjects');
    } catch (err) {
      setApiError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      {/* Header */}
      <div className="header-band">
        <div className="logo-icon">A</div>
        <div className="app-name">ADAPTIQ</div>
      </div>

      {/* Content */}
      <div className="content-area">
        <h1 className="heading-purple" style={{ textAlign: 'center', marginBottom: 4 }}>
          Welcome Back
        </h1>
        <p className="subtext" style={{ textAlign: 'center', marginBottom: 24 }}>
          Log into continue studying
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">University Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="your.name@university.edu.au"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginBottom: 12 }}>
            <span className="link-text" style={{ fontSize: 12 }}>Forgot Password?</span>
          </div>

          {apiError && (
            <div style={{ color: '#FF4444', fontSize: 13, paddingLeft: 12, marginTop: 8, marginBottom: 12, fontFamily: 'Poppins', textAlign: 'center' }}>
              {apiError}
            </div>
          )}
        </form>
      </div>

      {/* Footer */}
      <div className="footer-band">
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <><span className="btn-spinner"></span>Logging in...</> : 'Log IN'}
        </button>
        <Link to="/signup" className="link-text" style={{ color: 'white', textDecoration: 'none' }}>
          Don't have an account? Sign up free
        </Link>
      </div>
    </div>
  );
}