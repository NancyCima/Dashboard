import { useState } from 'react';
import { customDataService, CustomData } from '@/services/customDataService';

export const useCustomData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomData = async (
    tipoDato: string,
    desde: string,
    hasta: string
  ): Promise<CustomData[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await customDataService.consultar({
        tipo_dato: tipoDato,
        desde,
        hasta
      });
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Error al obtener los datos personalizados';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchCustomData,
    loading,
    error,
    clearError: () => setError(null)
  };
};