import { useState } from 'react';
import { IVAData } from '../types';

export const useIvaEditing = (mainData: IVAData[], onDataChange: (data: IVAData[]) => void) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingEdit, setPendingEdit] = useState<{
    index: number;
    field: keyof IVAData;
    value: number;
  } | null>(null);

  const handleEditConfirm = () => {
    if (pendingEdit) {
      const newData = [...mainData];
      newData[pendingEdit.index] = {
        ...newData[pendingEdit.index],
        [pendingEdit.field]: pendingEdit.value
      };
      onDataChange(newData);
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