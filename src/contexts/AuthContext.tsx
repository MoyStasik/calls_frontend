// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User } from '../utils/api';
import { useRouter } from 'next/navigation';

// Определяем тип контекста
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    nickname: string;
    login: string;
    password: string;
    confirmPassword: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
};

// Создаем контекст с типом
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер контекста
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Проверяем токен при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const userData = await api.getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Ошибка проверки токена:', error);
          api.clearToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Функция входа
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.login(email, password);
      api.setToken(response.token);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      router.push('/');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция регистрации
  const register = async (data: {
    nickname: string;
    login: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await api.register(data);
      api.setToken(response.token);
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      router.push('/');
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Функция выхода
  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    } finally {
      setUser(null);
      api.clearToken();
      localStorage.removeItem('user');
      router.push('/auth/login');
    }
  };

  // Функция обновления пользователя
  const updateUser = async (data: Partial<User>) => {
    try {
      if (user) {
        const updatedUser = await api.updateProfile(data);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      throw error;
    }
  };

  // Значение контекста
  const contextValue: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Хук для использования контекста
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}
