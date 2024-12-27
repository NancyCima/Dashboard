import { Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DateRangePicker } from '../DateRangePicker';
import { LoadingButton } from '../LoadingButton';
import { Company } from '@/services/api/companyService';
import { Dayjs } from 'dayjs';

interface SearchFormProps {
  companies: Company[];
  selectedCompany: string;
  onCompanyChange: (company: string) => void;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
  onSubmit: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const SearchForm = ({
  companies,
  selectedCompany,
  onCompanyChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onSubmit,
  loading,
  disabled
}: SearchFormProps) => (
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={12} sm={4}>
      <FormControl fullWidth>
        <InputLabel id="empresa-label">Empresa</InputLabel>
        <Select
          labelId="empresa-label"
          value={selectedCompany}
          label="Empresa"
          onChange={(e) => onCompanyChange(e.target.value)}
          disabled={disabled || loading}
        >
          {companies.map((empresa) => (
            <MenuItem key={empresa.cuit} value={empresa.nombre}>
              {empresa.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    
    <Grid item xs={12} sm={6}>
      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
      />
    </Grid>
    
    <Grid item xs={12} sm={2}>
      <LoadingButton
        onClick={onSubmit}
        loading={loading}
        disabled={disabled}
        sx={{ height: 'fit-content' }}
      />
    </Grid>
  </Grid>
);
