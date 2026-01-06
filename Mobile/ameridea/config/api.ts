// API Configuration
// Add your IP address here - the app will try each one until it connects
const DEV_IPS = [
  '10.0.61.198',    // Your IP (PC15)
  '192.168.1.16',   // Friend's IP
];
const DEV_PORT = '3000';

// Try to connect to available backend
const DEV_API_URL = `http://${DEV_IPS[0]}:${DEV_PORT}`;
const PROD_API_URL = 'https://your-production-api.com';

export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

// Export IPs for dynamic connection
export const DEV_BACKEND_IPS = DEV_IPS;
export const DEV_BACKEND_PORT = DEV_PORT;

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
  UPDATE_PASSWORD: '/api/auth/password',
  UPDATE_EMAIL: '/api/auth/email',
  UPDATE_PROFILE: '/api/auth/profile',
  
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