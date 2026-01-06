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
    // Always clear token locally, even if API call fails
    try {
      await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Ignore logout API errors (token might be expired)
      console.log('Logout API call failed, clearing local token anyway');
    }
    await apiClient.clearAuthToken();
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiClient.put<{ message: string }>(
      API_ENDPOINTS.UPDATE_PASSWORD,
      { currentPassword, newPassword }
    );
  },

  async updateEmail(newEmail: string): Promise<{ message: string; email: string }> {
    return apiClient.put<{ message: string; email: string }>(
      API_ENDPOINTS.UPDATE_EMAIL,
      { newEmail }
    );
  },

  async updateProfile(data: { fullName?: string; dateOfBirth?: string }): Promise<{ message: string; user: User }> {
    return apiClient.put<{ message: string; user: User }>(
      API_ENDPOINTS.UPDATE_PROFILE,
      data
    );
  },

  async updateProfilePicture(profilePicture: string): Promise<{ message: string; user: User }> {
    return apiClient.put<{ message: string; user: User }>(
      API_ENDPOINTS.UPDATE_PROFILE,
      { profilePicture }
    );
  },
};
