import { useState } from 'react';
import { IVAData } from '../types';
import { customDataService } from '@/services/customDataService';
import dayjs from 'dayjs';

export const useIvaEditing = (
  mainData: IVAData[], 
  onDataChange: (data: IVAData[]) => void,
  selectedPeriod?: string
) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{
    index: number;
    field: keyof IVAData;
    value: number;
    isNew?: boolean;
  } | null>(null);

  const handleEditConfirm = async () => {
    if (!pendingEdit) return;

    try {
      const { index, field, value } = pendingEdit;
      const row = mainData[index];
      
      if (row.concepto === 'Despachos CF') {
        const startDate = dayjs(selectedPeriod).startOf('month').format('YYYY-MM-DD');
        const endDate = dayjs(selectedPeriod).endOf('month').format('YYYY-MM-DD');
        
        if (!row.id) {
          // Create new custom data
          await customDataService.crear({
            tipo_dato: 'Despachos CF',
            desde: startDate,
            hasta: endDate,
            empresa: String(field),
            valor: value
          });
        } else {
          // Update existing custom data
          await customDataService.actualizar({
            id: row.id,
            tipo_dato: 'Despachos CF',
            valor: value
          });
        }
      }

      const newData = [...mainData];
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