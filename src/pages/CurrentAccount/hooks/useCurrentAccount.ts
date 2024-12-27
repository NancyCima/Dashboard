import { useState } from 'react';
import { currentAccountService } from '@/services/api/currentAccountService';
import type { CurrentAccountData } from '../types';

export const useCurrentAccount = () => {
  const [data, setData] = useState<CurrentAccountData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentAccount = async (empresa: string, idCliente: number) => {
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      const response = await currentAccountService.getCurrentAccountTotal({
        empresa,
        id_cliente: idCliente
      });
      
      if (response.status === 'success') {
        setData(response.data);
      } else {
        throw new Error('Error al obtener los datos');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener los datos';
      setError(message);
      console.error('Error fetching current account:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fetchCurrentAccount
  };
};