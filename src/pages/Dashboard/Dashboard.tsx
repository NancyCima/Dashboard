import { Grid, Paper, Typography } from '@mui/material';
import Title from '@/components/Title/Title';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useLayoutEffect, useRef } from 'react';

export const Dashboard = () => {
  const barChartRef = useRef<am5.Root | null>(null);
  const pieChartRef = useRef<am5.Root | null>(null);

  useLayoutEffect(() => {
    // Bar Chart
    const barRoot = am5.Root.new('barChart');
    barChartRef.current = barRoot;

    barRoot.setThemes([am5themes_Animated.new(barRoot)]);

    const chart = barRoot.container.children.push(
      am5xy.XYChart.new(barRoot, {
        panY: false,
        layout: barRoot.verticalLayout,
      })
    );

    // Data
    const data = [
      { category: 'Ene', value: 450 },
      { category: 'Feb', value: 550 },
      { category: 'Mar', value: 620 },
      { category: 'Abr', value: 480 },
      { category: 'May', value: 750 },
    ];

    // Create Y-axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(barRoot, {
        renderer: am5xy.AxisRendererY.new(barRoot, {}),
      })
    );

    // Create X-axis
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(barRoot, {
        renderer: am5xy.AxisRendererX.new(barRoot, {}),
        categoryField: 'category',
      })
    );
    xAxis.data.setAll(data);

    // Create series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(barRoot, {
        name: 'Ventas',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'value',
        categoryXField: 'category',
      })
    );
    series.data.setAll(data);

    // Pie Chart
    const pieRoot = am5.Root.new('pieChart');
    pieChartRef.current = pieRoot;

    pieRoot.setThemes([am5themes_Animated.new(pieRoot)]);

    const pieChart = pieRoot.container.children.push(
      am5percent.PieChart.new(pieRoot, {
        layout: pieRoot.verticalLayout,
      })
    );

    const pieSeries = pieChart.series.push(
      am5percent.PieSeries.new(pieRoot, {
        valueField: 'value',
        categoryField: 'category',
      })
    );

    const pieData = [
      { category: 'Producto A', value: 30 },
      { category: 'Producto B', value: 25 },
      { category: 'Producto C', value: 20 },
      { category: 'Producto D', value: 15 },
      { category: 'Producto E', value: 10 },
    ];

    pieSeries.data.setAll(pieData);

    return () => {
      barRoot.dispose();
      pieRoot.dispose();
    };
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper 
          sx={{ 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column',
            mb: 2
          }}
        >
          <Title>Dashboard</Title>
          <Typography component="p" variant="h4">
            Resumen General
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={8} lg={9}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 500,
          }}
        >
          <Title>Ventas Mensuales</Title>
          <div id="barChart" style={{ width: '100%', height: '100%' }}></div>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 500,
          }}
        >
          <Title>Distribución de Productos</Title>
          <div id="pieChart" style={{ width: '100%', height: '100%' }}></div>
        </Paper>
      </Grid>
    </Grid>
  );
};