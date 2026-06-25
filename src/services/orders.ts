import { api } from "./api";
import type {
  OrderResponse,
  OrdersListResponse,
  OrdersQueryParams,
  OrderUpdatePayload,
} from "../types/orders";

export async function fetchOrders(
  params: OrdersQueryParams,
): Promise<OrdersListResponse> {
  const { payment_status, ...rest } = params;
  const { data } = await api.get<OrdersListResponse>("/api/admin/orders", {
    params: {
      ...rest,
      ...(payment_status ? { payment: payment_status } : {}),
    },
  });
  return data;
}

export async function fetchOrderById(id: number): Promise<OrderResponse> {
  const { data } = await api.get<OrderResponse>(`/api/admin/orders/${id}`);
  return data;
}

export async function updateOrder(
  id: number,
  payload: OrderUpdatePayload,
): Promise<{ message: string }> {
  const { data } = await api.put<{ message: string }>(
    `/api/admin/orders/${id}`,
    payload,
  );
  return data;
}

export async function deleteOrder(id: number): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(
    `/api/admin/orders/${id}`,
  );
  return data;
}
