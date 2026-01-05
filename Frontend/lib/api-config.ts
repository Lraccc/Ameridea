// API Configuration for Frontend
const DEV_API_URL = 'http://localhost:3001';
const PROD_API_URL = 'https://your-production-api.com';

export const API_URL = process.env.NODE_ENV === 'development' ? DEV_API_URL : PROD_API_URL;

export const API_CONFIG = {
  BASE_URL: API_URL,
  TIMEOUT: 10000,
};

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
  
  // Bills
  BILLS: '/api/bills',
  BILL_BY_ID: (id: string) => `/api/bills/${id}`,
  PAY_BILL: (id: string) => `/api/bills/${id}/pay`,
};
