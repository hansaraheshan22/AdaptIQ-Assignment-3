import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function SignUp() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [apiError, setApiError] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (value) => {
    if (value && !value.endsWith('.edu.au')) {
      setEmailError('Please use your university email address (.edu.au)');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validateEmail(email)) return;
    if (!fullName || !email || !password) {
      setApiError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      setUser({
        id: data.id,
        full_name: data.full_name,
        email: data.email,
      });

      setToast({ type: 'success', message: 'Account created successfully!' });
      setTimeout(() => {
        navigate('/subjects');
      }, 1000);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen">
      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}

      {/* Header */}
      <div className="header-band">
        <div className="logo-icon">A</div>
        <div className="app-name">ADAPTIQ</div>
        <div className="tagline">Study Smart. Not Harder.</div>
      </div>

      {/* Content */}
      <div className="content-area">
        <h2 className="heading-purple" style={{ marginBottom: 24, textAlign: 'center' }}>
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">University Email</label>
            <input
              type="email"
              className={`input-field ${emailError ? 'error' : ''}`}
              placeholder="your.name@university.edu.au"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
            />
            {emailError && <div className="error-msg">{emailError}</div>}
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                placeholder="Create a password"
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

          {apiError && (
            <div className="error-msg" style={{ marginBottom: 12, fontSize: 13, marginTop: 8 }}>
              {apiError}
            </div>
          )}
        </form>
      </div>

      {/* Footer */}
      <div className="footer-band">
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <><span className="btn-spinner"></span>Creating account...</> : 'Create my account'}
        </button>
        <Link to="/login" className="link-text" style={{ color: 'white', textDecoration: 'none' }}>
          Already have an account? Log In
        </Link>
      </div>
    </div>
  );
}