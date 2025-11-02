import { createContext } from 'react';
import type { User } from '../services/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username?: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  clearSuccessMessage: () => void;
  isAdmin: () => boolean;
  isEditor: () => boolean;
  hasRole: (role: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);