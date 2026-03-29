import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User {
  name: string;
  email: string;
  tier: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
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

  const login = useCallback((email: string, _password: string) => {
    const u: User = { ...DEFAULT_USER, email };
    localStorage.setItem('pulse_auth', 'true');
    localStorage.setItem('pulse_user', JSON.stringify(u));
    setIsAuthenticated(true);
    setUser(u);
  }, []);

  const register = useCallback((name: string, email: string, _password: string) => {
    const u: User = { name, email, tier: 'Starter' };
    localStorage.setItem('pulse_auth', 'true');
    localStorage.setItem('pulse_user', JSON.stringify(u));
    setIsAuthenticated(true);
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('pulse_auth');
    localStorage.removeItem('pulse_user');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
