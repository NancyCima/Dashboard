import { useState } from 'react';
import { TableCell, Input, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { formatCurrency } from '@/utils/formatters';

interface EditableCellProps {
  value: number;
  onSave: (value: number) => void;
  align?: 'right' | 'left' | 'center';
}

export const EditableCell = ({ value, onSave, align = 'right' }: EditableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const handleSave = () => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue)) {
      onSave(numValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TableCell align={align} sx={{ p: 1 }}>
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          type="number"
          sx={{ width: '120px' }}
        />
        <IconButton size="small" onClick={handleSave}>
          <CheckIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleCancel}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </TableCell>
    );
  }

  return (
    <TableCell align={align}>
      {formatCurrency(value)}
      <IconButton size="small" onClick={() => setIsEditing(true)}>
        <EditIcon fontSize="small" />
      </IconButton>
    </TableCell>
  );
};