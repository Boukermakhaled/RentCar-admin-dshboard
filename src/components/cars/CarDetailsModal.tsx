import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Badge from "../ui/badge/Badge";
import Button from "../ui/button/Button";
import { useToast } from "../../context/ToastContext";
import { fetchCarById } from "../../services/cars";
import type { Car } from "../../types/cars";
import { formatPrice, getApiErrorMessage, getCarImageUrl } from "../../utils/cars";
import { IoMdSpeedometer } from "react-icons/io";
import { GiGearStick } from "react-icons/gi";
import { PiEngineBold, PiGasPumpBold } from "react-icons/pi";
import { TbManualGearbox } from "react-icons/tb";
import { MdOutlineCalendarToday } from "react-icons/md";
import { RiCarLine } from "react-icons/ri";

interface CarDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  carId: number | null;
}

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatPill({ icon, label, value }: StatPillProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-800 px-3 py-2">
      <span className="text-brand-500 text-base">{icon}</span>
      <div>
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{value}</p>
      </div>
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
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!isOpen || !carId) {
      setCar(null);
      setActiveImage(0);
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
      className="max-w-2xl p-0 max-h-[90vh] overflow-hidden"
    >
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      ) : car ? (
        <div className="flex flex-col overflow-y-auto max-h-[90vh]">

          {/* ── Image gallery ── */}
          <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-900 overflow-hidden">
            {images.length > 0 ? (
              <>
                <img
                  src={getCarImageUrl(images[activeImage])}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {/* car_type badge */}
                {car.car_type && (
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase text-gray-600 bg-white/90 dark:bg-gray-900/80 px-2 py-1 rounded-md">
                    {car.car_type}
                  </span>
                )}
                {/* Available badge */}
                <span className={`absolute top-10 left-3 text-[10px] font-bold uppercase px-2 py-1 rounded-md ${car.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {car.available ? "Available" : "Rented"}
                </span>
                {/* Thumbnail strip */}
                {images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-12 h-8 rounded-md overflow-hidden border-2 transition-all ${
                          i === activeImage
                            ? "border-brand-500 scale-110"
                            : "border-white/50 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={getCarImageUrl(img)}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <RiCarLine className="text-5xl" />
              </div>
            )}
          </div>

          {/* ── Content ── */}
          <div className="p-6 space-y-5">

            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                  {car.brand} {car.model}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5"> {car.plate}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] text-gray-400 uppercase font-semibold">Price / day</p>
                <p className="text-xl font-bold text-brand-500">{formatPrice(car.price)}</p>
              </div>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <StatPill icon={<MdOutlineCalendarToday />} label="Year" value={car.year} />
              <StatPill icon={<PiGasPumpBold />} label="Fuel" value={car.fuel} />
              <StatPill icon={<GiGearStick />} label="Gearbox" value={car.gearbox} />
              <StatPill icon={<IoMdSpeedometer />} label="Horsepower" value={`${car.horsepower} hp`} />
              <StatPill icon={<TbManualGearbox />} label="Torque" value={`${car.torque} Nm`} />
              <StatPill icon={<PiEngineBold />} label="Engine" value={car.engine ?? "—"} />
            </div>

            {/* Notes */}
            {car.notes && (
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{car.notes}</p>
              </div>
            )}

            {/* Close */}
            <div className="flex justify-end pt-1">
              <Button size="sm" variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}