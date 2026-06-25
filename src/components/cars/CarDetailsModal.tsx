import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { useToast } from "../../context/ToastContext";
import { fetchCarById } from "../../services/cars";
import type { Car } from "../../types/cars";
import {
  formatPrice,
  getApiErrorMessage,
  getCarImageUrl,
} from "../../utils/cars";

interface CarDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId: number | null;
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

export default function CarDetailsModal({
  isOpen,
  onClose,
  carId,
}: CarDetailsModalProps) {
  const { showToast } = useToast();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !carId) {
      setCar(null);
      return;
    }

    const loadCar = async () => {
      setLoading(true);
      try {
        const { car: carData } = await fetchCarById(carId);
        setCar(carData);
      } catch (error) {
        showToast("error", getApiErrorMessage(error, "Failed to load car details."));
        onClose();
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [isOpen, carId, onClose, showToast]);

  const images =
    car?.images && car.images.length > 0
      ? car.images
      : car?.image
        ? [car.image]
        : [];

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
              Car details
            </h3>
            {car && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {car.brand} {car.model}
              </p>
            )}
          </div>
          {car && (
            <Badge size="sm" color={car.available ? "success" : "error"}>
              {car.available ? "Available" : "Rented"}
            </Badge>
          )}
        </div>

        {loading ? (
          <div className="mt-8 flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : car ? (
          <div className="mt-6 space-y-6">
            {images.length > 0 && (
              <div>
                <p className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Images
                </p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {images.map((image, index) => (
                    <div
                      key={`${image}-${index}`}
                      className="aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                    >
                      <img
                        src={getCarImageUrl(image)}
                        alt={`${car.brand} ${car.model} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              <DetailItem label="Plate" value={car.plate} />
              <DetailItem label="Brand" value={car.brand} />
              <DetailItem label="Model" value={car.model} />
              <DetailItem label="Year" value={car.year} />
              <DetailItem label="Price" value={formatPrice(car.price)} />
              <DetailItem label="Fuel" value={car.fuel} />
              <DetailItem label="Gearbox" value={car.gearbox} />
              <DetailItem label="Engine" value={car.engine} />
              <DetailItem label="Horsepower" value={car.horsepower} />
              <DetailItem label="Torque" value={car.torque} />
              <DetailItem label="Car type" value={car.car_type} />
            </div>

            {car.notes && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Notes
                </p>
                <p className="mt-1 text-sm text-gray-800 dark:text-white/90 whitespace-pre-wrap">
                  {car.notes}
                </p>
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
