import * as am5 from '@amcharts/amcharts5';

export interface ChartThemeConfig {
  background: am5.Rectangle | undefined;
  tooltipConfig: {
    fill: am5.Color;
    stroke: am5.Color;
  };
  seriesConfig: {
    fill: am5.Color;
  };
}

export const getChartTheme = (root: am5.Root, isDarkMode: boolean): ChartThemeConfig => {
  if (isDarkMode) {
    root.interfaceColors.set("grid", am5.color("#444444"));
    root.interfaceColors.set("text", am5.color("#ffffff"));

    return {
      background: am5.Rectangle.new(root, {
        fill: am5.color("#1e1e1e"),
        fillOpacity: 1
      }),
      tooltipConfig: {
        fill: am5.color("#2d2d2d"),
        stroke: am5.color("#666666"),
      },
      seriesConfig: {
        fill: am5.color("#5c8ee6"),
      }
    };
  }

  return {
    background: undefined,
    tooltipConfig: {
      fill: am5.color("#ffffff"),
      stroke: am5.color("#000000"),
    },
    seriesConfig: {
      fill: am5.color("#1976d2"),
    }
  };
};