import { useState, useEffect } from 'react';
import { getCurrentUser, signIn, signOut, signUp } from '../services/auth';
import type { User } from '../services/auth';
import { AuthContext } from './AuthContextValue';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const { user, error } = await getCurrentUser();

      if (error) {
        // Only log error if it's not "Auth session missing!" (which is expected when not logged in)
        if (error.message !== 'Auth session missing!') {
          console.error('Error loading user:', error.message);
        }
      } else if (user) {
        setUser(user);
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    const { user, error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    } else if (user) {
      // Always fetch fresh user data from database after login
      const { user: freshUser, error: fetchError } = await getCurrentUser();
      if (fetchError) {
        console.error('Error fetching fresh user data:', fetchError.message);
        setUser(user); // Use the login result if fetch fails
      } else {
        setUser(freshUser);
      }
    }

    setLoading(false);
  };

  const register = async (email: string, password: string, fullName?: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { user, error } = await signUp(email, password, fullName);

    if (error) {
      setError(error.message);
    } else if (user) {
      setUser(user);
      setSuccessMessage('Please check your email to verify your account.');
    }

    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    
    const { error } = await signOut();
    
    if (error) {
      setError(error.message);
    } else {
      setUser(null);
    }
    
    setLoading(false);
  };

  const clearError = () => {
    setError(null);
  };

  const clearSuccessMessage = () => {
    setSuccessMessage(null);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isEditor = () => {
    return user?.role === 'admin' || user?.role === 'editor';
  };

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const value = {
    user,
    loading,
    error,
    successMessage,
    login,
    register,
    logout,
    clearError,
    clearSuccessMessage,
    isAdmin,
    isEditor,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
