import { useState } from 'react';
import { Dayjs } from 'dayjs';
import { useCustomData } from './useCustomData';
import { useSnackbar } from '@/hooks/useSnackbar';
import { IVAData } from '../types';

export const usePositionsData = (initialData: IVAData[]) => {
  const [data, setData] = useState(initialData);
  const { fetchCustomData } = useCustomData();
  const { showSuccess, showError } = useSnackbar();

  const updateData = async (period: Dayjs | null, dataType: string) => {
    if (!period) return;

    const startOfMonth = period.startOf('month');
    const endOfMonth = period.endOf('month');

    try {
      const response = await fetchCustomData(
        'DISTRIMAR',
        dataType,
        startOfMonth.format('YYYY-MM-DD'),
        endOfMonth.format('YYYY-MM-DD')
      );

      if (response.length > 0) {
        const newData = data.map(row => {
          if (row.concepto === dataType) {
            return {
              ...row,
              import: response[0].valor
            };
          }
          return row;
        });

        setData(newData);
        showSuccess(`Datos de ${dataType} actualizados`);
      }
    } catch (err) {
      showError(`Error al obtener datos de ${dataType}`);
    }
  };

  return {
    data,
    setData,
    updateData
  };
};