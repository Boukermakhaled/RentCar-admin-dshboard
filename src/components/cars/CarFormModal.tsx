import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useToast } from "../../context/ToastContext";
import { createCar, fetchCarById, updateCar } from "../../services/cars";
import {
  buildCarFormData,
  carToFormValues,
  getApiErrorMessage,
} from "../../utils/cars";
import {
  CAR_TYPE_OPTIONS,
  EMPTY_CAR_FORM,
  FUEL_OPTIONS,
  GEARBOX_OPTIONS,
  type CarFormValues,
} from "../../types/cars";

interface CarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  carId?: number;
}

const selectClassName =
  "h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";

export default function CarFormModal({
  isOpen,
  onClose,
  onSuccess,
  carId,
}: CarFormModalProps) {
  const { showToast } = useToast();
  const isEditing = carId !== undefined;

  const [form, setForm] = useState<CarFormValues>(EMPTY_CAR_FORM);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCar, setLoadingCar] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (!carId) {
      setForm(EMPTY_CAR_FORM);
      setImages([]);
      return;
    }

    const loadCar = async () => {
      setLoadingCar(true);
      try {
        const { car } = await fetchCarById(carId);
        setForm(carToFormValues(car));
        setImages([]);
      } catch (error) {
        showToast("error", getApiErrorMessage(error, "Failed to load car."));
        onClose();
      } finally {
        setLoadingCar(false);
      }
    };

    loadCar();
  }, [isOpen, carId, onClose, showToast]);

  const updateField = <K extends keyof CarFormValues>(
    key: K,
    value: CarFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 4) {
      showToast("error", "You can upload up to 4 images.");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.brand ||
      !form.model ||
      !form.year ||
      !form.price ||
      !form.fuel ||
      !form.gearbox ||
      !form.horsepower ||
      !form.torque ||
      !form.plate
    ) {
      showToast("error", "Please fill in all required fields.");
      return;
    }

    if (!isEditing && images.length === 0) {
      showToast("error", "Please upload at least one image.");
      return;
    }

    setLoading(true);

    try {
      const formData = buildCarFormData(
        form,
        isEditing ? (images.length > 0 ? images : undefined) : images,
      );

      if (isEditing && carId) {
        await updateCar(carId, formData);
        showToast("success", "Car updated successfully.");
      } else {
        await createCar(formData);
        showToast("success", "Car added successfully.");
      }

      onSuccess();
      onClose();
    } catch (error) {
      showToast(
        "error",
        getApiErrorMessage(
          error,
          isEditing ? "Failed to update car." : "Failed to add car.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-3xl p-6 lg:p-8 max-h-[90vh] overflow-y-auto"
    >
      <div className="pr-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {isEditing ? "Edit car" : "Add car"}
        </h3>

        {loadingCar ? (
          <div className="mt-8 flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={form.model}
                  onChange={(e) => updateField("model", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={form.year}
                  onChange={(e) => updateField("year", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step={0.01}
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fuel">Fuel *</Label>
                <select
                  id="fuel"
                  className={selectClassName}
                  value={form.fuel}
                  onChange={(e) => updateField("fuel", e.target.value)}
                >
                  <option value="" disabled>
                    Select fuel type
                  </option>
                  {FUEL_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="gearbox">Gearbox *</Label>
                <select
                  id="gearbox"
                  className={selectClassName}
                  value={form.gearbox}
                  onChange={(e) => updateField("gearbox", e.target.value)}
                >
                  <option value="" disabled>
                    Select gearbox
                  </option>
                  {GEARBOX_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="engine">Engine</Label>
                <Input
                  id="engine"
                  value={form.engine}
                  onChange={(e) => updateField("engine", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="horsepower">Horsepower *</Label>
                <Input
                  id="horsepower"
                  type="number"
                  value={form.horsepower}
                  onChange={(e) => updateField("horsepower", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="torque">Torque *</Label>
                <Input
                  id="torque"
                  type="number"
                  value={form.torque}
                  onChange={(e) => updateField("torque", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="car_type">Car type</Label>
                <select
                  id="car_type"
                  className={selectClassName}
                  value={form.car_type}
                  onChange={(e) => updateField("car_type", e.target.value)}
                >
                  <option value="">Select car type</option>
                  {CAR_TYPE_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="plate">Plate *</Label>
                <Input
                  id="plate"
                  value={form.plate}
                  onChange={(e) => updateField("plate", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Checkbox
                id="available"
                label="Available"
                checked={form.available}
                onChange={(checked) => updateField("available", checked)}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <TextArea
                value={form.notes}
                onChange={(value) => updateField("notes", value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="images">
                Images {isEditing ? "(optional, max 4)" : "(max 4) *"}
              </Label>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 hover:file:bg-gray-100 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400"
              />
              {images.length > 0 && (
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  {images.length} file(s) selected
                </p>
              )}
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
                {loading
                  ? isEditing
                    ? "Saving..."
                    : "Adding..."
                  : isEditing
                    ? "Save changes"
                    : "Add car"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
