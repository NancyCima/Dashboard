import { useState, useEffect } from 'react';
import { Company } from '@/types/company';
import { companyService } from '@/services/api/companyService';

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const data = await companyService.getCompanies();
        setCompanies(data);
      } catch (err) {
        setError('Error al cargar las empresas');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, loading, error };
};