import { useEffect, useRef, useState } from "react";
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
  carImagesChanged,
  carToFormValues,
  fetchImagesAsFiles,
  getApiErrorMessage,
  getCarImageList,
  getCarImageUrl,
} from "../../utils/cars";
import {
  CAR_TYPE_OPTIONS,
  EMPTY_CAR_FORM,
  FUEL_OPTIONS,
  GEARBOX_OPTIONS,
  type CarFormValues,
} from "../../types/cars";
import { IoMdSpeedometer } from "react-icons/io";
import { GiGearStick } from "react-icons/gi";
import { PiEngineBold, PiGasPumpBold } from "react-icons/pi";
import { TbManualGearbox } from "react-icons/tb";
import { MdOutlineCalendarToday } from "react-icons/md";
import { RiCarLine } from "react-icons/ri";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdClose } from "react-icons/md";
import { GiHorseHead, GiGearHammer } from "react-icons/gi";

interface CarFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  carId?: number;
}

const selectClassName =
  "h-8 w-full appearance-none rounded-md border-0 bg-transparent px-0 text-sm font-semibold text-gray-800 focus:outline-hidden dark:text-white/90";

interface FormStatFieldProps {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function FormStatField({ icon, label, children }: FormStatFieldProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-gray-50 dark:bg-gray-800 px-3 py-2">
      <span className="text-brand-500 text-base shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

export default function CarFormModal({
  isOpen,
  onClose,
  onSuccess,
  carId,
}: CarFormModalProps) {
  const { showToast } = useToast();
  const isEditing = carId !== undefined;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<CarFormValues>(EMPTY_CAR_FORM);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [initialExistingImages, setInitialExistingImages] = useState<string[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingCar, setLoadingCar] = useState(false);

  const displayImages = [
    ...existingImages.map((path) => getCarImageUrl(path)).filter(Boolean),
    ...imagePreviews,
  ];
  const activeIndex =
    displayImages.length > 0
      ? Math.min(activeImage, displayImages.length - 1)
      : 0;

  const totalImageCount = existingImages.length + images.length;
  const canAddMore = totalImageCount < 4;

  const clearImagePreviews = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImagePreviews([]);
    setImages([]);
  };

  useEffect(() => {
    if (!isOpen) {
      clearImagePreviews();
      setExistingImages([]);
      setInitialExistingImages([]);
      setActiveImage(0);
      return;
    }

    if (!carId) {
      setForm(EMPTY_CAR_FORM);
      clearImagePreviews();
      setExistingImages([]);
      setInitialExistingImages([]);
      setActiveImage(0);
      return;
    }

    const loadCar = async () => {
      setLoadingCar(true);
      clearImagePreviews();
      setExistingImages([]);
      setInitialExistingImages([]);
      setActiveImage(0);

      try {
        const { car } = await fetchCarById(carId);
        const loadedImages = getCarImageList(car);
        setForm(carToFormValues(car));
        setExistingImages(loadedImages);
        setInitialExistingImages(loadedImages);
        setActiveImage(0);
      } catch (error) {
        showToast("error", getApiErrorMessage(error, "Failed to load car."));
        onClose();
      } finally {
        setLoadingCar(false);
      }
    };

    loadCar();
  }, [isOpen, carId, onClose, showToast]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const updateField = <K extends keyof CarFormValues>(
    key: K,
    value: CarFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return;

    const slotsLeft = 4 - existingImages.length - images.length;
    if (slotsLeft <= 0) {
      showToast("error", "You can upload up to 4 images total.");
      e.target.value = "";
      return;
    }

    const filesToAdd = picked.slice(0, slotsLeft);
    if (filesToAdd.length < picked.length) {
      showToast("error", "You can upload up to 4 images total.");
    }

    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...filesToAdd]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    if (displayImages.length === 0) {
      setActiveImage(0);
    }

    e.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    const existingCount = existingImages.length;

    if (index < existingCount) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - existingCount;
      const previewToRemove = imagePreviews[newIndex];
      if (previewToRemove) URL.revokeObjectURL(previewToRemove);
      setImages((prev) => prev.filter((_, i) => i !== newIndex));
      setImagePreviews((prev) => prev.filter((_, i) => i !== newIndex));
    }

    setActiveImage((prev) => {
      const nextLength = displayImages.length - 1;
      if (nextLength <= 0) return 0;
      return Math.min(prev, nextLength - 1);
    });
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

    if (!isEditing && totalImageCount === 0) {
      showToast("error", "Please upload at least one image.");
      return;
    }

    if (isEditing && totalImageCount === 0) {
      showToast("error", "Please keep at least one image.");
      return;
    }

    setLoading(true);

    try {
      let filesToUpload: File[] | undefined;

      if (isEditing) {
        const imagesChanged = carImagesChanged(
          initialExistingImages,
          existingImages,
          images.length,
        );

        if (imagesChanged) {
          const keptFiles = await fetchImagesAsFiles(existingImages);
          filesToUpload = [...keptFiles, ...images].slice(0, 4);
        }
      } else {
        filesToUpload = images;
      }

      const formData = buildCarFormData(form, filesToUpload);

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
      className="max-w-2xl p-0 max-h-[90vh] overflow-hidden"
    >
      {loadingCar ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col overflow-y-auto max-h-[90vh]"
        >
          {/* ── Image gallery / upload ── */}
          <div className="relative w-full shrink-0 aspect-video min-h-[180px] bg-gray-100 dark:bg-gray-900 overflow-hidden">
            {displayImages.length > 0 ? (
              <>
                <img
                  key={displayImages[activeIndex]}
                  src={displayImages[activeIndex]}
                  alt="Car preview"
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                />
                {form.car_type && (
                  <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase text-gray-600 bg-white/90 dark:bg-gray-900/80 px-2 py-1 rounded-md">
                    {form.car_type}
                  </span>
                )}
                <span
                  className={`absolute top-10 left-3 z-10 text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                    form.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {form.available ? "Available" : "Rented"}
                </span>
                {displayImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 flex gap-2">
                    {displayImages.map((src, i) => (
                      <div key={`${src}-${i}`} className="relative group/thumb">
                        <button
                          type="button"
                          onClick={() => setActiveImage(i)}
                          className={`w-12 h-8 rounded-md overflow-hidden border-2 transition-all ${
                            i === activeIndex
                              ? "border-brand-500 scale-110"
                              : "border-white/50 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={src}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(i)}
                          className="absolute -top-1.5 -right-1.5 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm transition-opacity group-hover/thumb:opacity-100 hover:bg-red-600"
                          aria-label="Remove image"
                        >
                          <MdClose className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                <RiCarLine className="text-5xl" />
                <p className="text-sm">No images yet</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!canAddMore}
              className="absolute bottom-5 right-3 z-10 flex items-center gap-1.5 rounded-lg bg-white/90 dark:bg-gray-900/90 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 shadow-md backdrop-blur-sm transition-all hover:bg-white dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none"
            >
              <HiOutlinePhotograph className="text-base text-brand-500" />
              {displayImages.length > 0 ? "Add more" : "Add photos"}
            </button>

            {displayImages.length > 0 && (
              <button
                type="button"
                onClick={() => handleRemoveImage(activeIndex)}
                className="absolute bottom-14 right-3 z-10 flex items-center gap-1.5 rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white shadow-md backdrop-blur-sm transition-all hover:bg-red-600"
              >
                <MdClose className="text-sm" />
                Remove
              </button>
            )}

            <input
              ref={fileInputRef}
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
            />
            {!isEditing && (
              <p className="absolute bottom-3 left-3 z-10 text-[10px] font-medium text-white/80 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                {totalImageCount}/4 images · Required
              </p>
            )}
            {isEditing && (
              <p className="absolute bottom-3 left-3 z-10 text-[10px] font-medium text-white/80 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-sm">
                {totalImageCount}/4 images
              </p>
            )}
          </div>

          {/* ── Content ── */}
          <div className="p-6 space-y-5">
            {/* Header: brand / model / price */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  placeholder="e.g. Toyota"
                />
              </div>
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={form.model}
                  onChange={(e) => updateField("model", e.target.value)}
                  placeholder="e.g. Corolla"
                />
              </div>
              <div>
                <Label htmlFor="price">Price / day *</Label>
                <Input
                  id="price"
                  type="number"
                  step={0.01}
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="plate">Plate *</Label>
              <Input
                id="plate"
                value={form.plate}
                onChange={(e) => updateField("plate", e.target.value)}
                placeholder="Plate number"
              />
            </div>

            {/* Stat-style fields */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <FormStatField
                icon={<MdOutlineCalendarToday />}
                label="Year *"
              >
                <Input
                  id="year"
                  type="number"
                  value={form.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  className="!h-8 !rounded-md !px-2 !py-0 !shadow-none"
                />
              </FormStatField>
              <FormStatField icon={<PiGasPumpBold />} label="Fuel *">
                <select
                  id="fuel"
                  className={selectClassName}
                  value={form.fuel}
                  onChange={(e) => updateField("fuel", e.target.value)}
                >
                  <option value="" disabled>Select fuel</option>
                  {FUEL_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </FormStatField>
              <FormStatField icon={<GiGearStick />} label="Gearbox *">
                <select
                  id="gearbox"
                  className={selectClassName}
                  value={form.gearbox}
                  onChange={(e) => updateField("gearbox", e.target.value)}
                >
                  <option value="" disabled>Select gearbox</option>
                  {GEARBOX_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </FormStatField>
              <FormStatField icon={<GiHorseHead />} label="Horsepower *">
                <Input
                  id="horsepower"
                  type="number"
                  value={form.horsepower}
                  onChange={(e) => updateField("horsepower", e.target.value)}
                  className="!h-8 !rounded-md !px-2 !py-0 !shadow-none"
                />
              </FormStatField>
              <FormStatField icon={<GiGearHammer />} label="Torque *">
                <Input
                  id="torque"
                  type="number"
                  value={form.torque}
                  onChange={(e) => updateField("torque", e.target.value)}
                  className="!h-8 !rounded-md !px-2 !py-0 !shadow-none"
                />
              </FormStatField>
              <FormStatField icon={<PiEngineBold />} label="Engine">
                <Input
                  id="engine"
                  value={form.engine}
                  onChange={(e) => updateField("engine", e.target.value)}
                  className="!h-8 !rounded-md !px-2 !py-0 !shadow-none"
                  placeholder="—"
                />
              </FormStatField>
            </div>

            <div>
              <Label htmlFor="car_type">Car type</Label>
              <select
                id="car_type"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                value={form.car_type}
                onChange={(e) => updateField("car_type", e.target.value)}
              >
                <option value="">Select car type</option>
                {CAR_TYPE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <Checkbox
              id="available"
              label="Available"
              checked={form.available}
              onChange={(checked) => updateField("available", checked)}
            />

            <div className="rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3">
              <Label
                htmlFor="notes"
                className="!text-[10px] !font-semibold !uppercase !tracking-wide !text-gray-400 !mb-1"
              >
                Notes
              </Label>
              <TextArea
                value={form.notes}
                onChange={(value) => updateField("notes", value)}
                rows={3}
                className="!bg-transparent !border-0 !shadow-none !px-0"
              />
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-1">
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
          </div>
        </form>
      )}
    </Modal>
  );
}
