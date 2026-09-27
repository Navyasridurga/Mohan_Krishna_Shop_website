import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, checkingSession } = useAuth();

  if (checkingSession) return <LoadingSpinner label="Checking session..." />;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return children;
}
