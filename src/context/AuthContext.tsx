import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, AuthTokens } from '../types';
import { 
  apiService, 
  getStoredTokens, 
  setStoredTokens, 
  getUseMockMode, 
  setUseMockMode,
  setStoredMockUserId 
} from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  useMockMode: boolean;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  toggleMockMode: () => void;
  selectMockUser: (userId: number) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(getStoredTokens());
  const [useMockMode, setMockModeState] = useState<boolean>(getUseMockMode());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { addToast } = useToast();

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const profile = await apiService.getCurrentUser();
      setUser(profile);
    } catch (err: any) {
      console.warn('Failed to load user profile:', err);
      // If profile fails, clear session
      setUser(null);
      setStoredTokens(null);
      setTokens(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const currentTokens = getStoredTokens();
    if (currentTokens) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await apiService.login(username, password);
      setTokens({ access: res.access, refresh: res.refresh });
      
      if (res.user) {
        setUser(res.user);
      } else {
        await fetchProfile();
      }
      
      addToast('success', 'Authentication Successful', `Welcome back, ${username}!`);
      return true;
    } catch (err: any) {
      const errMsg = err.response?.data?.detail || err.message || 'Login failed. Please check credentials.';
      addToast('error', 'Authentication Failed', errMsg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setStoredTokens(null);
    setTokens(null);
    setUser(null);
    addToast('info', 'Logged Out', 'You have been signed out of the portal.');
  };

  const toggleMockMode = () => {
    const nextVal = !useMockMode;
    setUseMockMode(nextVal);
    setMockModeState(nextVal);
    addToast(
      'info',
      nextVal ? 'Switched to Mock Demo Mode' : 'Switched to Live Backend Mode',
      nextVal
        ? 'Using simulated REST API memory engine.'
        : 'Connecting to local Django backend at http://127.0.0.1:8000.'
    );
  };

  const selectMockUser = async (userId: number) => {
    setStoredMockUserId(userId);
    if (!tokens) {
      const mockTokens: AuthTokens = {
        access: `mock_access_jwt_${userId}`,
        refresh: `mock_refresh_jwt_${userId}`
      };
      setStoredTokens(mockTokens);
      setTokens(mockTokens);
    }
    await fetchProfile();
    addToast('info', 'Switched Persona', 'Switched user role for demonstration.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated: !!user,
        isLoading,
        useMockMode,
        login,
        logout,
        toggleMockMode,
        selectMockUser,
        refreshProfile: fetchProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
