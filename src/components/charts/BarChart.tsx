import { useLayoutEffect, useRef } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import * as am5exporting from "@amcharts/amcharts5/plugins/exporting";
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

export interface SeriesConfig {
  name: string;
  valueYField: string;
  color?: string;
}

export interface BarChartProps {
  data: Array<Record<string, any>>;
  series: SeriesConfig[];
  categoryXField: string;
  isDarkMode: boolean;
  title?: string;
  enableExport?: boolean;
  height?: string;
}

const getChartTheme = (isDarkMode: boolean) => {
  if (isDarkMode) {
    return {
      colors: {
        background: "#2B2B2B",
        text: "#FFFFFF",
        grid: "#404040",
        tooltip: {
          background: "#404040",
          text: "#FFFFFF"
        },
        series: {
          default: "#67B7DC",
          secondary: "#6794DC"
        }
      },
      opacity: {
        grid: 0.5,
        tooltip: 0.9
      },
      stroke: {
        grid: "#404040",
        axis: "#404040"
      }
    };
  }
  return {
    colors: {
      background: "#FFFFFF",
      text: "#000000",
      grid: "#000000",
      tooltip: {
        background: "#F3F3F3",
        text: "#000000"
      },
      series: {
        default: "#67B7DC",
        secondary: "#6794DC"
      }
    },
    opacity: {
      grid: 0.15,
      tooltip: 0.9
    },
    stroke: {
      grid: "#000000",
      axis: "#000000"
    }
  };
};

export const BarChart = ({ 
  data, 
  series, 
  categoryXField,
  isDarkMode,
  title,
  enableExport = false,
  height = '100%'
}: BarChartProps) => {
  const theme = getChartTheme(isDarkMode);
  const chartRef = useRef<am5.Root | null>(null);
  const exportingRef = useRef<am5exporting.Exporting | null>(null);

  useLayoutEffect(() => {
    const root = am5.Root.new('barChart');
    chartRef.current = root;

    root.setThemes([am5themes_Animated.new(root)]);
    
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panY: false,
        layout: root.verticalLayout,
        background: am5.Rectangle.new(root, {
          fill: am5.color(theme.colors.background),
          fillOpacity: 1
        })
      })
    );

    // Add export menu if enabled
    if (enableExport) {
      exportingRef.current = am5exporting.Exporting.new(root, {
        menu: am5exporting.ExportingMenu.new(root, {}),
        filePrefix: "chart-export"
      });
    }

    // Add title if provided
    if (title) {
      chart.children.unshift(
        am5.Label.new(root, {
          text: title,
          fontSize: 20,
          fontWeight: "500",
          textAlign: "center",
          x: am5.percent(50),
          centerX: am5.percent(50),
          paddingTop: 0,
          paddingBottom: 20
        })
      );
    }   
   
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 30
        }),
      })
    );

    yAxis.get("renderer").labels.template.setAll({
      fill: am5.color(theme.colors.text)
    });

    yAxis.get("renderer").grid.template.setAll({
      stroke: am5.color(theme.stroke.grid),
      strokeOpacity: theme.opacity.grid
    });

    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 30,
          cellStartLocation: 0.1,
          cellEndLocation: 0.9
        }),
        categoryField: categoryXField,
      })
    );

    xAxis.get("renderer").labels.template.setAll({
      fill: am5.color(theme.colors.text)
    });

    xAxis.get("renderer").grid.template.setAll({
      stroke: am5.color(theme.stroke.grid),
      strokeOpacity: theme.opacity.grid
    });

    const seriesList: am5xy.ColumnSeries[] = [];

    // Create series for each config
    series.forEach((seriesConfig) => {
      const columnSeries = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: seriesConfig.name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: seriesConfig.valueYField,
          categoryXField: categoryXField,
        })
      );

      columnSeries.columns.template.setAll({
        cornerRadiusTL: 3,
        cornerRadiusTR: 3,
        strokeOpacity: 0,
        fill: am5.color(seriesConfig.color || theme.colors.series.default),
        tooltipText: "{name}\n${valueY}",
        tooltipY: 0,
        interactive: true
      });

      columnSeries.set("tooltip", am5.Tooltip.new(root, {
        keepTargetHover: true,
        getFillFromSprite: false,
        labelText: "{name}\n${valueY}",
        background: am5.Rectangle.new(root, {
          fill: am5.color(theme.colors.tooltip.background),
          fillOpacity: theme.opacity.tooltip,
          stroke: am5.color(theme.stroke.axis),
          strokeOpacity: 0.1
        })
      }));

      columnSeries.data.setAll(data);
      seriesList.push(columnSeries);
    });

    // Add legend
    if (series.length > 1) {
      const legend = chart.children.push(am5.Legend.new(root, {}));
      legend.labels.template.setAll({
        fill: am5.color(theme.colors.text)
      });
      legend.data.setAll(chart.series.values);
    }

    xAxis.data.setAll(data);

    // Make stuff animate on load
    chart.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, [data, series, categoryXField, isDarkMode, title, enableExport, theme]);

  return <div id="barChart" style={{ width: '100%', height }} />;
};