'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'champion' | 'admin' | 'worker';
  profileImage?: string;
  totalPoints: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'client' | 'champion' | 'admin' | 'worker') => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastRefreshRef = useRef<number>(0);

  // Wrapper to update both state and localStorage
  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  // Define refreshUser function with debouncing (max once per 5 seconds)
  const refreshUser = useCallback(async () => {
    if (!token) return;

    // Debounce: Only refresh if more than 5 seconds have passed since last refresh
    const now = Date.now();
    if (now - lastRefreshRef.current < 5000) {
      console.log('Skipping refresh - debounced (< 5s since last refresh)');
      return;
    }

    lastRefreshRef.current = now;

    // Use AbortController to avoid long hanging requests
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      console.log('Refreshing user data...');
      const url = typeof window !== 'undefined' ? `${window.location.origin}/api/user` : '/api/user';
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.status === 401) {
        // Unauthorized - clear stored auth
        console.warn('refreshUser: token unauthorized, logging out');
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
          console.log('User data refreshed successfully');
        }
      } else {
        console.warn('refreshUser: non-ok response', response.status);
      }
    } catch (error) {
      if ((error as any).name === 'AbortError') {
        console.warn('refreshUser aborted due to timeout');
      } else {
        console.error('Failed to refresh user:', error);
      }
    } finally {
      clearTimeout(timeout);
    }
  }, [token]);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUserState(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Refresh user data when tab becomes visible (debounced)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && token) {
        // Delay refresh by 2 seconds to avoid rapid calls
        timeoutId = setTimeout(() => {
          void refreshUser().catch((err) => console.error('refreshUser error:', err));
        }, 2000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [token, refreshUser]);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);

    // Store in localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const signup = async (name: string, email: string, password: string, role: 'client' | 'champion' | 'admin' | 'worker') => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Signup failed');
    }

    // Auto login after signup
    await login(email, password);
  };

  const logout = () => {
    setUserState(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, setUser, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
