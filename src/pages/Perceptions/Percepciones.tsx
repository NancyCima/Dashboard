import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Title from '@/components/Title/Title';
import { DataTable } from '@/components/tables/DataTable';
import ClienteService from '@/services/clienteService';
import { Dayjs } from 'dayjs';
import { percepcionesColumns } from './config/tableColumns';

interface Row {
  id: string | number;
  fecha: string;
  comprobante: string;
  condicion_iva: string;
  razon_social: string;
  cuit: string;
  importe: number;
  importe_total: number;
}

interface Empresa {
  nombre: string;
  cuit: string;
  proviene: string;
}

const Percepciones = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await ClienteService.getEmpresas();
        setEmpresas(response);
      } catch (error) {
        console.error('Error al obtener empresas:', error);
        setError('Error al cargar las empresas');
      }
    };

    fetchEmpresas();
  }, []);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setError('Debe seleccionar ambas fechas');
      return;
    }

    if (!selectedEmpresa) {
      setError('Debe seleccionar una empresa');
      return;
    }

    const empresaSeleccionada = empresas.find(emp => emp.cuit === selectedEmpresa);
    if (!empresaSeleccionada) {
      setError('No se encontró la empresa seleccionada');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const params = {
        fecha_desde: startDate.format('YYYY-MM-DD'),
        fecha_hasta: endDate.format('YYYY-MM-DD'),
        cuit: empresaSeleccionada.cuit
      };

      const response = await ClienteService.getPerceptions(params);
      const responseData = response.data;

      // Asegurarse de que cada fila tenga un ID único
      const rowsWithIds = responseData.map((row: Row, index: number) => ({
        ...row,
        id: row.id || `perception-${index}`
      }));

      setRows(rowsWithIds);
      if (!responseData || responseData.length === 0) {
        setError('No se encontraron datos para los criterios seleccionados');
      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al obtener los datos');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Title>Percepciones</Title>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="empresa-label">Empresa</InputLabel>
              <Select
                labelId="empresa-label"
                value={selectedEmpresa}
                label="Empresa"
                onChange={(e) => setSelectedEmpresa(e.target.value)}
              >
                {empresas
                  .filter((empresa) => empresa.proviene === "Contabilium")
                  .map((empresa) => (
                    <MenuItem key={empresa.cuit} value={empresa.cuit}>
                      {empresa.nombre}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha desde"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha hasta"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: { fullWidth: true },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="Buscar">
              <IconButton
                onClick={handleSearch}
                disabled={loading}
                sx={{ height: 'fit-content' }}
              >
                {loading ? <CircularProgress size={24} /> : <PlayArrowIcon color="primary" />}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Datos cargados exitosamente
        </Alert>
      )}

      {rows.length > 0 && (
        <DataTable
          columns={percepcionesColumns}
          rows={rows}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Box>
  );
};

export default Percepciones;