import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Claim } from '../types/claims';

export const claimsService = {
  async getAllClaims(): Promise<Claim[]> {
    return apiClient.get<Claim[]>(API_ENDPOINTS.CLAIMS);
  },

  async getClaimById(id: string): Promise<Claim> {
    return apiClient.get<Claim>(API_ENDPOINTS.CLAIM_BY_ID(id));
  },

  async submitClaim(claimData: Partial<Claim>): Promise<Claim> {
    return apiClient.post<Claim>(API_ENDPOINTS.CLAIMS, claimData);
  },

  async updateClaim(id: string, updates: Partial<Claim>): Promise<Claim> {
    return apiClient.put<Claim>(API_ENDPOINTS.CLAIM_BY_ID(id), updates);
  },
};
