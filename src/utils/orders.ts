import type {
  OrderDetail,
  OrderEditFormValues,
  OrderUpdatePayload,
} from "../types/orders";
import { getApiErrorMessage } from "./cars";

export { getApiErrorMessage };

const API_URL = import.meta.env.VITE_API_URL;

export function getOrderImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  return `${API_URL}${path}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function toDateInputValue(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function orderToFormValues(order: OrderDetail): OrderEditFormValues {
  return {
    start_date: toDateInputValue(order.start_date),
    end_date: toDateInputValue(order.end_date),
    receiving_place: order.receiving_place ?? "",
    status: order.status,
    payment_status: order.payment_status,
    total_price: String(order.total_price),
    amount_paid: String(order.amount_paid ?? 0),
  };
}

export function buildOrderUpdatePayload(
  current: OrderEditFormValues,
  original: OrderEditFormValues,
): OrderUpdatePayload {
  const payload: OrderUpdatePayload = {};

  if (current.start_date !== original.start_date && current.start_date) {
    payload.start_date = current.start_date;
  }
  if (current.end_date !== original.end_date && current.end_date) {
    payload.end_date = current.end_date;
  }
  if (current.receiving_place !== original.receiving_place) {
    payload.receiving_place = current.receiving_place;
  }
  if (current.status !== original.status && current.status) {
    payload.status = current.status;
  }
  if (
    current.payment_status !== original.payment_status &&
    current.payment_status
  ) {
    payload.payment_status = current.payment_status;
  }
  if (current.total_price !== original.total_price && current.total_price) {
    payload.total_price = Number(current.total_price);
  }
  if (current.amount_paid !== original.amount_paid && current.amount_paid !== "") {
    payload.amount_paid = Number(current.amount_paid);
  }

  return payload;
}

export function getOrderClient(order: OrderDetail): {
  full_name: string;
  phone: string;
  id_number: string;
} {
  return {
    full_name: order.client?.full_name ?? order.full_name ?? "—",
    phone: order.client?.phone ?? order.phone ?? "—",
    id_number: order.client?.id_number ?? order.id_number ?? "—",
  };
}

export function getOrderCar(order: OrderDetail): {
  brand: string;
  model: string;
  plate: string;
  year: number | string;
  fuel: string;
  gearbox: string;
} {
  return {
    brand: order.car?.brand ?? order.brand ?? "—",
    model: order.car?.model ?? order.model ?? "—",
    plate: order.car?.plate ?? order.plate ?? "—",
    year: order.car?.year ?? order.year ?? "—",
    fuel: order.car?.fuel ?? order.fuel ?? "—",
    gearbox: order.car?.gearbox ?? order.gearbox ?? "—",
  };
}

export function capitalizeStatus(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
