import { useState } from 'react';
import { IVAData } from '../types';

export const useDespachosCF = () => {
  const [editingValue, setEditingValue] = useState<string>('');
  
  const resetDespachosCF = (row: IVAData): IVAData => ({
    ...row,
    id: undefined,
    import: 0,
    distrimar: 0,
    junimar: 0,
    gondolaLed: 0,
    warnesTelas: 0,
    aladmar: 0,
    aftermarket: 0
  });

  const startEditing = (value: number) => {
    setEditingValue(value.toString());
  };

  const clearEditing = () => {
    setEditingValue('');
  };

  return {
    editingValue,
    startEditing,
    clearEditing,
    resetDespachosCF
  };
};