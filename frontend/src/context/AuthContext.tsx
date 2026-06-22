"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  gstin: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
  apiUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('riya_touch_token');
      const storedUser = localStorage.getItem('riya_touch_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      localStorage.removeItem('riya_touch_token');
      localStorage.removeItem('riya_touch_user');
    }
    setLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('riya_touch_token', newToken);
    localStorage.setItem('riya_touch_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('riya_touch_token');
    localStorage.removeItem('riya_touch_user');
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('riya_touch_user', JSON.stringify(newUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, apiUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
