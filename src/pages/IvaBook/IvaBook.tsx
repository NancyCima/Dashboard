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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Title from '@/components/Title/Title';
import ClienteService from '@/services/clienteService';
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import { useTheme } from '@/contexts/ThemeContext';

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
  const exportingRef = useRef<am5exporting.Exporting | null>(null);
  const { mode } = useTheme();

  const exportChart = () => {
    if (exportingRef.current) {
      exportingRef.current.export("png");
    }
  };

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await ClienteService.getEmpresas();
        setEmpresas(response);
      } catch (error) {
        console.error('Error al obtener empresas:', error);
      }
    };

    fetchEmpresas();
  }, []);

  useEffect(() => {
    if (chartData.length > 0) {
      if (chartRef.current) {
        chartRef.current.dispose();
      }

      const root = am5.Root.new("chartdiv");
      chartRef.current = root;

      root.setThemes([am5themes_Animated.new(root)]);

      // Set dark mode colors for root
      if (mode === 'dark') {
        root.interfaceColors.set("grid", am5.color("#444444"));
        root.interfaceColors.set("text", am5.color("#ffffff"));
      }

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          pinchZoomX: true,
          background: mode === 'dark' ? am5.Rectangle.new(root, {
            fill: am5.color("#1e1e1e"),
            fillOpacity: 1
          }) : undefined
        })
      );

      // Add cursor
      chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "none"
      }));

      // Add export menu
      exportingRef.current = am5exporting.Exporting.new(root, {
        menu: am5exporting.ExportingMenu.new(root, {}),
        filePrefix: "iva-chart"
      });

      // Create axes
      const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "fecha",
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 30,
            cellStartLocation: 0.1,
            cellEndLocation: 0.9
          }),
          tooltip: am5.Tooltip.new(root, {
            themeTags: ["axis"],
            animationDuration: 200
          })
        })
      );

      if (mode === 'dark') {
        xAxis.get("renderer").labels.template.setAll({
          fill: am5.color("#ffffff")
        });
      }

      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {
            minGridDistance: 30
          })
        })
      );

      if (mode === 'dark') {
        yAxis.get("renderer").labels.template.setAll({
          fill: am5.color("#ffffff")
        });
      }

      // Set axis colors for dark mode
      if (mode === 'dark') {
        xAxis.get("renderer").grid.template.setAll({
          stroke: am5.color("#444444"),
          strokeOpacity: 0.5
        });
        yAxis.get("renderer").grid.template.setAll({
          stroke: am5.color("#444444"),
          strokeOpacity: 0.5
        });
      }

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
              labelText: "Ventas: ${valueY}",
              getFillFromSprite: false,
              autoTextColor: false,
              background: am5.Rectangle.new(root, {
                fill: mode === 'dark' ? am5.color("#2d2d2d") : am5.color("#ffffff"),
                stroke: mode === 'dark' ? am5.color("#666666") : am5.color("#000000"),
              })
            }),
          })
        );
        ventasSeries.columns.template.setAll({
          cornerRadiusTL: 3,
          cornerRadiusTR: 3,
          cornerRadiusBL: 0,
          cornerRadiusBR: 0,
          fill: mode === 'dark' ? am5.color("#5c8ee6") : am5.color("#0066cc"),
          strokeOpacity: 0,
          width: am5.percent(70)
        });

        // Add hover state
        ventasSeries.columns.template.states.create("hover", {
          fill: mode === 'dark' ? am5.color("#7ba7ea") : am5.color("#0052a3"),
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
              labelText: "Compras: ${valueY}",
              getFillFromSprite: false,
              autoTextColor: false,
              background: am5.Rectangle.new(root, {
                fill: mode === 'dark' ? am5.color("#2d2d2d") : am5.color("#ffffff"),
                stroke: mode === 'dark' ? am5.color("#666666") : am5.color("#000000"),
              })
            }),
          })
        );
        comprasSeries.columns.template.setAll({
          cornerRadiusTL: 3,
          cornerRadiusTR: 3,
          cornerRadiusBL: 0,
          cornerRadiusBR: 0,
          fill: mode === 'dark' ? am5.color("#e67373") : am5.color("#ff6666"),
          strokeOpacity: 0,
          width: am5.percent(70)
        });

        // Add hover state
        comprasSeries.columns.template.states.create("hover", {
          fill: mode === 'dark' ? am5.color("#eb8c8c") : am5.color("#ff4d4d"),
        });
      }

      // Set data
      xAxis.data.setAll(chartData);
      chart.series.each((series) => {
        series.data.setAll(chartData);
      });

      // Add legend with dark mode support
      const legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        fill: mode === 'dark' ? am5.color("#ffffff") : am5.color("#000000"),
      }));
      legend.data.setAll(chart.series.values);

      // Make stuff animate on load
      chart.appear(1000, 100);

      return () => {
        root.dispose();
      };
    }
  }, [chartData, viewType, mode]);

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
        ClienteService.getIvaVentasContabilium({
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Title>Libro IVA</Title>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Exportar gráfico">
              <IconButton onClick={exportChart} size="small">
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
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
