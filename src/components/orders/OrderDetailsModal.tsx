import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { useToast } from "../../context/ToastContext";
import { fetchOrderById } from "../../services/orders";
import type { OrderDetail, OrderPaymentStatus, OrderStatus } from "../../types/orders";
import {
  capitalizeStatus,
  formatDate,
  getApiErrorMessage,
  getOrderCar,
  getOrderClient,
  getOrderImageUrl,
} from "../../utils/orders";
import { formatPrice } from "../../utils/cars";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number | null;
}

interface DetailItemProps {
  label: string;
  value: string | number | null | undefined;
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-1 text-sm text-gray-800 dark:text-white/90">
        {value ?? "—"}
      </p>
    </div>
  );
}

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

export default function OrderDetailsModal({
  isOpen,
  onClose,
  orderId,
}: OrderDetailsModalProps) {
  const { showToast } = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !orderId) {
      setOrder(null);
      return;
    }

    const loadOrder = async () => {
      setLoading(true);
      try {
        const { order: orderData } = await fetchOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        showToast(
          "error",
          getApiErrorMessage(error, "Failed to load order details."),
        );
        onClose();
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [isOpen, orderId, onClose, showToast]);

  const client = order ? getOrderClient(order) : null;
  const car = order ? getOrderCar(order) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-3xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
    >
      <div className="pr-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Order details
            </h3>
            {order && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Order #{order.id}
              </p>
            )}
          </div>
          {order && (
            <div className="flex flex-wrap gap-2">
              <Badge size="sm" color={getStatusBadgeColor(order.status)}>
                {capitalizeStatus(order.status)}
              </Badge>
              <Badge
                size="sm"
                color={getPaymentBadgeColor(order.payment_status)}
              >
                {capitalizeStatus(order.payment_status)}
              </Badge>
            </div>
          )}
        </div>

        {loading ? (
          <div className="mt-8 flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : order ? (
          <div className="mt-6 space-y-8">
            {order.car_image && (
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Car image
                </p>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800 max-w-xs">
                  <img
                    src={getOrderImageUrl(order.car_image)}
                    alt={`${car?.brand} ${car?.model}`}
                    className="h-48 w-full object-cover"
                  />
                </div>
              </div>
            )}

            <div>
              <h4 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                Order information
              </h4>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                <DetailItem label="ID" value={`#${order.id}`} />
                <DetailItem
                  label="Start date"
                  value={formatDate(order.start_date)}
                />
                <DetailItem
                  label="End date"
                  value={formatDate(order.end_date)}
                />
                <DetailItem
                  label="Receiving place"
                  value={order.receiving_place}
                />
                <DetailItem
                  label="Total price"
                  value={formatPrice(order.total_price)}
                />
                <DetailItem
                  label="Amount paid"
                  value={formatPrice(order.amount_paid ?? 0)}
                />
              </div>
            </div>

            {client && (
              <div>
                <h4 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                  Client information
                </h4>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                  <DetailItem label="Full name" value={client.full_name} />
                  <DetailItem label="Phone" value={client.phone} />
                  <DetailItem label="ID number" value={client.id_number} />
                </div>
              </div>
            )}

            {car && (
              <div>
                <h4 className="mb-4 text-sm font-semibold text-gray-800 dark:text-white/90">
                  Car information
                </h4>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                  <DetailItem label="Brand" value={car.brand} />
                  <DetailItem label="Model" value={car.model} />
                  <DetailItem label="Plate" value={car.plate} />
                  <DetailItem label="Year" value={car.year} />
                  <DetailItem label="Fuel" value={car.fuel} />
                  <DetailItem label="Gearbox" value={car.gearbox} />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
