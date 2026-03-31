import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

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
    image?: string;
    exercises?: Array<{ name: string; sets: number; reps: string; duration?: string; rest?: string; notes?: string }>;
  }) => api.post('/workouts', data),

  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/workouts/${id}`, data),

  delete: (id: string) => api.delete(`/workouts/${id}`),

  addExercise: (
    workoutId: string,
    data: { name: string; sets: number; reps: string; duration?: string; rest?: string; notes?: string }
  ) => api.post(`/workouts/${workoutId}/exercises`, data),
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

export const dietAPI = {
  getAll: () => api.get("/nutrition/diets"),

  getById: (id: string) => api.get(`/nutrition/diets/${id}`),

  create: (data: { title: string; dietName?: string; description?: string; meals?: Array<Record<string, unknown>> }) =>
    api.post("/nutrition/diets", data),

  update: (id: string, data: { title?: string; description?: string }) =>
    api.put(`/nutrition/diets/${id}`, data),

  delete: (id: string) => api.delete(`/nutrition/diets/${id}`),

  addMeal: (
    dietId: string,
    data: {
      name: string;
      calories?: number;
      protein?: number;
      carbs?: number;
      fats?: number;
      quantity?: string;
      time?: string;
      notes?: string;
    }
  ) => api.post(`/nutrition/diets/${dietId}/meals`, data),
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

// ── Progress API ───────────────────────────────────────────────────
export const progressAPI = {
  /** Aggregated dashboard data: user summary, weekly chart, nutrition, recent sessions */
  getDashboard: () => api.get('/progress/dashboard'),

  /** All-time stats + 7-day chart + streak */
  getStats: () => api.get('/progress/stats'),

  /** Recent workout sessions */
  getSessions: (limit = 20) => api.get('/progress/sessions', { params: { limit } }),

  /** Weight log history */
  getWeightHistory: (limit = 30) => api.get('/progress/weight', { params: { limit } }),

  /** Add a new weight entry */
  addWeight: (weight: number, unit: string = 'kg', date?: string) =>
    api.post('/progress/weight', { weight, unit, date }),
};

export default api;

