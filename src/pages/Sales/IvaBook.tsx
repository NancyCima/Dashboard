import { useState, useEffect, useRef } from 'react';
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
} from '@mui/material';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Title from '@/components/Title/Title';
import ClienteService from '@/services/clienteService';

interface Empresa {
  nombre: string;
  proviene: string;
}

interface IvaData {
  fecha: string;
  total_iva: number;
}

interface IvaMensual {
  fecha: string;
  total_iva: number;
}

const agruparPorMes = (datos: IvaData[]): IvaMensual[] => {
  const mesesAgrupados = datos.reduce((acc: { [key: string]: number }, item) => {
    // Convertir la fecha a formato YYYY-MM
    const fecha = item.fecha.substring(0, 7);
    acc[fecha] = (acc[fecha] || 0) + item.total_iva;
    return acc;
  }, {});

  // Convertir el objeto agrupado a un array y ordenar por fecha
  return Object.entries(mesesAgrupados)
    .map(([fecha, total_iva]) => ({
      fecha: fecha,
      total_iva: Number(total_iva.toFixed(2)) // Redondear a 2 decimales
    }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
};

export default function IvaBook() {
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [chartData, setChartData] = useState<IvaMensual[]>([]);
  const chartRef = useRef<am5.Root | null>(null);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await ClienteService.getEmpresas();
        console.log('Respuesta del servicio:', response);
        const empresasData = Array.isArray(response) ? response : [];
        setEmpresas(empresasData);
        // Seleccionar la primera empresa si existe
        if (empresasData.length > 0) {
          setSelectedEmpresa(empresasData[0].nombre);
        }
      } catch (error) {
        console.error('Error al cargar empresas:', error);
        setError('Error al cargar el listado de empresas');
        setEmpresas([]);
      }
    };

    fetchEmpresas();
  }, []);

  useEffect(() => {
    let root: am5.Root;

    if (chartData.length > 0) {
      // Crear instancia del gráfico solo si hay datos
      root = am5.Root.new("chartdiv");
      
      // Establecer tema
      root.setThemes([am5themes_Animated.new(root)]);

      // Crear gráfico XY
      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panY: false,
          layout: root.verticalLayout
        })
      );

      // Crear ejes
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "fecha",
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 30
          })
        })
      );

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );

      // Crear serie
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "IVA",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "total_iva",
          categoryXField: "fecha",
          tooltip: am5.Tooltip.new(root, {
            labelText: "${valueY}"
          })
        })
      );

      // Personalizar las barras
      series.columns.template.setAll({
        cornerRadiusTL: 3,
        cornerRadiusTR: 3,
        strokeOpacity: 0
      });

      // Establecer los datos
      series.data.setAll(chartData);
      xAxis.data.setAll(chartData);

      // Hacer que el gráfico aparezca de una manera animada
      series.appear(1000);
      chart.appear(1000, 100);
    }

    return () => {
      if (root) {
        root.dispose();
      }
    };
  }, [chartData]);

  const handleExecute = async () => {
    if (!startDate || !endDate) {
      setError('Debe seleccionar ambas fechas');
      return;
    }

    if (!selectedEmpresa) {
      setError('Debe seleccionar una empresa');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await ClienteService.getIvaVentasContabilium({
        fecha_desde: startDate.format('YYYY-MM-DD'),
        fecha_hasta: endDate.format('YYYY-MM-DD'),
        empresa: selectedEmpresa
      });
      
      console.log('Respuesta original:', response);
      // Agrupar los datos por mes
      const datosAgrupados = agruparPorMes(response.data);
      console.log('Datos agrupados por mes:', datosAgrupados);
      setChartData(datosAgrupados);
      setSuccess(true);
      
    } catch (error) {
      setError('Error al ejecutar la consulta. Por favor, intente nuevamente.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Title>Libro IVA Ventas</Title>
        <Grid 
          container 
          spacing={2} 
          sx={{ 
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="empresa-label">Empresa</InputLabel>
              <Select
                labelId="empresa-label"
                value={selectedEmpresa || ''}
                label="Empresa"
                onChange={(e) => setSelectedEmpresa(e.target.value)}
              >
                <MenuItem value="">
                  <em>Seleccione una empresa</em>
                </MenuItem>
                {empresas.map((empresa) => (
                  <MenuItem key={empresa.nombre} value={empresa.nombre}>
                    {empresa.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Desde"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="YYYY-MM-DD"
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha Hasta"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="YYYY-MM-DD"
                slotProps={{
                  textField: {
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs="auto" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="Ejecutar">
              <IconButton 
                color="primary" 
                onClick={handleExecute}
                disabled={loading}
                sx={{ 
                  backgroundColor: (theme) => theme.palette.primary.main,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.primary.dark,
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <PlayArrowIcon />
                )}
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>
      {chartData.length > 0 && (
        <Paper sx={{ p: 2, mt: 2 }}>
          <Title>Gráfico de IVA por Mes</Title>
          <div id="chartdiv" style={{ width: '100%', height: '400px' }}></div>
        </Paper>
      )}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar 
        open={success} 
        autoHideDuration={3000} 
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Consulta ejecutada exitosamente
        </Alert>
      </Snackbar>
    </Box>
  );
}
