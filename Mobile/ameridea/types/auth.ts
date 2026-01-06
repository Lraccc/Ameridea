export interface User {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  policyNumber: string;
  policyStatus: 'Active' | 'Inactive' | 'Pending';
  profilePicture?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  dateOfBirth: string;
}