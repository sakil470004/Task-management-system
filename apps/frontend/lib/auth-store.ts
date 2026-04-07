import { create } from 'zustand';
import apiClient from './api';
import { User, LoginResponse } from './auth-types';

/**
 * Auth Store using Zustand
 * Manages global authentication state
 */
interface AuthStore {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
  isAuthenticated: boolean;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  token: null,
  isAuthenticated: false,

  // Initialize auth from localStorage
  initializeAuth: () => {
    const token = localStorage.getItem('accessToken');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (e) {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  // Login function
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', {
        email,
        password,
      });

      const { accessToken, user } = response.data;

      // Save to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      // Update store
      set({
        token: accessToken,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({ isLoading: false });
      throw error.response?.data?.message || 'Login failed';
    }
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
