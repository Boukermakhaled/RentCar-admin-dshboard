import { api } from "./api";
import type {
  CarResponse,
  CarsListResponse,
  CarsQueryParams,
} from "../types/cars";

export async function fetchCars(
  params: CarsQueryParams,
): Promise<CarsListResponse> {
  const { data } = await api.get<CarsListResponse>("/api/admin/cars", {
    params,
  });
  return data;
}

export async function fetchCarById(id: number): Promise<CarResponse> {
  const { data } = await api.get<CarResponse>(`/api/admin/cars/${id}`);
  return data;
}

export async function createCar(formData: FormData): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    "/api/admin/cars",
    formData,
  );
  return data;
}

export async function updateCar(
  id: number,
  formData: FormData,
): Promise<{ message: string }> {
  const { data } = await api.put<{ message: string }>(
    `/api/admin/cars/${id}`,
    formData,
  );
  return data;
}

export async function deleteCar(id: number): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(
    `/api/admin/cars/${id}`,
  );
  return data;
}
