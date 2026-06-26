import { useCallback, useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Pagination from "../../components/cars/Pagination";
import OrdersFilters, {
  type PaymentFilter,
  type StatusFilter,
} from "../../components/orders/OrdersFilters";
import OrdersTable from "../../components/orders/OrdersTable";
import OrdersTableSkeleton from "../../components/orders/OrdersTableSkeleton";
import OrderDetailsModal from "../../components/orders/OrderDetailsModal";
import OrderEditModal from "../../components/orders/OrderEditModal";
import DeleteOrderDialog from "../../components/orders/DeleteOrderDialog";
import { useToast } from "../../context/ToastContext";
import { useDebounce } from "../../hooks/useDebounce";
import { deleteOrder, fetchOrders } from "../../services/orders";
import type { OrderListItem, OrderPaymentStatus, OrderStatus } from "../../types/orders";
import { getApiErrorMessage } from "../../utils/orders";

const PAGE_SIZE = 12;

export default function Orders() {
  const { showToast } = useToast();

  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("all");

  const [detailsOrderId, setDetailsOrderId] = useState<number | null>(null);
  const [editOrderId, setEditOrderId] = useState<number | null>(null);
  const [deleteOrderId, setDeleteOrderId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const loadOrders = useCallback(async () => {
    setLoading(true);

    try {
      const params: {
        lim: number;
        page: number;
        search?: string;
        status?: OrderStatus;
        payment_status?: OrderPaymentStatus;
      } = {
        lim: PAGE_SIZE,
        page,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      if (paymentFilter !== "all") {
        params.payment_status = paymentFilter;
      }

      const response = await fetchOrders(params);
      setOrders(response.orders);
      setTotalPages(response.totalPages);
    } catch (error) {
      setOrders([]);
      showToast("error", getApiErrorMessage(error, "Failed to load orders."));
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, paymentFilter, showToast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, paymentFilter]);

  const handleDeleteConfirm = async () => {
    if (!deleteOrderId) return;

    setDeleting(true);
    try {
      await deleteOrder(deleteOrderId);
      showToast(
        "success",
        "Order archived and will be permanently deleted after 24 hours",
      );
      setDeleteOrderId(null);
      loadOrders();
    } catch (error) {
      showToast("error", getApiErrorMessage(error, "Failed to delete order."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Orders | Car Rental Admin"
        description="Manage orders"
      />

      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
            Orders Management
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            View and manage rental orders
          </p>
        </div>

        <div className="shadow-theme-lg rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <OrdersFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            paymentFilter={paymentFilter}
            onPaymentFilterChange={setPaymentFilter}
          />
        </div>

        {loading ? (
          <OrdersTableSkeleton />
        ) : (
          <OrdersTable
            orders={orders}
            onDetails={setDetailsOrderId}
            onEdit={setEditOrderId}
            onDelete={setDeleteOrderId}
          />
        )}

        {!loading && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>

      <OrderDetailsModal
        isOpen={detailsOrderId !== null}
        onClose={() => setDetailsOrderId(null)}
        orderId={detailsOrderId}
      />

      <OrderEditModal
        isOpen={editOrderId !== null}
        onClose={() => setEditOrderId(null)}
        onSuccess={loadOrders}
        orderId={editOrderId}
      />

      <DeleteOrderDialog
        isOpen={deleteOrderId !== null}
        onClose={() => setDeleteOrderId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </>
  );
}
