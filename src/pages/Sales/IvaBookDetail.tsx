import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Title from '@/components/Title/Title';
import ClienteService from '@/services/clienteService';

dayjs.locale('es');

interface Row {
  id: string | number;  // Required by DataGrid
  fecha: string;
  tipo_comprobante: string;
  tipo_iva: string;
  razon_social: string;
  cuit: string;
  neto: number;
  total_iva: number;
  total: number;
}

interface Empresa {
  nombre: string;
  cuit: string;
  proviene: string;
}

type PeriodoOption = 'mes_actual' | 'mes_anterior' | 'ultimos_3_meses' | 'ultimos_6_meses' | 'ultimo_año';
type VistaIva = 'ventas' | 'compras';

const formatCurrency = (value: any): string => {
  if (value === null || value === undefined) return '$0,00';
  // Asegurarse de que el valor sea un número
  const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
  if (isNaN(numValue)) return '$0,00';
  
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
};

export default function IvaBookDetail() {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('');
  const [selectedPeriodo, setSelectedPeriodo] = useState<PeriodoOption>('mes_actual');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [vistaIva, setVistaIva] = useState<VistaIva>('ventas');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await ClienteService.getEmpresas();
        setEmpresas(response);
        // Seleccionar la primera empresa si existe
        if (response && response.length > 0) {
          setSelectedEmpresa(response[0].cuit);
        }
      } catch (error) {
        console.error('Error fetching empresas:', error);
        setError('Error al cargar las empresas');
      }
    };

    fetchEmpresas();
  }, []);

  const calcularFechas = (periodo: PeriodoOption): { fecha_desde: string; fecha_hasta: string } => {
    const now = dayjs();
    let fechaDesde, fechaHasta;

    switch (periodo) {
      case 'mes_actual':
        fechaDesde = now.startOf('month').format('YYYY-MM-DD');
        fechaHasta = now.format('YYYY-MM-DD');
        break;
      case 'mes_anterior':
        fechaDesde = now.subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
        fechaHasta = now.subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
        break;
      case 'ultimos_3_meses':
        fechaDesde = now.subtract(2, 'month').startOf('month').format('YYYY-MM-DD');
        fechaHasta = now.format('YYYY-MM-DD');
        break;
      case 'ultimos_6_meses':
        fechaDesde = now.subtract(5, 'month').startOf('month').format('YYYY-MM-DD');
        fechaHasta = now.format('YYYY-MM-DD');
        break;
      case 'ultimo_año':
        fechaDesde = now.subtract(11, 'month').startOf('month').format('YYYY-MM-DD');
        fechaHasta = now.format('YYYY-MM-DD');
        break;
      default:
        fechaDesde = now.startOf('month').format('YYYY-MM-DD');
        fechaHasta = now.format('YYYY-MM-DD');
    }

    return { fecha_desde: fechaDesde, fecha_hasta: fechaHasta };
  };

  const handleSearch = async () => {
    if (!selectedEmpresa) {
      setError('Por favor seleccione una empresa');
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

    const { fecha_desde, fecha_hasta } = calcularFechas(selectedPeriodo);

    try {
      let responseData;

      if (empresaSeleccionada.proviene === 'Contabilium') {
        const params = {
          fecha_desde,
          fecha_hasta,
          cuit: empresaSeleccionada.cuit
        };

        if (vistaIva === 'ventas') {
          const response = await ClienteService.getIvaVentasContabilium(params);
          responseData = response.data;
        } else {
          const response = await ClienteService.getIvaComprasContabilium(params);
          responseData = response.data;
        }
      } else {
        const params = {
          fecha_desde,
          fecha_hasta,
          nombre_empresa: empresaSeleccionada.nombre
        };

        if (vistaIva === 'ventas') {
          const response = await ClienteService.getSubdiarioIvaVentas(params);
          responseData = response.data;
        } else {
          const response = await ClienteService.getSubdiarioIvaCompras(params);
          responseData = response.data;
        }
      }

      if (responseData && responseData.length > 0) {
        console.log('Primera fila:', {
          datos: responseData[0],
          campos: Object.keys(responseData[0]),
          tipos: {
            neto: typeof responseData[0].neto,
            total_iva: typeof responseData[0].total_iva,
            total: typeof responseData[0].total
          }
        });
      }
      
      setRows(responseData || []);
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
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Title>Libro IVA Detalle</Title>
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Empresa</InputLabel>
              <Select
                value={selectedEmpresa}
                label="Empresa"
                onChange={(e) => setSelectedEmpresa(e.target.value)}
              >
                {empresas.map((empresa) => (
                  <MenuItem key={empresa.cuit} value={empresa.cuit}>
                    {empresa.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Período</InputLabel>
              <Select
                value={selectedPeriodo}
                label="Período"
                onChange={(e) => setSelectedPeriodo(e.target.value as PeriodoOption)}
              >
                <MenuItem value="mes_actual">Mes actual</MenuItem>
                <MenuItem value="mes_anterior">Mes anterior</MenuItem>
                <MenuItem value="ultimos_3_meses">Últimos 3 meses</MenuItem>
                <MenuItem value="ultimos_6_meses">Últimos 6 meses</MenuItem>
                <MenuItem value="ultimo_año">Último año</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={vistaIva}
                onChange={(e) => setVistaIva(e.target.value as VistaIva)}
              >
                <FormControlLabel value="ventas" control={<Radio size="small" />} label="Ventas" />
                <FormControlLabel value="compras" control={<Radio size="small" />} label="Compras" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="Buscar">
              <IconButton
                color="primary"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : <PlayArrowIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Comprobante</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="right">Neto</TableCell>
              <TableCell align="right">IVA</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{dayjs(row.fecha).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>{`${row.tipo_comprobante || ''} ${row.tipo_iva || ''}`}</TableCell>
                  <TableCell>{`${row.razon_social || ''} ${row.cuit || ''}`}</TableCell>
                  <TableCell align="right">{formatCurrency(row.neto)}</TableCell>
                  <TableCell align="right">{formatCurrency(row.total_iva)}</TableCell>
                  <TableCell align="right">{formatCurrency(row.total)}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success">
          Consulta ejecutada exitosamente
        </Alert>
      </Snackbar>
    </Box>
  );
}
