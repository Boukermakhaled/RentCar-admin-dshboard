import {
  BoxIconLine,
  CalenderIcon,
  DollarLineIcon,
  GroupIcon,
} from "../../icons";
import type { DashboardStats } from "../../types/stats";
import { formatRevenue } from "../../utils/stats";

interface StatCardsProps {
  stats: DashboardStats;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="shadow-theme-md rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-blue-300/50 shadow-theme-md shadow-blue-500/20 rounded-xl dark:bg-gray-800">
        {icon}
      </div>
      <div className="mt-5">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
          {value}
        </h4>
      </div>
    </div>
  );
}

export default function StatCards({ stats }: StatCardsProps) {
  const cards: StatCardProps[] = [
    {
      label: "Total Cars",
      value: String(stats.total_cars),
      icon: (
        <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
      ),
    },
    {
      label: "Rented Cars",
      value: String(stats.rented_cars),
      icon: <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />,
    },
    {
      label: "Pending Orders",
      value: String(stats.pending_orders),
      icon: (
        <CalenderIcon className="text-gray-800 size-6 dark:text-white/90" />
      ),
    },
    {
      label: "Monthly Revenue",
      value: formatRevenue(stats.monthly_revenue),
      icon: (
        <DollarLineIcon className="text-gray-800 size-6 dark:text-white/90" />
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
