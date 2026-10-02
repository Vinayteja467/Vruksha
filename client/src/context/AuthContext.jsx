import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ph_token'));
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        console.warn('Session expired or invalid token', err);
        localStorage.removeItem('ph_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('ph_token', data.token);
        setToken(data.token);
        setUser(data.user);
        addToast(`Welcome back, ${data.user.name.split(' ')[0]}!`, 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.data?.message || err.message || 'Login failed';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const data = await api.post('/auth/register', userData);
      if (data.success) {
        localStorage.setItem('ph_token', data.token);
        setToken(data.token);
        setUser(data.user);
        addToast('Account created successfully! Welcome to VRUKSHA.', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.data?.message || err.message || 'Registration failed';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('ph_token');
    setToken(null);
    setUser(null);
    addToast('You have been logged out', 'info');
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await api.put('/auth/profile', profileData);
      if (data.success) {
        setUser(data.user);
        addToast('Profile updated successfully', 'success');
        return { success: true };
      }
    } catch (err) {
      const msg = err.data?.message || err.message || 'Could not update profile';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Demo Login Helper
  const quickLogin = async (role = 'user') => {
    if (role === 'admin') {
      return await login('admin@pureharvest.in', 'Admin@123');
    }
    return await login('user@pureharvest.in', 'User@123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
        quickLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
