import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";

export const breadcrumb: BreadcrumbType[] = [
  {
    title: "apexcharts",
    disabled: false,
  },
  {
    title: "polar-area",
    disabled: true,
  },
];

export const getCharts = (getChartColorsArray: Function) => {
  // Basic Polar Area

  const basicPolarareaChart = {
    series: [14, 23, 21, 17, 15, 10, 12, 17, 21],
    chartOptions: {
      chart: {
        type: "polarArea",
        width: 400,
      },
      labels: [
        "Series A",
        "Series B",
        "Series C",
        "Series D",
        "Series E",
        "Series F",
        "Series G",
        "Series H",
        "Series I",
      ],
      stroke: {
        colors: ["#fff"],
      },
      fill: {
        opacity: 0.8,
      },

      legend: {
        position: "bottom",
      },
      colors: getChartColorsArray('["--tb-primary", "--tb-success", "--tb-warning","--tb-danger", "--tb-info", "--tb-success", "--tb-primary", "--tb-dark", "--tb-secondary"]'),
    },
  };

  // Polar-Area Monochrome Charts

  const polarAreaMonochromeChart = {
    series: [42, 47, 52, 58, 65],
    chartOptions: {
      chart: {
        width: 400,
        type: "polarArea",
      },
      labels: ["Rose A", "Rose B", "Rose C", "Rose D", "Rose E"],
      fill: {
        opacity: 1,
      },
      stroke: {
        width: 1,
        colors: undefined,
      },
      yaxis: {
        show: false,
      },
      legend: {
        position: "bottom",
      },
      plotOptions: {
        polarArea: {
          rings: {
            strokeWidth: 0,
          },
          spokes: {
            strokeWidth: 0,
          },
        },
      },
      theme: {
        mode: "light",
        palette: "palette1",
        monochrome: {
          enabled: true,
          shadeTo: "light",
          color: "#405189",
          shadeIntensity: 0.6,
        },
      },
    },
  };

  return {
    basicPolarareaChart,
    polarAreaMonochromeChart,
  };
};

export {};
