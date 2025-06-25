"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
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

const AuthProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { login, logout, authenticated, user: privyUser, ready } = usePrivy();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ready) {
      if (authenticated && privyUser) {
        // Convert Privy user to our User type
        const hondurasUser: User = {
          id: privyUser.id,
          email: privyUser.email?.address,
          walletAddress: privyUser.wallet?.address,
          phone: privyUser.phone?.number,
          kycVerified: false, // Will be updated after KYC
        };
        setUser(hondurasUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [ready, authenticated, privyUser]);

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const handleLogin = () => {
    console.log('Login button clicked');
    try {
      login();
    } catch (error) {
      console.error('Login error:', error);
      alert('Error al iniciar sesión. Verifica la configuración de Privy.');
    }
  };

  const value: AuthContextType = {
    isAuthenticated: authenticated,
    user,
    loading,
    login: handleLogin,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
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
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  // Use fallback provider for static export when Privy is not configured
  if (!appId || appId === 'your-privy-app-id') {
    console.warn('⚠️ Privy App ID no configurado. Usando modo estático.');
    return <FallbackAuthProvider>{children}</FallbackAuthProvider>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ['email', 'sms'],
        appearance: {
          theme: 'light',
          accentColor: '#1e3a8a', // Darker blue for Honduras theme
          showWalletLoginFirst: false,
        },
      }}
    >
      <AuthProviderInner>{children}</AuthProviderInner>
    </PrivyProvider>
  );
}; 