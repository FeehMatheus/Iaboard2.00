import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { User } from '@shared/schema';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

let authCache: { user: User | null; lastChecked: number } = { user: null, lastChecked: 0 };

export function useAuth() {
  const [user, setUser] = useState<User | null>(authCache.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const now = Date.now();
      // Only check auth if cache is older than 30 seconds
      if (now - authCache.lastChecked < 30000) {
        setUser(authCache.user);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const userData = await response.json();
          authCache = { user: userData, lastChecked: now };
          setUser(userData);
        } else {
          authCache = { user: null, lastChecked: now };
          setUser(null);
        }
      } catch (err) {
        authCache = { user: null, lastChecked: now };
        setUser(null);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (loginData: LoginData) => {
      const response = await apiRequest('POST', '/api/auth/login', loginData);
      return response.json();
    },
    onSuccess: (userData) => {
      authCache = { user: userData, lastChecked: Date.now() };
      setUser(userData);
      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (registerData: RegisterData) => {
      const response = await apiRequest('POST', '/api/auth/register', registerData);
      return response.json();
    },
    onSuccess: (userData) => {
      authCache = { user: userData, lastChecked: Date.now() };
      setUser(userData);
      // Redirect to dashboard after successful registration
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/logout', {});
    },
    onSuccess: () => {
      authCache = { user: null, lastChecked: Date.now() };
      setUser(null);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}