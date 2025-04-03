import { useContext, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuth, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Double check auth status when component mounts
    if (!loading && !isAuth) {
      navigate('/login');
    }
  }, [isAuth, loading, navigate]);
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!isAuth) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

export default ProtectedRoute;