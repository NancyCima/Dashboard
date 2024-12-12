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
} from '@mui/material';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import Title from '@/components/Title/Title';
import ClienteService from '@/services/clienteService';

dayjs.locale('es');

interface Empresa {
  nombre: string;
  cuit: string;
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

interface IvaMensualCompleto {
  fecha: string;
  total_iva_ventas?: number;
  total_iva_compras?: number;
}

interface IvaParams {
  fecha_desde: string;
  fecha_hasta: string;
  cuit: string;
}

const agruparPorMes = (datos: IvaData[]): IvaMensual[] => {
  const mesesAgrupados = datos.reduce((acc: { [key: string]: number }, item) => {
    const fecha = item.fecha.substring(0, 7);
    acc[fecha] = (acc[fecha] || 0) + item.total_iva;
    return acc;
  }, {});

  return Object.entries(mesesAgrupados)
    .map(([fecha, total_iva]) => ({
      fecha: fecha,
      total_iva: Number(total_iva.toFixed(2))
    }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
};

const combinarDatosIva = (ventasData: IvaMensual[], comprasData: IvaMensual[]): IvaMensualCompleto[] => {
  const mesesUnicos = new Set([
    ...ventasData.map(item => item.fecha),
    ...comprasData.map(item => item.fecha)
  ]);

  return Array.from(mesesUnicos)
    .map(fecha => ({
      fecha,
      total_iva_ventas: ventasData.find(v => v.fecha === fecha)?.total_iva || 0,
      total_iva_compras: comprasData.find(c => c.fecha === fecha)?.total_iva || 0
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
  const [chartData, setChartData] = useState<IvaMensualCompleto[]>([]);
  const [vistaIva, setVistaIva] = useState<'ventas' | 'compras' | 'ambos'>('ventas');

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
      root = am5.Root.new("chartdiv");
      root.setThemes([am5themes_Animated.new(root)]);

      const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panY: false,
          layout: root.verticalLayout
        })
      );

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

      if (vistaIva === 'ambos') {
        const ventasSeries = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: "Ventas",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "total_iva_ventas",
            categoryXField: "fecha",
            tooltip: am5.Tooltip.new(root, {
              pointerOrientation: "horizontal",
              labelText: "Ventas: ${valueY}",
              getFillFromSprite: false,
              background: am5.Rectangle.new(root, {
                fill: am5.color("#f3f3f3"),
                fillOpacity: 0.9
              })
            })
          })
        );

        const comprasSeries = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: "Compras",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "total_iva_compras",
            categoryXField: "fecha",
            tooltip: am5.Tooltip.new(root, {
              pointerOrientation: "horizontal",
              labelText: "Compras: ${valueY}",
              getFillFromSprite: false,
              background: am5.Rectangle.new(root, {
                fill: am5.color("#f3f3f3"),
                fillOpacity: 0.9
              })
            })
          })
        );

        ventasSeries.columns.template.setAll({
          cornerRadiusTL: 3,
          cornerRadiusTR: 3,
          strokeOpacity: 0,
          fill: am5.color(0x67B7DC),
          tooltipY: 0,
          tooltipText: "Ventas: {valueY}",
          interactive: true
        });

        comprasSeries.columns.template.setAll({
          cornerRadiusTL: 3,
          cornerRadiusTR: 3,
          strokeOpacity: 0,
          fill: am5.color(0x6794DC),
          tooltipY: 0,
          tooltipText: "Compras: {valueY}",
          interactive: true
        });

        ventasSeries.columns.template.events.on("pointerover", function(ev) {
          const tooltip = ev.target.getTooltip();
          if (tooltip) {
            tooltip.show();
          }
        });

        comprasSeries.columns.template.events.on("pointerover", function(ev) {
          const tooltip = ev.target.getTooltip();
          if (tooltip) {
            tooltip.show();
          }
        });

        const legend = chart.children.push(am5.Legend.new(root, {}));
        legend.data.setAll(chart.series.values);

        ventasSeries.data.setAll(chartData);
        comprasSeries.data.setAll(chartData);
        xAxis.data.setAll(chartData);

        ventasSeries.appear(1000);
        comprasSeries.appear(1000);
      } else {
        const series = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: vistaIva === 'ventas' ? "Ventas" : "Compras",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: vistaIva === 'ventas' ? "total_iva_ventas" : "total_iva_compras",
            categoryXField: "fecha",
            tooltip: am5.Tooltip.new(root, {
              pointerOrientation: "horizontal",
              labelText: "${valueY}",
              getFillFromSprite: false,
              background: am5.Rectangle.new(root, {
                fill: am5.color("#f3f3f3"),
                fillOpacity: 0.9
              })
            })
          })
        );

        series.columns.template.setAll({
          cornerRadiusTL: 3,
          cornerRadiusTR: 3,
          strokeOpacity: 0,
          fill: am5.color(vistaIva === 'ventas' ? 0x67B7DC : 0x6794DC),
          tooltipY: 0,
          tooltipText: "{valueY}",
          interactive: true
        });

        series.columns.template.events.on("pointerover", function(ev) {
          const tooltip = ev.target.getTooltip();
          if (tooltip) {
            tooltip.show();
          }
        });

        series.data.setAll(chartData);
        xAxis.data.setAll(chartData);

        series.appear(1000);
      }

      chart.appear(1000, 100);
    }

    return () => {
      if (root) {
        root.dispose();
      }
    };
  }, [chartData, vistaIva]);

  const handleExecute = async () => {
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
        fecha_desde: startDate.format('YYYY-MM-DD'),
        fecha_hasta: endDate.format('YYYY-MM-DD')
      };

      if (empresaSeleccionada.proviene === 'Contabilium') {
        const ivaParams = { ...params, cuit: empresaSeleccionada.cuit };

        if (vistaIva === 'ventas') {
          const response = await ClienteService.getIvaVentasContabilium(ivaParams);
          const datosAgrupados = agruparPorMes(response.data);
          setChartData(datosAgrupados.map(d => ({ fecha: d.fecha, total_iva_ventas: d.total_iva })));
        } 
        else if (vistaIva === 'compras') {
          const response = await ClienteService.getIvaComprasContabilium(ivaParams);
          const datosAgrupados = agruparPorMes(response.data);
          setChartData(datosAgrupados.map(d => ({ fecha: d.fecha, total_iva_compras: d.total_iva })));
        }
        else {
          const [ventasResponse, comprasResponse] = await Promise.all([
            ClienteService.getIvaVentasContabilium(ivaParams),
            ClienteService.getIvaComprasContabilium(ivaParams)
          ]);

          const ventasData = agruparPorMes(ventasResponse.data);
          const comprasData = agruparPorMes(comprasResponse.data);
          const datosCombinados = combinarDatosIva(ventasData, comprasData);
          setChartData(datosCombinados);
        }
      } 
      else if (empresaSeleccionada.proviene === 'Sistema VS') {
        const subdiarioParams = { ...params, nombre_empresa: empresaSeleccionada.nombre };

        if (vistaIva === 'ventas') {
          const response = await ClienteService.getSubdiarioIvaVentas(subdiarioParams);
          const datosAgrupados = agruparPorMes(response.data);
          setChartData(datosAgrupados.map(d => ({ fecha: d.fecha, total_iva_ventas: d.total_iva })));
        } 
        else if (vistaIva === 'compras') {
          const response = await ClienteService.getSubdiarioIvaCompras(subdiarioParams);
          const datosAgrupados = agruparPorMes(response.data);
          setChartData(datosAgrupados.map(d => ({ fecha: d.fecha, total_iva_compras: d.total_iva })));
        }
        else {
          const [ventasResponse, comprasResponse] = await Promise.all([
            ClienteService.getSubdiarioIvaVentas(subdiarioParams),
            ClienteService.getSubdiarioIvaCompras(subdiarioParams)
          ]);

          const ventasData = agruparPorMes(ventasResponse.data);
          const comprasData = agruparPorMes(comprasResponse.data);
          const datosCombinados = combinarDatosIva(ventasData, comprasData);
          setChartData(datosCombinados);
        }
      }

      setSuccess(true);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al ejecutar la consulta. Por favor, intente nuevamente.');
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
    <Box sx={{ flexGrow: 1 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Title>Libro IVA</Title>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <RadioGroup
                row
                value={vistaIva}
                onChange={(e) => setVistaIva(e.target.value as 'ventas' | 'compras' | 'ambos')}
              >
                <FormControlLabel value="ventas" control={<Radio />} label="Ventas" />
                <FormControlLabel value="compras" control={<Radio />} label="Compras" />
                <FormControlLabel value="ambos" control={<Radio />} label="Ventas/Compras" />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="empresa-label">Empresa</InputLabel>
              <Select
                labelId="empresa-label"
                value={selectedEmpresa}
                label="Empresa"
                onChange={(e) => setSelectedEmpresa(e.target.value)}
              >
                {empresas.map((empresa) => (
                  <MenuItem key={empresa.cuit} value={empresa.nombre}>
                    {empresa.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha desde"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha hasta"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                format="DD/MM/YYYY"
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Tooltip title="Ejecutar">
              <IconButton
                color="primary"
                onClick={handleExecute}
                disabled={loading}
                sx={{ height: 'fit-content' }}
              >
                {loading ? <CircularProgress size={24} /> : <PlayArrowIcon />}
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
