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

  let data;
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await response.json();
    } catch {
      data = {};
    }
  } else {
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text || `HTTP ${response.status} ${response.statusText}` };
    }
  }

  if (!response.ok) {
<<<<<<< HEAD
    if (response.status === 401 && !endpoint.includes('/auth/login')) {
=======
    if (response.status === 401) {
>>>>>>> c282c1146c0ed5459baf610ed72c1e737dd8c6a3
      localStorage.removeItem('ph_token');
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    const error = new Error(data?.message || `API error (${response.status})`);
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
