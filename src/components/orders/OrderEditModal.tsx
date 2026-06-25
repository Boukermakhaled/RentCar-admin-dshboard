import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useToast } from "../../context/ToastContext";
import { fetchOrderById, updateOrder } from "../../services/orders";
import type { OrderEditFormValues } from "../../types/orders";
import {
  ORDER_PAYMENT_STATUS_OPTIONS,
  ORDER_STATUS_OPTIONS,
} from "../../types/orders";
import {
  buildOrderUpdatePayload,
  capitalizeStatus,
  getApiErrorMessage,
  orderToFormValues,
} from "../../utils/orders";

interface OrderEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  orderId: number | null;
}

const selectClassName =
  "h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";

export default function OrderEditModal({
  isOpen,
  onClose,
  onSuccess,
  orderId,
}: OrderEditModalProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState<OrderEditFormValues>({
    start_date: "",
    end_date: "",
    receiving_place: "",
    status: "",
    payment_status: "",
    total_price: "",
    amount_paid: "",
  });
  const [original, setOriginal] = useState<OrderEditFormValues>(form);
  const [loading, setLoading] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    if (!isOpen || !orderId) return;

    const loadOrder = async () => {
      setLoadingOrder(true);
      try {
        const { order } = await fetchOrderById(orderId);
        const values = orderToFormValues(order);
        setForm(values);
        setOriginal(values);
      } catch (error) {
        showToast("error", getApiErrorMessage(error, "Failed to load order."));
        onClose();
      } finally {
        setLoadingOrder(false);
      }
    };

    loadOrder();
  }, [isOpen, orderId, onClose, showToast]);

  const updateField = <K extends keyof OrderEditFormValues>(
    key: K,
    value: OrderEditFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;

    const payload = buildOrderUpdatePayload(form, original);

    if (Object.keys(payload).length === 0) {
      showToast("error", "No changes to save.");
      return;
    }

    setLoading(true);
    try {
      await updateOrder(orderId, payload);
      showToast("success", "Order updated successfully.");
      onSuccess();
      onClose();
    } catch (error) {
      showToast("error", getApiErrorMessage(error, "Failed to update order."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
    >
      <div className="pr-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Edit order
        </h3>

        {loadingOrder ? (
          <div className="mt-8 flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="start_date">Start date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={form.start_date}
                  onChange={(e) => updateField("start_date", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end_date">End date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={form.end_date}
                  onChange={(e) => updateField("end_date", e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="receiving_place">Receiving place</Label>
                <Input
                  id="receiving_place"
                  value={form.receiving_place}
                  onChange={(e) =>
                    updateField("receiving_place", e.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className={selectClassName}
                  value={form.status}
                  onChange={(e) =>
                    updateField(
                      "status",
                      e.target.value as OrderEditFormValues["status"],
                    )
                  }
                >
                  <option value="" disabled>
                    Select status
                  </option>
                  {ORDER_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {capitalizeStatus(status)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="payment_status">Payment status</Label>
                <select
                  id="payment_status"
                  className={selectClassName}
                  value={form.payment_status}
                  onChange={(e) =>
                    updateField(
                      "payment_status",
                      e.target.value as OrderEditFormValues["payment_status"],
                    )
                  }
                >
                  <option value="" disabled>
                    Select payment status
                  </option>
                  {ORDER_PAYMENT_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {capitalizeStatus(status)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="total_price">Total price</Label>
                <Input
                  id="total_price"
                  type="number"
                  step={0.01}
                  value={form.total_price}
                  onChange={(e) => updateField("total_price", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="amount_paid">Amount paid</Label>
                <Input
                  id="amount_paid"
                  type="number"
                  step={0.01}
                  value={form.amount_paid}
                  onChange={(e) => updateField("amount_paid", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
