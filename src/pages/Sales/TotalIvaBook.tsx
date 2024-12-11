import { Grid, Paper, Typography } from '@mui/material';
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { useLayoutEffect, useRef } from 'react';

export const TotalIvaBook = () => {
  const chartRef = useRef<am5.Root | null>(null);

  useLayoutEffect(() => {
    const root = am5.Root.new('totalIvaBookChart');
    chartRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50),
      })
    );

    // Datos de ejemplo
    const data = [
      { category: 'Neto', value: 910000 },
      { category: 'IVA', value: 191100 },
    ];

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: 'value',
        categoryField: 'category',
        endAngle: 270,
      })
    );

    series.states.create('hidden', {
      endAngle: -90,
    });

    // Set data
    series.data.setAll(data);

    // Create legend
    const legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      marginTop: 15,
      marginBottom: 15,
    }));

    legend.data.setAll(series.dataItems);

    // Add label in center
    const total = data.reduce((acc, item) => acc + item.value, 0);
    chart.children.push(am5.Label.new(root, {
      text: `Total\n${total}`,
      centerX: am5.percent(50),
      centerY: am5.percent(50),
      textAlign: 'center',
    }));

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Total Libro IVA Ventas
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <div id="totalIvaBookChart" style={{ width: '100%', height: '500px' }}></div>
        </Paper>
      </Grid>
    </Grid>
  );
};
