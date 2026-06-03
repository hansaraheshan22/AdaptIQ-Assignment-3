import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AuthNavbar from '../components/AuthNavbar';

function formatDate(dateString) {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/results/${user?.id}`
        );
        if (!res.ok) {
          throw new Error('Failed to fetch results');
        }
        const data = await res.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchResults();
    }
  }, [user]);

  const latest = results?.[0];
  const previous = results?.[1];
  const improvement = latest && previous
    ? latest.session_result - previous.session_result
    : null;

  return (
    <div className="screen">
      {/* Header */}
      <div className="header-band">
        <div className="logo-icon">A</div>
        <div className="app-name">ADAPTIQ</div>
        <div className="tagline">Study Smart. Not Harder.</div>
      </div>

      {/* Auth Navbar */}
      <AuthNavbar />

      {/* Content */}
      <div className="content-area">
        <p
          style={{
            color: '#7B2FFF',
            fontWeight: 700,
            fontSize: 18,
            fontFamily: 'Poppins',
            marginBottom: 20,
          }}
        >
          Progress Dashboard
        </p>

        {loading && (
          <>
            <div className="spinner"></div>
            <p
              style={{
                textAlign: 'center',
                color: '#7B2FFF',
                fontSize: 14,
                fontFamily: 'Poppins',
              }}
            >
              Loading results...
            </p>
          </>
        )}

        {error && (
          <p className="error-msg" style={{ textAlign: 'center' }}>
            {error}
          </p>
        )}

        {!loading && !error && !latest && (
          <p
            style={{
              textAlign: 'center',
              color: '#555',
              fontSize: 14,
              fontFamily: 'Poppins',
            }}
          >
            No quiz results yet. Take a quiz to see your stats!
          </p>
        )}

        {!loading && latest && (
          <>
            {/* Stat Pills */}
            <div className="stats-grid">
              <div className="stat-pill">
                Total Questions — {latest.total_questions}
              </div>
              <div className="stat-pill">
                Correct Answers — {latest.correct_answers}/{latest.total_questions}
              </div>
              <div className="stat-pill">
                Wrong Answers — {latest.wrong_answers}/{latest.total_questions}
              </div>
              <div className="stat-pill">
                Session Result — {latest.session_result}%
              </div>
              <div className="stat-pill">
                Level of Improvement —{' '}
                {improvement !== null ? (
                  <span style={{ color: improvement >= 0 ? '#EAF3DE' : '#FCEBEB' }}>
                    {improvement >= 0 ? '+' : ''}{improvement}%
                  </span>
                ) : (
                  'N/A'
                )}
              </div>
              <div className="stat-pill">
                Difficulty Level — {latest.difficulty_level}
              </div>
            </div>

            {/* Improvement Badge */}
            {improvement !== null && (
              <div style={{ textAlign: 'center', marginTop: 8, marginBottom: 16 }}>
                <span className={`improvement-badge ${improvement >= 0 ? 'positive' : 'negative'}`}>
                  {improvement >= 0 ? '📈' : '📉'} {improvement >= 0 ? '+' : ''}{improvement}% from last quiz
                </span>
              </div>
            )}

            {/* Quiz History */}
            {results.length > 1 && (
              <>
                <p className="history-section-title">Quiz History</p>
                {results.map((item, index) => {
                  const prevItem = results[index + 1];
                  const diff = prevItem
                    ? item.session_result - prevItem.session_result
                    : null;

                  return (
                    <div key={item.id || index} className="history-card">
                      <div className="history-card-date">
                        {formatDate(item.completed_at || item.created_at)}
                      </div>
                      <div className="history-card-subject">{item.subject}</div>
                      <div className="history-card-stats">
                        Score: {item.correct_answers}/{item.total_questions} &middot; {item.session_result}%
                      </div>
                      {diff !== null && index < results.length - 1 && (
                        <span className={`improvement-badge ${diff >= 0 ? 'positive' : 'negative'}`}>
                          {diff >= 0 ? '+' : ''}{diff}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="footer-band">
        <button className="btn-primary" onClick={() => navigate('/subjects')}>
          Next Quiz
        </button>
        <span className="footer-text">Need more study tips? Click here</span>
        <Link
          to="/"
          className="footer-text"
          style={{ textDecoration: 'none', cursor: 'pointer' }}
          onClick={() => setUser(null)}
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}