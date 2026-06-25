export interface CarListItem {
  id: number;
  plate: string;
  brand: string;
  model: string;
  price: number;
  available: boolean;
  image: string;
}

export interface Car extends CarListItem {
  year: number;
  fuel: string;
  gearbox: string;
  engine: string | null;
  horsepower: number;
  torque: number;
  car_type: string;
  notes: string | null;
  images: string[];
}

export interface CarsListResponse {
  totalRows: number;
  totalPages: number;
  currentPage: number;
  cars: CarListItem[];
}

export interface CarResponse {
  car: Car;
}

export interface CarsQueryParams {
  lim?: number;
  page?: number;
  search?: string;
  brand?: string;
  available?: boolean;
}

export interface CarFormValues {
  brand: string;
  model: string;
  year: string;
  price: string;
  fuel: string;
  gearbox: string;
  engine: string;
  horsepower: string;
  torque: string;
  car_type: string;
  plate: string;
  available: boolean;
  notes: string;
}

export const FUEL_OPTIONS = [
  "Essence",
  "Diesel",
  "Hybride",
  "Électrique",
] as const;

export const GEARBOX_OPTIONS = ["Automatique", "Manuelle"] as const;

export const CAR_TYPE_OPTIONS = [
  "Berline",
  "SUV",
  "Coupé",
  "Cabriolet",
  "Utilitaire",
] as const;

export const EMPTY_CAR_FORM: CarFormValues = {
  brand: "",
  model: "",
  year: "",
  price: "",
  fuel: "",
  gearbox: "",
  engine: "",
  horsepower: "",
  torque: "",
  car_type: "",
  plate: "",
  available: true,
  notes: "",
};
