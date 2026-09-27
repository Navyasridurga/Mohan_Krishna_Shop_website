import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Attach the admin JWT (if present) to every request automatically
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mk_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors so every API call throws a plain, readable message
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'The request took too long. Please check your connection and try again.'
        : 'Something went wrong. Please try again.');
    const details = error.response?.data?.details || null;
    const status = error.response?.status;

    // If the admin session expired, clear it so the UI can redirect to login
    if (status === 401 && localStorage.getItem('mk_admin_token')) {
      localStorage.removeItem('mk_admin_token');
    }

    return Promise.reject({ message, details, status });
  }
);

export default axiosClient;
