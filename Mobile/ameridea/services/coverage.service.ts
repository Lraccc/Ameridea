import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Coverage } from '../types/coverage';

interface CoverageSummary {
  totalLimit: number;
  totalUsed: number;
  totalRemaining: number;
}

export const coverageService = {
  async getAllCoverage(): Promise<Coverage[]> {
    return apiClient.get<Coverage[]>(API_ENDPOINTS.COVERAGE);
  },

  async getCoverageById(id: string): Promise<Coverage> {
    return apiClient.get<Coverage>(API_ENDPOINTS.COVERAGE_BY_ID(id));
  },

  async getCoverageSummary(): Promise<CoverageSummary> {
    return apiClient.get<CoverageSummary>(API_ENDPOINTS.COVERAGE_SUMMARY);
  },
};
