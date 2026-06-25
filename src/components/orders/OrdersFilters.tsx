import Label from "../form/Label";
import Input from "../form/input/InputField";
import type { OrderPaymentStatus, OrderStatus } from "../../types/orders";
import {
  ORDER_PAYMENT_STATUS_OPTIONS,
  ORDER_STATUS_OPTIONS,
} from "../../types/orders";
import { capitalizeStatus } from "../../utils/orders";

export type StatusFilter = "all" | OrderStatus;
export type PaymentFilter = "all" | OrderPaymentStatus;

interface OrdersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  paymentFilter: PaymentFilter;
  onPaymentFilterChange: (value: PaymentFilter) => void;
}

const selectClassName =
  "h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";

export default function OrdersFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  paymentFilter,
  onPaymentFilterChange,
}: OrdersFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div>
        <Label htmlFor="order-search">Search</Label>
        <Input
          id="order-search"
          type="text"
          placeholder="Search by client, brand, or model..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="status-filter">Status</Label>
        <select
          id="status-filter"
          className={selectClassName}
          value={statusFilter}
          onChange={(e) =>
            onStatusFilterChange(e.target.value as StatusFilter)
          }
        >
          <option value="all">All</option>
          {ORDER_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {capitalizeStatus(status)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="payment-filter">Payment status</Label>
        <select
          id="payment-filter"
          className={selectClassName}
          value={paymentFilter}
          onChange={(e) =>
            onPaymentFilterChange(e.target.value as PaymentFilter)
          }
        >
          <option value="all">All</option>
          {ORDER_PAYMENT_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {capitalizeStatus(status)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
