"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Fallback provider for static export when Privy is not configured
const FallbackAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = () => {
    // Mock login for static export
    const mockUser: User = {
      id: 'static-user',
      email: 'usuario@ejemplo.com',
      kycVerified: false,
    };
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    isAuthenticated: !!user,
    user,
    loading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <FallbackAuthProvider>{children}</FallbackAuthProvider>;
}; 