// API Configuration
const DEV_API_URL = 'http://192.168.1.16:3000';
const PROD_API_URL = 'https://your-production-api.com';

export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

// API Config object for services
export const API_CONFIG = {
  BASE_URL: API_URL,
  TIMEOUT: 10000, // 10 seconds
};
  
// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/api/auth/register',
  LOGIN: '/api/auth/login',
  ME: '/api/auth/me',
  LOGOUT: '/api/auth/logout',
  
  // Claims
  CLAIMS: '/api/claims',
  CLAIM_BY_ID: (id: string) => `/api/claims/${id}`,
  
  // Coverage
  COVERAGE: '/api/coverage',
  COVERAGE_BY_ID: (id: string) => `/api/coverage/${id}`,
  COVERAGE_SUMMARY: '/api/coverage/summary',
  
  // Messages
  CONVERSATIONS: '/api/messages/conversations',
  CONVERSATION_MESSAGES: (id: string) => `/api/messages/conversations/${id}/messages`,
  SEND_MESSAGE: (id: string) => `/api/messages/conversations/${id}/messages`,
  MARK_READ: (id: string) => `/api/messages/conversations/${id}/read`,
  
  // Bills
  BILLS: '/api/bills',
  BILL_BY_ID: (id: string) => `/api/bills/${id}`,
  PAY_BILL: (id: string) => `/api/bills/${id}/pay`,
};