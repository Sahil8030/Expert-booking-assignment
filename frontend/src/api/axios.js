import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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
