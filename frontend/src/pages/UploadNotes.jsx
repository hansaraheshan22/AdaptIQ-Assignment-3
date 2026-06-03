import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthNavbar from '../components/AuthNavbar';

export default function UploadNotes() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  const handleGenerateQuiz = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/quiz');
    }, 2000);
  };

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
        <div
          className="drag-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <p className="drag-zone-text">Drag your pdf or note here...</p>
          <button
            className="browse-btn"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Browse Files
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf,.txt"
            onChange={handleFileSelect}
          />
        </div>

        {/* File pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div className="file-pill">Vibe Coding Week One Notes</div>
          <div className="file-pill">Vibe Coding Week Two Notes</div>
          {uploadedFile && <div className="file-pill">📄 {uploadedFile}</div>}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <div className="spinner"></div>
            <p style={{ color: '#7B2FFF', fontSize: 14, fontFamily: 'Poppins', marginTop: 8 }}>
              Generating your quiz...
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="footer-band">
        <button
          className="btn-primary"
          onClick={handleGenerateQuiz}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate my quiz'}
        </button>
        <span className="footer-text">Need help? Click here</span>
      </div>
    </div>
  );
}