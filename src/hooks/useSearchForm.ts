// src/hooks/useSearchForm.ts
import { useState } from 'react';
import { Dayjs } from 'dayjs';
import { useCompanies } from './useCompanies';

export const useSearchForm = () => {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const { companies, loading: companiesLoading, error: companiesError } = useCompanies();

  const isValid = () => {
    return selectedCompany && startDate && endDate;
  };

  const reset = () => {
    setSelectedCompany('');
    setStartDate(null);
    setEndDate(null);
  };

  return {
    selectedCompany,
    setSelectedCompany,
    startDate,
    setStartDate,
    endDate, 
    setEndDate,
    companies,
    companiesLoading,
    companiesError,
    isValid,
    reset
  };
};
