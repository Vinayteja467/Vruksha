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
<<<<<<< HEAD
      const cleanEmail = String(email || '').trim().toLowerCase();
      const data = await api.post('/auth/login', { email: cleanEmail, password });
      if (data.success && data.user) {
        localStorage.setItem('ph_token', data.token);
        setToken(data.token);
        setUser(data.user);
        const firstName = data.user.name ? data.user.name.split(' ')[0] : 'User';
        addToast(`Welcome back, ${firstName}!`, 'success');
        return { success: true, user: data.user };
      }
      return { success: false, message: data?.message || 'Login failed' };
=======
      const data = await api.post('/auth/login', { email, password });
      if (data.success) {
        localStorage.setItem('ph_token', data.token);
        setToken(data.token);
        setUser(data.user);
        addToast(`Welcome back, ${data.user.name.split(' ')[0]}!`, 'success');
        return { success: true };
      }
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
    } catch (err) {
      const msg = err.data?.message || err.message || 'Login failed';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
<<<<<<< HEAD
      const cleanData = {
        name: String(userData.name || '').trim(),
        email: String(userData.email || '').trim().toLowerCase(),
        phone: String(userData.phone || '').trim(),
        password: String(userData.password || '')
      };
      const data = await api.post('/auth/register', cleanData);
      if (data.success && data.user) {
=======
      const data = await api.post('/auth/register', userData);
      if (data.success) {
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
        localStorage.setItem('ph_token', data.token);
        setToken(data.token);
        setUser(data.user);
        addToast('Account created successfully! Welcome to VRUKSHA.', 'success');
<<<<<<< HEAD
        return { success: true, user: data.user };
      }
      return { success: false, message: data?.message || 'Registration failed' };
=======
        return { success: true };
      }
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
    } catch (err) {
      const msg = err.data?.message || err.message || 'Registration failed';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const logout = () => {
    localStorage.removeItem('ph_token');
    localStorage.removeItem('ph_cart');
    localStorage.removeItem('ph_coupon');
    localStorage.removeItem('ph_wishlist');
    setToken(null);
    setUser(null);
    addToast('You have been logged out', 'info');
    window.dispatchEvent(new CustomEvent('auth:logout'));
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
        updateProfile
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
