import React, { createContext, useContext, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import axios from 'axios';
import { authAPI, registerAuthCallbacks } from '@/lib/api';

export interface User {
  _id: string;
  name: string;
  email: string;
  tier?: string;
  phone?: string;
  avatar?: string;
  height?: number;
  weight?: number;
  age?: number;
  gender?: string;
  fitnessGoal?: string;
  activityLevel?: string;
  dietaryPreference?: string;
  preferences?: {
    biometricSync?: boolean;
    darkMode?: boolean;
    pushNotifications?: boolean;
    publicProfile?: boolean;
  };
  subscription?: {
    plan?: string;
    status?: string;
    startDate?: string;
  };
  stats?: {
    consistency?: number;
    totalWorkouts?: number;
    level?: number;
  };
  createdAt?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  /** Re-fetch profile from API and sync localStorage (after profile update). */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseStoredUser(): User | null {
  const stored = localStorage.getItem('pulse_user');
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as User & { id?: string };
    if (parsed && !parsed._id && parsed.id) parsed._id = parsed.id;
    return parsed as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    registerAuthCallbacks({
      onSessionInvalid: () => {
        localStorage.removeItem('pulse_auth');
        localStorage.removeItem('pulse_user');
        localStorage.removeItem('pulse_token');
        setIsAuthenticated(false);
        setUser(null);
      },
    });
    return () => registerAuthCallbacks({});
  }, []);

  // Validate session on load: Bearer + httpOnly cookies; refresh on 401 is handled in api.ts
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await authAPI.getProfile();
        if (cancelled) return;
        const u = res.data.data as User & { id?: string };
        if (u && !u._id && u.id) u._id = u.id;
        setUser(u);
        setIsAuthenticated(true);
        localStorage.setItem('pulse_auth', 'true');
        localStorage.setItem('pulse_user', JSON.stringify(u));
      } catch (e) {
        if (cancelled) return;
        if (axios.isAxiosError(e) && !e.response) {
          const cached = parseStoredUser();
          if (cached && localStorage.getItem('pulse_auth') === 'true') {
            setUser(cached);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
          return;
        }
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('pulse_auth');
        localStorage.removeItem('pulse_user');
        localStorage.removeItem('pulse_token');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    const { user: u, accessToken } = res.data.data;
    // Normalize _id
    if (u && !u._id && (u as any).id) u._id = (u as any).id;
    localStorage.setItem('pulse_auth', 'true');
    localStorage.setItem('pulse_user', JSON.stringify(u));
    if (accessToken) localStorage.setItem('pulse_token', accessToken);
    setIsAuthenticated(true);
    setUser(u);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await authAPI.register(name, email, password);
    const { user: u, accessToken } = res.data.data;
    // Normalize _id
    if (u && !u._id && (u as any).id) u._id = (u as any).id;
    localStorage.setItem('pulse_auth', 'true');
    localStorage.setItem('pulse_user', JSON.stringify(u));
    if (accessToken) localStorage.setItem('pulse_token', accessToken);
    setIsAuthenticated(true);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    authAPI.logout().catch(() => {});
    localStorage.removeItem('pulse_auth');
    localStorage.removeItem('pulse_user');
    localStorage.removeItem('pulse_token');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await authAPI.getProfile();
    const u = res.data.data as User & { id?: string };
    if (u && !u._id && (u as { id?: string }).id) u._id = (u as { id: string }).id;
    setUser(u);
    localStorage.setItem('pulse_user', JSON.stringify(u));
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
