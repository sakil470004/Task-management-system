/**
 * Auth types for TypeScript type safety
 */

export interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}
