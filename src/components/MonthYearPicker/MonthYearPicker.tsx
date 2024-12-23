import { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/es';

interface MonthYearPickerProps {
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  label?: string;
}

export const MonthYearPicker = ({ value, onChange, label = 'Período' }: MonthYearPickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        views={['month', 'year']}
        format="MMMM YYYY"
        slotProps={{
          textField: { fullWidth: true, size: 'small' }
        }}
      />
    </LocalizationProvider>
  );
};