import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['/api/auth/user'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (loginData: LoginData) => {
      const response = await apiRequest('POST', '/api/auth/login', loginData);
      return response.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['/api/auth/user'], user);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (registerData: RegisterData) => {
      const response = await apiRequest('POST', '/api/auth/register', registerData);
      return response.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(['/api/auth/user'], user);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/logout', {});
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/user'], null);
      queryClient.clear();
    },
  });

  return {
    user: user as User | null,
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