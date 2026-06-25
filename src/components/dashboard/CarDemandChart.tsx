import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { CarDemand } from "../../types/stats";

interface CarDemandChartProps {
  carDemand: CarDemand[];
}

const CHART_COLORS = [
  "#3641F5",
  "#7592FF",
  "#465FFF",
  "#9CB9FF",
  "#DDE9FF",
  "#6366F1",
  "#818CF8",
  "#A5B4FC",
];

export default function CarDemandChart({ carDemand }: CarDemandChartProps) {
  const labels = carDemand.map(
    (item) => `${item.car_name} ${Number(item.percentage)}%`
  );
  const series = carDemand.map((item) => Number(item.percentage));

  const options: ApexOptions = {
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "donut",
    },
    colors: CHART_COLORS,
    labels,
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      fontSize: "13px",
      markers: {
        size: 6,
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
            },
            value: {
              show: true,
              fontSize: "22px",
              fontWeight: "600",
              formatter: (val) => `${val}%`,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              formatter: () => "100%",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`,
      },
    },
    stroke: {
      show: false,
    },
  };

  return (
    <div
      id="chartTwo"
      className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          Car Demand
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Rental demand share by car
        </p>
      </div>
      <div className="p-4 sm:p-6">
        {carDemand.length === 0 ? (
          <div className="flex items-center justify-center h-[310px] text-sm text-gray-500 dark:text-gray-400">
            No car demand data available
          </div>
        ) : (
          <Chart options={options} series={series} type="donut" height={360} />
        )}
      </div>
    </div>
  );
}
