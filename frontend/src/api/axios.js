import axios from 'axios';

function resolveApiBaseUrl() {
  const raw = import.meta.env.VITE_API_URL?.trim();
  if (raw) return raw.replace(/\/$/, '');
  if (import.meta.env.DEV) return 'http://localhost:5000/api';
  // Production on Vercel: same-origin /api → serverless proxy (BACKEND_URL), no public API URL in the client
  return '/api';
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 409) {
      const err = new Error(
        error.response?.data?.message ||
          'This slot is no longer available. Please choose another.'
      );
      err.isSlotConflict = true;
      err.response = error.response;
      return Promise.reject(err);
    }
    const msg =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong';
    const e = new Error(msg);
    e.response = error.response;
    return Promise.reject(e);
  }
);

export default api;
