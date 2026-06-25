import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { OrderOverTime } from "../../types/stats";
import { buildMonthlyOrdersData, getYearOptions, MONTH_LABELS } from "../../utils/stats";

interface OrdersOverTimeChartProps {
  year: number;
  ordersOverTime: OrderOverTime[];
  onYearChange: (year: number) => void;
}

export default function OrdersOverTimeChart({
  year,
  ordersOverTime,
  onYearChange,
}: OrdersOverTimeChartProps) {
  const monthlyData = buildMonthlyOrdersData(year, ordersOverTime);
  const yearOptions = getYearOptions();

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (value) => `${value} orders`,
      },
    },
    xaxis: {
      type: "category",
      categories: [...MONTH_LABELS],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
      title: {
        text: "",
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  const series = [
    {
      name: "Orders",
      data: monthlyData,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex flex-col gap-4 px-6 py-5 border-b border-gray-100 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
            Orders Over Time
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monthly order count for {year}
          </p>
        </div>
        <select
          value={String(year)}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="h-11 w-full sm:w-32 appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        >
          {yearOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="p-4 sm:p-6">
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[700px]">
            <Chart options={options} series={series} type="area" height={310} />
          </div>
        </div>
      </div>
    </div>
  );
}
