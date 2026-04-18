import axios from 'axios';

/**
 * ─────────────────────────────────────────────────────────────
 * Centralized Axios Instance — Smart Digital Bank
 * ─────────────────────────────────────────────────────────────
 *
 * Base URL is resolved from environment variables (Vite):
 *   • Development (.env.development) → http://localhost:9090
 *   • Production  (.env.production)  → https://bank-application-backend-nx8s.onrender.com
 *
 * Usage:
 *   import api from '../services/api';
 *   const res = await api.get('/transactions/9876543210');
 *   await api.post('/user', { name: 'John' });
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000, // 20s — Render free tier cold starts can take 10-15s
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// ─── Request Interceptor ────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Attach auth token if available (future JWT support)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log outgoing requests in development
    if (import.meta.env.DEV) {
      console.log(`📡 [API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ── No response at all (network error / CORS / timeout) ──
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        error.userMessage = '⏳ Request timed out. The server may be waking up — please try again in a moment.';
        console.warn('[API] Request timed out:', error.config?.url);
      } else if (error.message?.includes('Network Error')) {
        error.userMessage = '🌐 Cannot reach the server. Check your internet connection or try again later.';
        console.warn('[API] Network error:', error.message);
      } else {
        error.userMessage = '❌ An unexpected connection error occurred.';
        console.error('[API] Unknown error:', error);
      }
      return Promise.reject(error);
    }

    // ── Server responded with an error status ──
    const { status, data } = error.response;

    switch (status) {
      case 400:
        error.userMessage = data?.message || '⚠️ Bad request — please check your input.';
        break;
      case 401:
        error.userMessage = '🔒 Session expired — please log in again.';
        console.warn('[API] Unauthorized — clearing session.');
        localStorage.removeItem('authToken');
        // Optionally redirect: window.location.href = '/login';
        break;
      case 403:
        error.userMessage = '🚫 You do not have permission to perform this action.';
        break;
      case 404:
        error.userMessage = data?.message || '🔍 The requested resource was not found.';
        break;
      case 409:
        error.userMessage = data?.message || '⚡ A conflict occurred — the resource may already exist.';
        break;
      case 500:
        error.userMessage = '🛠️ Internal server error — our team has been notified.';
        break;
      case 502:
      case 503:
        error.userMessage = '☁️ Server is temporarily unavailable — it may be spinning up. Please retry in 30 seconds.';
        break;
      default:
        error.userMessage = data?.message || `❌ Unexpected error (${status}).`;
    }

    if (import.meta.env.DEV) {
      console.error(`[API] ${status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, data);
    }

    return Promise.reject(error);
  }
);

// ─── Helper: Extract user-friendly error message ────────────
/**
 * Use in catch blocks to get a friendly message:
 *
 *   try { ... }
 *   catch(err) { setError(getErrorMessage(err)); }
 */
export const getErrorMessage = (error) => {
  if (error.userMessage) return error.userMessage;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'Something went wrong. Please try again.';
};

export default api;
