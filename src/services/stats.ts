import { api } from "./api";
import type { StatsResponse } from "../types/stats";

export async function fetchDashboardStats(year: number): Promise<StatsResponse> {
  const { data } = await api.get<StatsResponse>("/api/admin/stats", {
    params: { year },
  });
  return data;
}
