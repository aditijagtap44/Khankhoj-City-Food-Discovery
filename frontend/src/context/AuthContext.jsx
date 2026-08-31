import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('khankhoj_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('khankhoj_access_token');
      if (token) {
        try {
          const res = await authService.getProfile();
          setUser(res.data);
          localStorage.setItem('khankhoj_user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Session check failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();

    const handleLogoutEvent = () => logout();
    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => window.removeEventListener('auth-logout', handleLogoutEvent);
  }, []);

  const login = async (username, password) => {
    const res = await authService.login(username, password);
    localStorage.setItem('khankhoj_access_token', res.data.access);
    localStorage.setItem('khankhoj_refresh_token', res.data.refresh);
    
    // Fetch profile
    const profileRes = await authService.getProfile();
    setUser(profileRes.data);
    localStorage.setItem('khankhoj_user', JSON.stringify(profileRes.data));
    return profileRes.data;
  };

  const register = async (userData) => {
    await authService.register(userData);
    return login(userData.username, userData.password);
  };

  const logout = () => {
    localStorage.removeItem('khankhoj_access_token');
    localStorage.removeItem('khankhoj_refresh_token');
    localStorage.removeItem('khankhoj_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
