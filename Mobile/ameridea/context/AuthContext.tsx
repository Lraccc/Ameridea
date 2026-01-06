import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { AuthState, User, LoginCredentials, RegisterData } from '@/types/auth';
import { authService } from '@/services/auth.service';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'CHECK_AUTH_START' }
  | { type: 'CHECK_AUTH_COMPLETE' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'CHECK_AUTH_START':
      return { ...state, loading: true };
    case 'CHECK_AUTH_COMPLETE':
      return { ...state, loading: false };
    case 'LOGIN_START':
      return { ...state, loading: true };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true, // Start with loading true to check stored auth
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: 'CHECK_AUTH_START' });
      const userData = await AsyncStorage.getItem('user');
      const authToken = await AsyncStorage.getItem('authToken');
      
      if (userData && authToken) {
        const user = JSON.parse(userData);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'CHECK_AUTH_COMPLETE' });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      dispatch({ type: 'CHECK_AUTH_COMPLETE' });
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await authService.login(credentials);
      
      // Store both user data and auth token for persistence
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      // Note: authService.login already stores the token via apiClient.setAuthToken
      await AsyncStorage.setItem('loginTime', new Date().toISOString());
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await authService.register(data);
      
      // Store both user data and auth token for persistence
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      // Note: authService.register already stores the token via apiClient.setAuthToken
      await AsyncStorage.setItem('loginTime', new Date().toISOString());
      
      dispatch({ type: 'REGISTER_SUCCESS', payload: response.user });
      return true;
    } catch (error) {
      console.error('Register error:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      
      // Clear all stored auth data
      await AsyncStorage.multiRemove(['user', 'authToken', 'loginTime']);
      
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API call fails
      await AsyncStorage.multiRemove(['user', 'authToken', 'loginTime']);
      dispatch({ type: 'LOGOUT' });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}