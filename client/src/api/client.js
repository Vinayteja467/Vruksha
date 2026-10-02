const RAW_API_URL = import.meta.env.VITE_API_URL || '';
const API_BASE_URL = RAW_API_URL ? `${RAW_API_URL.replace(/\/$/, '')}/api` : '/api';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('ph_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong with the API request');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const api = {
  get: (endpoint, options) => apiFetch(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options) => apiFetch(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options) => apiFetch(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: (endpoint, options) => apiFetch(endpoint, { method: 'DELETE', ...options }),
};
