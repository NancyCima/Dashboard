import api from '../api';
import { CurrentAccountData } from '@/pages/CurrentAccount/types';

export interface CurrentAccountParams {
  empresa: string;
  id_cliente: number;
}

export interface CurrentAccountResponse {
  status: string;
  data: CurrentAccountData;
}

export const currentAccountService = {
  async getCurrentAccountTotal(params: CurrentAccountParams): Promise<CurrentAccountResponse> {
    try {
      const response = await api.post('/cliente/cuenta-corriente-total', params);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Error al obtener datos de cuenta corriente';
      throw new Error(errorMessage);
    }
  }
};