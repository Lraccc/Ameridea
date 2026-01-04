import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/api';
import { LoginCredentials, RegisterData, User } from '../types/auth';

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.REGISTER,
      data,
      false
    );
    
    // Store token
    await apiClient.setAuthToken(response.token);
    
    return response;
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      credentials,
      false
    );
    
    // Store token
    await apiClient.setAuthToken(response.token);
    
    return response;
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.ME);
  },

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.LOGOUT);
    await apiClient.clearAuthToken();
  },
};
