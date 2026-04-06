'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginResponse } from '@/lib/api';

interface AuthContextType {
  user: LoginResponse | null;
  login: (user: LoginResponse) => void;
  logout: () => void;
  isAuthenticated: boolean;
  /** False until localStorage has been read (avoids redirect race on refresh) */
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (storedUser && isLoggedIn) {
      try {
        const parsedUser = JSON.parse(storedUser) as LoginResponse;
        if (parsedUser?.id && parsedUser?.email && parsedUser?.role) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('isLoggedIn');
        }
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
      }
    }
    setIsReady(true);
  }, []);

  const login = (userData: LoginResponse) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isReady }}>
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
