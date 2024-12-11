import { Grid, Paper, Typography } from '@mui/material';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useLayoutEffect, useRef } from 'react';

export const TotalIvaBook = () => {
  const chartRef = useRef<am5.Root | null>(null);

  useLayoutEffect(() => {
    const root = am5.Root.new('purchasesTotalIvaBookChart');
    chartRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        layout: root.verticalLayout,
      })
    );

    // Datos de ejemplo
    const data = [
      { date: '2024-01', total: 145200 },
      { date: '2024-02', total: 169400 },
      { date: '2024-03', total: 217800 },
      { date: '2024-04', total: 157300 },
      { date: '2024-05', total: 193600 },
    ];

    // Create Y-axis
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Create X-axis
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        categoryField: 'date',
      })
    );
    xAxis.data.setAll(data);

    // Create series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: 'Total',
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'total',
        categoryXField: 'date',
        tooltip: am5.Tooltip.new(root, {
          labelText: 'Total: ${valueY}',
        }),
      })
    );
    series.columns.template.setAll({
      fill: am5.color(0x1976d2),
      strokeOpacity: 0,
    });
    series.data.setAll(data);

    // Add legend
    const legend = chart.children.push(am5.Legend.new(root, {}));
    legend.data.setAll(chart.series.values);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Total Libro IVA Compras
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <div id="purchasesTotalIvaBookChart" style={{ width: '100%', height: '500px' }}></div>
        </Paper>
      </Grid>
    </Grid>
  );
};
