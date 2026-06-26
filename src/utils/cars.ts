import type { Car, CarFormValues } from "../types/cars";

const API_URL = import.meta.env.VITE_API_URL;

export function getCarImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }
  const base = (API_URL ?? "").replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function getCarImageList(car: {
  image?: string | null;
  images?: string[] | null;
}): string[] {
  if (car.images?.length) {
    return car.images.filter(Boolean);
  }
  if (car.image) {
    return [car.image];
  }
  return [];
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

export async function fetchImagesAsFiles(paths: string[]): Promise<File[]> {
  const files: File[] = [];

  for (const path of paths) {
    const url = getCarImageUrl(path);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load image: ${path}`);
    }
    const blob = await response.blob();
    const filename = path.split("/").pop() || "image.webp";
    files.push(new File([blob], filename, { type: blob.type || "image/webp" }));
  }

  return files;
}

export function carImagesChanged(
  initial: string[],
  current: string[],
  newCount: number,
): boolean {
  if (newCount > 0) return true;
  if (initial.length !== current.length) return true;
  return initial.some((path, i) => path !== current[i]);
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
