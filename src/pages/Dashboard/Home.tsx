import { useCallback, useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import StatCards from "../../components/dashboard/StatCards";
import StatCardsSkeleton from "../../components/dashboard/StatCardsSkeleton";
import OrdersOverTimeChart from "../../components/dashboard/OrdersOverTimeChart";
import CarDemandChart from "../../components/dashboard/CarDemandChart";
import ChartSkeleton from "../../components/dashboard/ChartSkeleton";
import Button from "../../components/ui/button/Button";
import { fetchDashboardStats } from "../../services/stats";
import type { StatsResponse } from "../../types/stats";

export default function Home() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async (selectedYear: number) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetchDashboardStats(selectedYear);
      setData(response);
    } catch {
      setData(null);
      setError("Failed to load dashboard statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats(year);
  }, [year, loadStats]);

  const handleRetry = () => {
    loadStats(year);
  };

  return (
    <>
      <PageMeta
        title="Dashboard | Car Rental Admin"
        description="Car rental agency admin dashboard"
      />

      {loading && (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12">
            <StatCardsSkeleton />
          </div>
          <div className="col-span-12 xl:col-span-7">
            <ChartSkeleton />
          </div>
          <div className="col-span-12 xl:col-span-5">
            <ChartSkeleton />
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-error-200 bg-error-50 p-10 dark:border-error-500/30 dark:bg-error-500/10">
          <p className="text-sm text-error-600 dark:text-error-400">{error}</p>
          <Button size="sm" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && data && (
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          <div className="col-span-12">
            <StatCards stats={data.stats} />
          </div>
          <div className="col-span-12 xl:col-span-7">
            <OrdersOverTimeChart
              year={year}
              ordersOverTime={data.orders_over_time}
              onYearChange={setYear}
            />
          </div>
          <div className="col-span-12 xl:col-span-5">
            <CarDemandChart carDemand={data.car_demand} />
          </div>
        </div>
      )}
    </>
  );
}
