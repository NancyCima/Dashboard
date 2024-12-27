import { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Title from '@/components/Title/Title';
import { useCurrentAccount } from './hooks/useCurrentAccount';
import { useCompanies } from './hooks/useCompanies';
import { CurrentAccountSummary } from './components/CurrentAccountSummary';

export const CurrentAccount = () => {
  const [selectedEmpresa, setSelectedEmpresa] = useState('');
  const [clientId, setClientId] = useState('');
  const { data, loading: accountLoading, error: accountError, fetchCurrentAccount } = useCurrentAccount();
  const { companies, loading: companiesLoading, error: companiesError } = useCompanies();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmpresa && clientId) {
      fetchCurrentAccount(selectedEmpresa, parseInt(clientId, 10));
    }
  };

  const error = accountError || companiesError;
  const loading = accountLoading || companiesLoading;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Title>Cuentas Corrientes</Title>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="empresa-label">Empresa</InputLabel>
                <Select
                  labelId="empresa-label"
                  value={selectedEmpresa}
                  label="Empresa"
                  onChange={(e) => setSelectedEmpresa(e.target.value)}
                  required
                  disabled={companiesLoading}
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
              <TextField
                fullWidth
                label="ID Cliente"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                type="number"
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip title="Buscar">
                <IconButton
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ height: 'fit-content' }}
                >
                  {loading ? <CircularProgress size={24} /> : <PlayArrowIcon color="primary" />}
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {data && <CurrentAccountSummary data={data} />}
    </Box>
  );
};