import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="screen">
      {/* Header */}
      <div className="header-band">
        <div className="logo-icon">A</div>
        <div className="app-name">ADAPTIQ</div>
        <div className="tagline">Study Smart. Not Harder.</div>
      </div>

      {/* Content */}
      <div className="content-area">
        <div style={{ marginTop: 20 }}>
          <div className="value-prop">
            <span className="star">★</span>
            <span>Upload your notes</span>
          </div>
          <div className="value-prop">
            <span className="star">★</span>
            <span>Get a personalised quiz</span>
          </div>
          <div className="value-prop">
            <span className="star">★</span>
            <span>Focus on your weak areas</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer-band">
        <button className="btn-primary" onClick={() => navigate('/signup')}>
          ⏮ Create a Free Account
        </button>
        <button className="btn-secondary" onClick={() => navigate('/login')}>
          Log IN
        </button>
        <span className="footer-text">
          By Continuing this you agreed to our Terms and Policy Requirement
        </span>
      </div>
    </div>
  );
}