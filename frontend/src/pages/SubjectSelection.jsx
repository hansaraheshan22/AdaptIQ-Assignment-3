import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AuthNavbar from '../components/AuthNavbar';

const subjects = ['Cyber Security', 'Vibe Coding'];

export default function SubjectSelection() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSubject = (subject) => {
    setSelected((prev) => (prev === subject ? null : subject));
  };

  const handleContinue = async () => {
    if (!selected) {
      setError('Please select a subject.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subjects/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          subject: selected,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Failed to save subject');
      }

      // Save selected subject to user context
      setUser({ ...user, subject: selected });
      navigate('/upload');
    } catch (err) {
      setError(err.message);
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
        <div className="tagline">Study Smart. Not Harder.</div>
        <div className="progress-dots">
          <div className="progress-dot"></div>
          <div className="progress-dot"></div>
          <div className="progress-dot"></div>
        </div>
      </div>

      {/* Auth Navbar */}
      <AuthNavbar />

      {/* Content */}
      <div className="content-area">
        <div className="input-group">
          <label className="input-label">Full Name</label>
          <input
            type="text"
            className="input-field"
            value={user?.full_name || ''}
            readOnly
          />
        </div>

        <div className="input-group">
          <label className="input-label">University Email</label>
          <input
            type="email"
            className="input-field"
            value={user?.email || ''}
            readOnly
          />
        </div>

        <p className="section-label cyan" style={{ marginTop: 16, marginBottom: 12 }}>
          Select your subjects
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {subjects.map((subject) => (
            <button
              key={subject}
              className={`chip ${selected === subject ? 'selected' : ''}`}
              onClick={() => toggleSubject(subject)}
            >
              {subject}
            </button>
          ))}
        </div>

        <p className="link-text" style={{ marginTop: 16 }}>
          More Subjects...
        </p>

        {error && (
          <div className="error-msg" style={{ marginTop: 12 }}>{error}</div>
        )}
      </div>

      {/* Footer */}
      <div className="footer-band">
        <button className="btn-primary" onClick={handleContinue} disabled={loading}>
          {loading ? 'Saving...' : 'Continue'}
        </button>
        <span className="footer-text">Need more information? Click here</span>
      </div>
    </div>
  );
}