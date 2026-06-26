import Badge from "../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import type {
  OrderListItem,
  OrderPaymentStatus,
  OrderStatus,
} from "../../types/orders";
import { MdInfoOutline, MdModeEdit, MdDeleteOutline } from "react-icons/md";
import { formatDate, capitalizeStatus } from "../../utils/orders";

interface OrdersTableProps {
  orders: OrderListItem[];
  onDetails: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const actionButtonClass =
  "text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300";

function getStatusBadgeColor(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "warning";
    case "confirmed":
      return "info";
    case "completed":
      return "success";
    default:
      return "light";
  }
}

function getPaymentBadgeColor(paymentStatus: OrderPaymentStatus) {
  switch (paymentStatus) {
    case "unpaid":
      return "error";
    case "partial":
      return "warning";
    case "paid":
      return "success";
    default:
      return "light";
  }
}

export default function OrdersTable({
  orders,
  onDetails,
  onEdit,
  onDelete,
}: OrdersTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {[
                "ID",
                "Client Name",
                "Car",
                "Start Date",
                "End Date",
                "Status",
                "Payment",
                "Actions",
              ].map((header) => (
                <TableCell
                  key={header}
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {orders.length === 0 ? (
              <TableRow>
                <td
                  colSpan={8}
                  className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No orders found.
                </td>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm text-gray-800 dark:text-white/90">
                    #{order.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {order.client_name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {order.brand} {order.model}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatDate(order.start_date)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatDate(order.end_date)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={getStatusBadgeColor(order.status)}
                    >
                      {capitalizeStatus(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={getPaymentBadgeColor(order.payment_status)}
                    >
                      {capitalizeStatus(order.payment_status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className={actionButtonClass}
                        onClick={() => onDetails(order.id)}
                      >
                        <MdInfoOutline className="w-5 h-5 text-black hover:scale-110 transition-all duration-300" />
                      </button>
                      <button
                        type="button"
                        className={actionButtonClass}
                        onClick={() => onEdit(order.id)}
                      >
                        <MdModeEdit className="w-5 h-5 text-green-700 hover:scale-110 transition-all duration-300"/>
                      </button>
                      <button
                        type="button"
                        className="text-sm font-medium text-error-500 hover:text-error-600 dark:text-error-400 dark:hover:text-error-300"
                        onClick={() => onDelete(order.id)}
                      >
                        <MdDeleteOutline className="w-5 h-5 hover:scale-110 transition-all duration-300"/>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
