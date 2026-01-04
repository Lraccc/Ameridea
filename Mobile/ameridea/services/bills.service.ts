import { apiClient } from './api';
import { API_ENDPOINTS } from '../config/api';
import { BillsPayable } from '../types/auth';

export const billsService = {
  async getAllBills(): Promise<BillsPayable[]> {
    return apiClient.get<BillsPayable[]>(API_ENDPOINTS.BILLS);
  },

  async getBillById(id: string): Promise<BillsPayable> {
    return apiClient.get<BillsPayable>(API_ENDPOINTS.BILL_BY_ID(id));
  },

  async payBill(id: string): Promise<BillsPayable> {
    return apiClient.post<BillsPayable>(API_ENDPOINTS.PAY_BILL(id));
  },
};
