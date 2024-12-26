import { useState } from 'react';
import { IVAData } from '../types';
import { customDataService } from '@/services/customDataService';
import dayjs from 'dayjs';

export const useIvaEditing = (
  periodData: IVAData[], 
  onDataChange: (data: IVAData[]) => void,
  selectedPeriod?: string
) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{
    index: number;
    field: keyof IVAData;
    value: number;
  } | null>(null);

  const handleEditConfirm = async () => {
    if (!pendingEdit || !selectedPeriod) return;

    try {
      const { index, field, value } = pendingEdit;
      const row = periodData[index];
      
      if (row.concepto === 'Despachos CF') {
        const startDate = dayjs(selectedPeriod).startOf('month').format('YYYY-MM-DD');
        const endDate = dayjs(selectedPeriod).endOf('month').format('YYYY-MM-DD');
        
        if (row.id) {
          await customDataService.actualizar({
            id: row.id,
            tipo_dato: 'Despachos CF',
            valor: value
          });
        } else {
          const newRecord = await customDataService.crear({
            tipo_dato: 'Despachos CF',
            desde: startDate,
            hasta: endDate,
            empresa: String(field),
            valor: value
          });
          
          row.id = newRecord.id;
        }
      }

      const newData = [...periodData];
      newData[index] = {
        ...newData[index],
        [field]: value
      };
      onDataChange(newData);
    } catch (error) {
      console.error('Error al guardar el dato:', error);
    } finally {
      setConfirmDialogOpen(false);
      setPendingEdit(null);
    }
  };

  const handleEdit = (index: number, field: keyof IVAData, value: number) => {
    setPendingEdit({ index, field, value });
    setConfirmDialogOpen(true);
  };

  return {
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleEdit,
    handleEditConfirm
  };
};