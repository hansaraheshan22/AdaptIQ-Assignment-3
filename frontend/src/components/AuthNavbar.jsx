import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const btnStyle = {
  background: 'transparent',
  border: '2px solid #7B2FFF',
  borderRadius: 20,
  padding: '6px 16px',
  color: '#7B2FFF',
  fontFamily: 'Poppins',
  fontWeight: 600,
  fontSize: 12,
  cursor: 'pointer',
};

export default function AuthNavbar() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleHome = () => {
    setUser(null);
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="auth-navbar">
      <span style={{ color: '#7B2FFF', fontWeight: 600, fontSize: 14 }}>
        Hi, {user?.full_name || 'Student'} 👋
      </span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleHome} style={btnStyle}>
          Home
        </button>
        <button onClick={handleLogout} style={btnStyle}>
          Logout
        </button>
      </div>
    </div>
  );
}