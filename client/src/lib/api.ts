import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach token from localStorage fallback ───
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pulse_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: unwrap ApiResponse data ──────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ── Auth API ───────────────────────────────────────────────────────
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    api.post('/users/register', { name, email, password }),

  login: (email: string, password: string) =>
    api.post('/users/login', { email, password }),

  logout: () => api.post('/users/logout'),

  getProfile: () => api.get('/users/profile'),

  updateProfile: (data: Record<string, unknown>) =>
    api.patch('/users/profile', data),

  refreshToken: () => api.post('/users/refresh-token'),
};

// ── Workout API ────────────────────────────────────────────────────
export const workoutAPI = {
  getAll: (params?: { tag?: string; difficulty?: string }) =>
    api.get('/workouts', { params }),

  getById: (id: string) => api.get(`/workouts/${id}`),

  getMy: () => api.get('/workouts/my'),

  create: (data: {
    title: string;
    duration: string;
    tag: string;
    difficulty?: string;
    equipment?: string;
    description?: string;
    exercises?: Array<{ name: string; sets: number; reps: string; rest?: string }>;
  }) => api.post('/workouts', data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/workouts/${id}`, data),

  delete: (id: string) => api.delete(`/workouts/${id}`),
};

// ── Meal / Nutrition API ───────────────────────────────────────────
export const mealAPI = {
  getAll: (params?: { date?: string }) =>
    api.get('/nutrition/meals', { params }),

  getSummary: () => api.get('/nutrition/summary'),

  create: (data: {
    name: string;
    type: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fats?: number;
    items?: Array<{ name: string; cals: number }>;
    time?: string;
  }) => api.post('/nutrition/meals', data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/nutrition/meals/${id}`, data),

  delete: (id: string) => api.delete(`/nutrition/meals/${id}`),
};

// ── Contact API ────────────────────────────────────────────────────
export const contactAPI = {
  submit: (data: { name: string; email: string; message: string }) =>
    api.post('/contact', data),
};

// ── BMI API ────────────────────────────────────────────────────────
export const bmiAPI = {
  save: (data: {
    height: number;
    weight: number;
    unit: string;
    bmiValue: number;
    category: string;
  }) => api.post('/bmi', data),

  getHistory: () => api.get('/bmi/history'),
};

export default api;
