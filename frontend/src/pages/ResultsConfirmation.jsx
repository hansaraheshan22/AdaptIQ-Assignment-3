import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import AuthNavbar from '../components/AuthNavbar';

export default function ResultsConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();

  const { correct = 0, wrong = 0, total = 5, subject = 'Unknown', wrongQuestions = [] } = location.state || {};
  const sessionResult = (correct / total) * 100;

  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const saveResults = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/results/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user?.id,
            total_questions: 5,
            correct_answers: parseInt(correct),
            wrong_answers: parseInt(wrong),
            session_result: Math.round(parseInt(correct) / 5 * 100),
            improvement_level: 5,
            difficulty_level: "Medium",
            subject: subject,
          }),
        });

        if (res.ok) {
          setSaved(true);
        } else {
          const errorData = await res.json().catch(() => ({}));
          setSaveError(errorData.detail || 'Failed to save results. Please try again.');
        }
      } catch (err) {
        console.error('Failed to save results:', err);
        setSaveError('Network error — could not save results to server.');
      }
    };

    if (user?.id) {
      saveResults();
    } else {
      setSaveError('No user found. Please log in again.');
    }
  }, [user, correct, wrong, total, sessionResult, subject]);

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
      <div className="content-area" style={{ textAlign: 'center' }}>
        <div className="green-check">✓</div>

        <h2 className="heading-purple" style={{ marginBottom: 12 }}>
          Quiz Submitted Successfully!
        </h2>

        <p className="result-score">
          You scored {correct} out of {total}
        </p>

        <div className="result-stats">
          <span className="result-stat-item">Correct: {correct}</span>
          <span className="result-stat-item">Wrong: {wrong}</span>
        </div>

        <p className="result-stat-item" style={{ marginBottom: 16 }}>
          Session Result: {sessionResult}%
        </p>

        {saved && (
          <p className="result-message">
            Great work! Your results have been saved.
          </p>
        )}

        {/* Wrong Answers Breakdown */}
        {wrong === 0 ? (
          <div className="perfect-score">Perfect Score! 🎉</div>
        ) : wrongQuestions.length > 0 ? (
          <div className="review-section">
            <p className="review-title">Questions to Review</p>
            {wrongQuestions.map((item, index) => (
              <div key={index} className="review-item">
                <p className="review-question">{item.question}</p>
                <p className="review-answer">✓ {item.correctAnswer}</p>
              </div>
            ))}
          </div>
        ) : null}

        {saveError && (
          <p className="error-msg" style={{ textAlign: 'center', fontSize: 13, marginBottom: 12 }}>
            {saveError}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="footer-band">
        <button className="btn-primary" onClick={() => navigate('/dashboard')}>
          View Dashboard
        </button>
        <Link
          to="/subjects"
          className="link-text"
          style={{ color: 'white', textDecoration: 'none' }}
        >
          Start another quiz
        </Link>
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