import { useState, useEffect } from 'react';
import { TableCell, Input, IconButton, Box } from '@mui/material';
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
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    setEditValue('');
  }, [value]);

  const handleStartEdit = () => {
    setEditValue(value.toString());
    setIsEditing(true);
  };

  const handleSave = () => {
    const numValue = parseFloat(editValue);
    if (!isNaN(numValue)) {
      onSave(numValue);
    }
    setIsEditing(false);
    setEditValue('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue('');
  };

  if (isEditing) {
    return (
      <TableCell align={align} sx={{ p: 0.5 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          gap: 0.5,
          width: '100%'
        }}>
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            type="number"
            sx={{ 
              width: '120px',
              '& input': { textAlign: 'right' }
            }}
            autoFocus
          />
          <Box sx={{ display: 'flex', gap: 0.25, minWidth: 'fit-content' }}>
            <IconButton size="small" onClick={handleSave}>
              <CheckIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleCancel}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </TableCell>
    );
  }

  return (
    <TableCell align={align} sx={{ minWidth: '150px' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-end',
        gap: 0.5,
        width: '100%'
      }}>
        <Box sx={{ 
          flexGrow: 1, 
          textAlign: 'right',
          whiteSpace: 'nowrap'
        }}>
          {formatCurrency(value)}
        </Box>
        <IconButton 
          size="small" 
          onClick={handleStartEdit}
          sx={{ minWidth: 'fit-content' }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>
    </TableCell>
  );
};