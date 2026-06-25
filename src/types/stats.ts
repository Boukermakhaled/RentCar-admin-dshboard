export interface DashboardStats {
  total_cars: number;
  rented_cars: number;
  pending_orders: number;
  monthly_revenue: number | string;
}

export interface OrderOverTime {
  month: string;
  total_orders: string | number;
}

export interface CarDemand {
  car_name: string;
  plate: string;
  total_orders: string | number;
  percentage: string | number;
}

export interface StatsResponse {
  stats: DashboardStats;
  orders_over_time: OrderOverTime[];
  car_demand: CarDemand[];
}
