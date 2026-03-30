import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '@/lib/api';

interface User {
  _id?: string;
  name: string;
  email: string;
  tier: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  name: 'Julian Pierce',
  email: 'j.pierce@monolith.com',
  tier: 'Elite',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('pulse_auth') === 'true';
  });

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('pulse_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  // Attempt to restore session from token on mount
  useEffect(() => {
    const token = localStorage.getItem('pulse_token');
    if (token) {
      authAPI
        .getProfile()
        .then((res) => {
          const u = res.data.data;
          setUser(u);
          setIsAuthenticated(true);
          localStorage.setItem('pulse_auth', 'true');
          localStorage.setItem('pulse_user', JSON.stringify(u));
        })
        .catch(() => {
          // Token expired or invalid — keep local state as fallback
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    const { user: u, accessToken } = res.data.data;
    localStorage.setItem('pulse_auth', 'true');
    localStorage.setItem('pulse_user', JSON.stringify(u));
    if (accessToken) localStorage.setItem('pulse_token', accessToken);
    setIsAuthenticated(true);
    setUser(u);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await authAPI.register(name, email, password);
    const { user: u, accessToken } = res.data.data;
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

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
