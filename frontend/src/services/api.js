import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('khankhoj_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('khankhoj_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          if (res.data.access) {
            localStorage.setItem('khankhoj_access_token', res.data.access);
            api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          localStorage.removeItem('khankhoj_access_token');
          localStorage.removeItem('khankhoj_refresh_token');
          localStorage.removeItem('khankhoj_user');
          window.dispatchEvent(new Event('auth-logout'));
        }
      }
    }
    return Promise.reject(error);
  }
);

// API Service functions
export const authService = {
  login: (username, password) => api.post('/auth/login/', { username, password }),
  register: (userData) => api.post('/auth/register/', userData),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/', data),
};

export const cityService = {
  getAll: (popular = false) => api.get('/cities/', { params: { popular } }),
  getBySlug: (slug) => api.get(`/cities/${slug}/`),
};

export const foodService = {
  getAll: (params = {}) => api.get('/foods/', { params }),
  getById: (id) => api.get(`/foods/${id}/`),
};

export const placeService = {
  getAll: (params = {}) => api.get('/places/', { params }),
  getById: (id) => api.get(`/places/${id}/`),
  submitPlace: (placeData) => api.post('/places/submit/', placeData),
  addReview: (placeId, reviewData) => api.post(`/places/${placeId}/reviews/`, reviewData),
  toggleFavorite: (placeId) => api.post(`/places/${placeId}/favorite/`),
  getFavorites: () => api.get('/favorites/'),
};

export const searchService = {
  globalSearch: (query) => api.get('/search/', { params: { q: query } }),
  getAIRecommendations: (criteria) => api.post('/recommendations/ai/', criteria),
};

export default api;
