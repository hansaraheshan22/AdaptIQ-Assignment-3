import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Welcome from './pages/Welcome';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import SubjectSelection from './pages/SubjectSelection';
import UploadNotes from './pages/UploadNotes';
import Quiz from './pages/Quiz';
import ResultsConfirmation from './pages/ResultsConfirmation';
import Dashboard from './pages/Dashboard';

function ProtectedRoute({ children }) {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/subjects"
            element={
              <ProtectedRoute>
                <SubjectSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadNotes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <ResultsConfirmation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}