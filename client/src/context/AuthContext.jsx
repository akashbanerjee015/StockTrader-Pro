import { createContext, useState, useEffect } from 'react';
import { getCurrentUser, isAuthenticated } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    const loadUser = async () => {
      if (isAuth) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user:', error);
          setIsAuth(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [isAuth]);

  const logout = () => {
    setUser(null);
    setIsAuth(false);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuth, setIsAuth, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};