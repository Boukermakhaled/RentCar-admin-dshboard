export type OrderStatus = "pending" | "confirmed" | "completed";
export type OrderPaymentStatus = "unpaid" | "partial" | "paid";

export interface OrderListItem {
  id: number;
  start_date: string;
  end_date: string;
  status: OrderStatus;
  payment_status: OrderPaymentStatus;
  total_price: number;
  receiving_place: string;
  client_name: string;
  brand: string;
  model: string;
}

export interface OrderClient {
  full_name: string;
  phone: string;
  id_number: string;
}

export interface OrderCar {
  brand: string;
  model: string;
  plate: string;
  year: number;
  fuel: string;
  gearbox: string;
}

export interface OrderDetail {
  id: number;
  start_date: string;
  end_date: string;
  receiving_place: string;
  status: OrderStatus;
  payment_status: OrderPaymentStatus;
  total_price: number;
  amount_paid: number;
  car_image: string;
  client?: OrderClient;
  car?: OrderCar;
  full_name?: string;
  phone?: string;
  id_number?: string;
  brand?: string;
  model?: string;
  plate?: string;
  year?: number;
  fuel?: string;
  gearbox?: string;
}

export interface OrdersListResponse {
  totalRows: number;
  totalPages: number;
  currentPage: number;
  orders: OrderListItem[];
}

export interface OrderResponse {
  order: OrderDetail;
}

export interface OrdersQueryParams {
  lim?: number;
  page?: number;
  status?: OrderStatus;
  payment_status?: OrderPaymentStatus;
  search?: string;
}

export interface OrderEditFormValues {
  start_date: string;
  end_date: string;
  receiving_place: string;
  status: OrderStatus | "";
  payment_status: OrderPaymentStatus | "";
  total_price: string;
  amount_paid: string;
}

export interface OrderUpdatePayload {
  start_date?: string;
  end_date?: string;
  receiving_place?: string;
  status?: OrderStatus;
  payment_status?: OrderPaymentStatus;
  total_price?: number;
  amount_paid?: number;
}

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "pending",
  "confirmed",
  "completed",
];

export const ORDER_PAYMENT_STATUS_OPTIONS: OrderPaymentStatus[] = [
  "unpaid",
  "partial",
  "paid",
];
