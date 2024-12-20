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
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';
import Title from '@/components/Title/Title';
import ClienteService from '@/services/clienteService';
import { DataTable } from '@/components/tables/DataTable';

dayjs.locale('es');

interface Empresa {
  nombre: string;
  cuit: string;
  proviene: string;
}

interface Row {
  id?: string;
  bofech: string;
  tipo_comprobante: string;
  tipo_iva: string;
  formulario: number;
  numero: number;
  razon_social: string;
  cuit: number;
  monto_gravado: number;
  iva1: number;
  iva2: number;
  iva3: number;
  monto_no_gravado: number;
  impuestos: number;
  retenciones: number;
  ingresos_brutos: number;
  iibb: number;
  ganancias: number;
  cuenta: number;
  desc_libro: string;
  fecha_ingreso: string;
  fecha: string;
  importe: number;
  abrev_provincia: string;
  cod_jurisdiccion: number;
  total_iva: number;
}

const ivaComprasColumns = [
  { id: 'fecha', label: 'Fecha', width: 100 },
  { id: 'tipo_comprobante', label: 'TC', width: 70 },
  { id: 'tipo_iva', label: 'Desconocido', width: 100 },
  { id: 'formulario', label: 'Sucu', width: 80 },
  { id: 'razon_social', label: 'Razón Social', width: 200 },
  { id: 'cuit', label: 'Cuit', width: 130 },
  { id: 'monto_gravado', label: 'Neto Gravado', width: 130 },
  { id: 'iva1', label: 'IVA 21%', width: 130 },
  { id: 'iva2', label: 'IVA 10,5%', width: 130 },
  { id: 'iva3', label: 'IVA 27%', width: 130 },
  { id: 'monto_no_gravado', label: 'No Gravado', width: 130 },
  { id: 'impuestos', label: 'Impuesto Interno', width: 130 },
  { id: 'retenciones', label: 'Ret. 3%', width: 130 },
  { id: 'ingresos_brutos', label: 'Ret. IIBB CABA', width: 130 },
  { id: 'iibb', label: 'Ret IIBB Pcia.', width: 130 },
  { id: 'ganancias', label: 'Ret IIBB Otras', width: 130 },
  { id: 'cuenta', label: 'Cta Contable', width: 130 },
  { id: 'desc_libro', label: 'Descr. Cta. Cont.', width: 200 },
  { id: 'fecha_ingreso', label: 'Fecha Ingr.', width: 100 },
  { id: 'bofech', label: 'Fecha Decl.', width: 100 },
  { id: 'importe', label: 'Total', width: 130 },
  { id: 'abrev_provincia', label: 'Jurisdicción', width: 130 },
  { id: 'cod_jurisdiccion', label: 'Cod. Jur.', width: 100 },
];

const IvaComprasDetailVs = () => {
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

      const response = await ClienteService.getSubdiarioIvaComprasVs(params);
      const responseData = response.data;

      // Asegurarse de que cada fila tenga un ID único
      const rowsWithIds = responseData.map((row: Row, index: number) => ({
        ...row,
        id: row.id || `iva-compras-vs-${index}`
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
      <Title>Subdiario IVA Compras</Title>
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

      {rows.length > 0 && (
        <DataTable
          columns={ivaComprasColumns}
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

export default IvaComprasDetailVs;
