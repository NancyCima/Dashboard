import { Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';

interface DateRangePickerProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

export const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: DateRangePickerProps) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <DatePicker
          label="Fecha desde"
          value={startDate}
          onChange={onStartDateChange}
          format="DD/MM/YYYY"
          slotProps={{
            textField: { fullWidth: true }
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <DatePicker
          label="Fecha hasta"
          value={endDate}
          onChange={onEndDateChange}
          format="DD/MM/YYYY"
          slotProps={{
            textField: { fullWidth: true }
          }}
        />
      </Grid>
    </Grid>
  </LocalizationProvider>
);