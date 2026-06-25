import type { Car, CarFormValues } from "../types/cars";

const API_URL = import.meta.env.VITE_API_URL;

export function getCarImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  return `${API_URL}${path}`;
}

export function formatPrice(value: number | string): string {
  const amount = Number(value);
  if (Number.isNaN(amount)) return "0.00 DZD";

  return (
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " DZD"
  );
}

export function carToFormValues(car: Car): CarFormValues {
  return {
    brand: car.brand,
    model: car.model,
    year: String(car.year),
    price: String(car.price),
    fuel: car.fuel,
    gearbox: car.gearbox,
    engine: car.engine ?? "",
    horsepower: String(car.horsepower),
    torque: String(car.torque),
    car_type: car.car_type,
    plate: car.plate,
    available: car.available,
    notes: car.notes ?? "",
  };
}

export function buildCarFormData(
  values: CarFormValues,
  images?: File[],
): FormData {
  const formData = new FormData();

  formData.append("brand", values.brand);
  formData.append("model", values.model);
  formData.append("year", values.year);
  formData.append("price", values.price);
  formData.append("fuel", values.fuel);
  formData.append("gearbox", values.gearbox);
  formData.append("engine", values.engine);
  formData.append("horsepower", values.horsepower);
  formData.append("torque", values.torque);
  formData.append("car_type", values.car_type);
  formData.append("plate", values.plate);
  formData.append("available", String(values.available));
  formData.append("notes", values.notes);

  if (images && images.length > 0) {
    images.forEach((file) => formData.append("images", file));
  }

  return formData;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }

  return fallback;
}
