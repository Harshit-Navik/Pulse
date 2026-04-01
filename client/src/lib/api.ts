import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

type AuthCallbacks = {
  onSessionInvalid?: () => void;
};

let authCallbacks: AuthCallbacks = {};

/** Called from AuthProvider so 401 after failed refresh can clear React auth state. */
export function registerAuthCallbacks(callbacks: AuthCallbacks) {
  authCallbacks = callbacks;
}

let refreshPromise: Promise<void> | null = null;

/**
 * Refresh access token using httpOnly refresh cookie (and optional body).
 * Uses a standalone request so the api interceptor does not recurse.
 */
async function refreshAccessToken(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const { data } = await axios.post(
          `${API_BASE_URL}/users/refresh-token`,
          {},
          {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const accessToken = data?.data?.accessToken as string | undefined;
        if (accessToken) {
          localStorage.setItem('pulse_token', accessToken);
        }
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

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

// ── Response interceptor: refresh on 401, then normalize errors ────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as typeof error.config & { _retry?: boolean };

    // Offline / CORS / no response — preserve axios error for callers (e.g. auth bootstrap)
    if (!error.response) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = String(originalRequest?.url ?? '');

    const isAuthRoute =
      url.includes('/users/login') ||
      url.includes('/users/register') ||
      url.includes('/users/refresh-token');

    if (
      status === 401 &&
      originalRequest &&
      !isAuthRoute &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        return api(originalRequest);
      } catch (refreshErr) {
        if (axios.isAxiosError(refreshErr) && !refreshErr.response) {
          return Promise.reject(refreshErr);
        }
        authCallbacks.onSessionInvalid?.();
        const message =
          error.response?.data?.message || 'Session expired. Please sign in again.';
        return Promise.reject(new Error(message));
      }
    }

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

  changePassword: (currentPassword: string, newPassword: string) =>
    api.patch('/users/password', { currentPassword, newPassword }),

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

  /** All-time stats + activity chart (range: week | month | year) + streak */
  getStats: (params?: { range?: 'week' | 'month' | 'year' }) =>
    api.get('/progress/stats', { params }),

  /** Recent workout sessions */
  getSessions: (limit = 20) => api.get('/progress/sessions', { params: { limit } }),

  /** Weight log history */
  getWeightHistory: (limit = 30) => api.get('/progress/weight', { params: { limit } }),

  /** Add a new weight entry */
  addWeight: (weight: number, unit: string = 'kg', date?: string) =>
    api.post('/progress/weight', { weight, unit, date }),
};

export default api;

