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

interface IvaData {
  fecha: string;
  total_iva: number;
}

interface IvaMensual {
  fecha: string;
  total_iva_ventas?: number;
  total_iva_compras?: number;
}

interface Empresa {
  nombre: string;
  proviene: string;
}

type ViewType = 'ventas' | 'compras' | 'ambos';

function agruparPorMes(ventasData: IvaData[] = [], comprasData: IvaData[] = []): IvaMensual[] {
  const mesesMap = new Map<string, IvaMensual>();

  // Procesar datos de ventas
  ventasData.forEach(item => {
    const fecha = item.fecha.substring(0, 7); // YYYY-MM
    const existingData = mesesMap.get(fecha) || { fecha };
    mesesMap.set(fecha, {
      ...existingData,
      total_iva_ventas: (existingData.total_iva_ventas || 0) + item.total_iva
    });
  });

  // Procesar datos de compras
  comprasData.forEach(item => {
    const fecha = item.fecha.substring(0, 7); // YYYY-MM
    const existingData = mesesMap.get(fecha) || { fecha };
    mesesMap.set(fecha, {
      ...existingData,
      total_iva_compras: (existingData.total_iva_compras || 0) + item.total_iva
    });
  });

  return Array.from(mesesMap.values()).sort((a, b) => a.fecha.localeCompare(b.fecha));
}

export default function IvaBook() {
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('');
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [chartData, setChartData] = useState<IvaMensual[]>([]);
  const [viewType, setViewType] = useState<ViewType>('ambos');
  const chartRef = useRef<am5.Root | null>(null);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await ClienteService.getEmpresas();
        setEmpresas(response.data);
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    };

    fetchEmpresas();
  }, []);

  useEffect(() => {
    if (chartData.length > 0) {
      // Dispose of previous chart if it exists
      if (chartRef.current) {
        chartRef.current.dispose();
      }

      // Create root element
      const root = am5.Root.new("chartdiv");
      chartRef.current = root;

      // Set themes
      root.setThemes([am5themes_Animated.new(root)]);

      // Create chart
      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          pinchZoomX: true,
        })
      );

      // Add cursor
      chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "none"
      }));

      // Create axes
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "fecha",
          renderer: am5xy.AxisRendererX.new(root, {}),
          tooltip: am5.Tooltip.new(root, {}),
        })
      );

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
      );

      // Create series based on view type
      if (viewType === 'ambos' || viewType === 'ventas') {
        const ventasSeries = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: "Ventas",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "total_iva_ventas",
            categoryXField: "fecha",
            tooltip: am5.Tooltip.new(root, {
              labelText: "Ventas: {valueY}",
            }),
          })
        );
        ventasSeries.columns.template.setAll({
          fill: am5.color(0x0066cc),
          strokeWidth: 0,
        });
      }

      if (viewType === 'ambos' || viewType === 'compras') {
        const comprasSeries = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: "Compras",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "total_iva_compras",
            categoryXField: "fecha",
            tooltip: am5.Tooltip.new(root, {
              labelText: "Compras: {valueY}",
            }),
          })
        );
        comprasSeries.columns.template.setAll({
          fill: am5.color(0xff6666),
          strokeWidth: 0,
        });
      }

      // Set data
      xAxis.data.setAll(chartData);
      chart.series.each((series) => {
        series.data.setAll(chartData);
      });

      // Add legend
      const legend = chart.children.push(am5.Legend.new(root, {}));
      legend.data.setAll(chart.series.values);

      // Make stuff animate on load
      chart.appear(1000, 100);

      return () => {
        root.dispose();
      };
    }
  }, [chartData, viewType]);

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
      const [ventasResponse, comprasResponse] = await Promise.all([
        ClienteService.getIvaVentas({
          fecha_desde: startDate.format('YYYY-MM-DD'),
          fecha_hasta: endDate.format('YYYY-MM-DD'),
          empresa: selectedEmpresa
        }),
        ClienteService.getIvaComprasContabilium({
          fecha_desde: startDate.format('YYYY-MM-DD'),
          fecha_hasta: endDate.format('YYYY-MM-DD'),
          cuit: selectedEmpresa
        })
      ]);
      
      const datosAgrupados = agruparPorMes(
        ventasResponse.data,
        comprasResponse.data
      );
      
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
    <Box sx={{ p: 2 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Empresa</InputLabel>
              <Select
                value={selectedEmpresa}
                label="Empresa"
                onChange={(e) => setSelectedEmpresa(e.target.value)}
              >
                {empresas.map((empresa) => (
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
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha hasta"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={2}>
            <FormControl fullWidth>
              <InputLabel>Ver</InputLabel>
              <Select
                value={viewType}
                label="Ver"
                onChange={(e) => setViewType(e.target.value as ViewType)}
              >
                <MenuItem value="ambos">Ambos</MenuItem>
                <MenuItem value="ventas">Ventas</MenuItem>
                <MenuItem value="compras">Compras</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs="auto">
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
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
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
