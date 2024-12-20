import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import Title from '@/components/Title/Title';
import ClienteService from '@/services/clienteService';

dayjs.locale('es');

interface Empresa {
  nombre: string;
  cuit: string;
  proviene: string;
}

interface ConsultaUnificada {
  ventas_df: number;
  neto_gravado: number;
  percep_iibb_ba: number;
  percep_iibb_caba: number;
  compras_cf: number;
  perc_iva: number;
  perc_iibb_caba: number;
  perc_iibb_ba: number;
  percepciones_agip: number;
  retenciones_agip: number;
  iibb_21: number;
  retenciones_iva_caba: number;
  retenciones_iva_pcia: number;
  retenciones_iva_otras: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(value);
};

const ConsultaUnificadaVs = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [data, setData] = useState<ConsultaUnificada | null>(null);
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

    const empresaSeleccionada = empresas.find(emp => emp.nombre === selectedEmpresa);
    if (!empresaSeleccionada) {
      setError('No se encontró la empresa seleccionada');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const params = {
        nombre_empresa: empresaSeleccionada.nombre,
        fecha_desde: startDate.format('YYYY-MM-DD'),
        fecha_hasta: endDate.format('YYYY-MM-DD')
      };

      const response = await ClienteService.getConsultaUnificadaVs(params);
      const responseData = response.data;

      setData(responseData);
      setSuccess(true);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al obtener los datos');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const consultaUnificadaColumns = [
    { id: 'ventas_df', label: 'Ventas DF', width: 130 },
    { id: 'neto_gravado', label: 'Neto Gravado', width: 130 },
    { id: 'percep_iibb_ba', label: 'Percep IIBB BA', width: 130 },
    { id: 'percep_iibb_caba', label: 'Percep IIBB CABA', width: 130 },
    { id: 'compras_cf', label: 'Compras CF', width: 130 },
    { id: 'perc_iva', label: 'PERC IVA', width: 130 },
    { id: 'perc_iibb_caba', label: 'PERC IIBB CABA(-22)', width: 150 },
    { id: 'perc_iibb_ba', label: 'PERC IIBB BA(-23)', width: 150 },
    { id: 'percepciones_agip', label: 'Percepciones AGIP', width: 130 },
    { id: 'retenciones_agip', label: 'Retenciones AGIP', width: 130 },
    { id: 'iibb_21', label: 'IIBB(21)', width: 130 },
    { id: 'retenciones_iva_caba', label: 'Retenciones IVA CABA', width: 150 },
    { id: 'retenciones_iva_pcia', label: 'Retenciones IVA PCIA', width: 150 },
    { id: 'retenciones_iva_otras', label: 'Retenciones IVA Otras', width: 150 }
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Title>Consulta Unificada</Title>
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
                  .filter((empresa) => empresa.proviene === "Sistema VS")
                  .map((empresa) => (
                    <MenuItem key={empresa.nombre} value={empresa.nombre}>
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

      {data && (
        <TableContainer component={Paper} sx={{ mt: 2, overflowX: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {consultaUnificadaColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    style={{ width: column.width }}
                    align="right"
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {consultaUnificadaColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    align="right"
                  >
                    {formatCurrency(data[column.id as keyof ConsultaUnificada])}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ConsultaUnificadaVs;
