import { useState, useCallback } from 'react';
import { customDataService } from '@/services/customDataService';
import { IVAData } from '../types';
import dayjs from 'dayjs';
import { useDespachosCF } from './useDespachosCF';

export const usePeriodicData = (mainData: IVAData[]) => {
  const [periodData, setPeriodData] = useState<IVAData[]>(mainData);
  const { resetDespachosCF } = useDespachosCF();

  const resetAllData = useCallback(() => {
    const resetData = mainData.map(row => 
      row.concepto === 'Despachos CF' ? resetDespachosCF(row) : { ...row }
    );
    setPeriodData(resetData);
  }, [mainData]);

  const loadPeriodData = async (period: string | undefined) => {
    // Resetear datos inmediatamente al cambiar período
    resetAllData();

    if (!period) return;

    try {
      const startDate = dayjs(period).startOf('month').format('YYYY-MM-DD');
      const endDate = dayjs(period).endOf('month').format('YYYY-MM-DD');

      const customData = await customDataService.consultar({
        desde: startDate,
        hasta: endDate
      });

      if (customData?.length > 0) {
        const updatedData = mainData.map(row => {
          if (row.concepto === 'Despachos CF') {
            return updateDespachosCFData(row, customData);
          }
          return row;
        });
        setPeriodData(updatedData);
      }
    } catch (error) {
      console.error('Error al cargar datos del período:', error);
      resetAllData();
    }
  };

  return {
    periodData,
    setPeriodData,
    loadPeriodData,
    resetAllData
  };
};

const updateDespachosCFData = (row: IVAData, customData: any[]): IVAData => {
  const baseRow = {
    ...row,
    id: undefined,
    import: 0,
    distrimar: 0,
    junimar: 0,
    gondolaLed: 0,
    warnesTelas: 0,
    aladmar: 0,
    aftermarket: 0
  };

  return customData.reduce((acc, item) => {
    if (item.tipo_dato === 'Despachos CF') {
      const field = item.empresa.toLowerCase() as keyof IVAData;
      if (field in acc) {
        acc[field] = item.valor;
        acc.id = item.id;
      }
    }
    return acc;
  }, baseRow);
};