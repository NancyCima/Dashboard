import api from '../api';

export interface Company {
  nombre: string;
  cuit: string;
  proviene: string;
}

export interface CompanyResponse {
  status: string;
  message: string;
  data: Company[];
}

export const companyService = {
  async getCompanies(): Promise<Company[]> {
    try {
      const response = await api.get<CompanyResponse>('/cliente/empresas');
      return response.data.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Error al obtener empresas';
      throw new Error(errorMessage);
    }
  }
};