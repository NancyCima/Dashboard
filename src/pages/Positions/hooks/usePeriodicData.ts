import { useState } from 'react';
import { customDataService } from '@/services/customDataService';
import { IVAData } from '../types';
import dayjs from 'dayjs';

export const usePeriodicData = (mainData: IVAData[]) => {
  const [periodData, setPeriodData] = useState<IVAData[]>(mainData);

  const loadPeriodData = async (period: string | undefined) => {
    // Resetear los datos de Despachos CF cuando no hay período seleccionado
    if (!period) {
      setPeriodData(getResetData(mainData));
      return;
    }

    try {
      const startDate = dayjs(period).startOf('month').format('YYYY-MM-DD');
      const endDate = dayjs(period).endOf('month').format('YYYY-MM-DD');

      const customData = await customDataService.consultar({
        desde: startDate,
        hasta: endDate
      });

      const updatedData = mainData.map(row => {
        if (row.concepto === 'Despachos CF') {
          return createDespachosRow(row, customData);
        }
        return row;
      });

      setPeriodData(updatedData);
    } catch (error) {
      console.error('Error al cargar datos del período:', error);
      setPeriodData(getResetData(mainData));
    }
  };

  return {
    periodData,
    loadPeriodData
  };
};

// Funciones auxiliares
const getResetData = (mainData: IVAData[]): IVAData[] => {
  return mainData.map(row => ({
    ...row,
    id: undefined,
    ...(row.concepto === 'Despachos CF' && {
      import: 0,
      distrimar: 0,
      junimar: 0,
      gondolaLed: 0,
      warnesTelas: 0,
      aladmar: 0,
      aftermarket: 0
    })
  }));
};

const createDespachosRow = (row: IVAData, customData: any[]): IVAData => {
  const resetRow = {
    ...row,
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
  }, resetRow);
};