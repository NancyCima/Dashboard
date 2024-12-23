import api from './api';
import { Company } from '@/types/company';

export const companyService = {
  async getCompanies(): Promise<Company[]> {
    try {
      const response = await api.get('/api/cliente/empresas');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }
};