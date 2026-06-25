import { useCallback, useEffect, useMemo, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import CarsFilters, {
  type AvailableFilter,
} from "../../components/cars/CarsFilters";
import CarsTable from "../../components/cars/CarsTable";
import CarsTableSkeleton from "../../components/cars/CarsTableSkeleton";
import CarFormModal from "../../components/cars/CarFormModal";
import CarDetailsModal from "../../components/cars/CarDetailsModal";
import DeleteCarDialog from "../../components/cars/DeleteCarDialog";
import Pagination from "../../components/cars/Pagination";
import { useToast } from "../../context/ToastContext";
import { useDebounce } from "../../hooks/useDebounce";
import { deleteCar, fetchCars } from "../../services/cars";
import type { CarListItem } from "../../types/cars";
import { getApiErrorMessage } from "../../utils/cars";

const PAGE_SIZE = 12;

export default function Cars() {
  const { showToast } = useToast();

  const [cars, setCars] = useState<CarListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [availableFilter, setAvailableFilter] = useState<AvailableFilter>("all");
  const [brandFilter, setBrandFilter] = useState("");
  const [knownBrands, setKnownBrands] = useState<string[]>([]);

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<number | undefined>();
  const [detailsCarId, setDetailsCarId] = useState<number | null>(null);
  const [deleteCarId, setDeleteCarId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const loadCars = useCallback(async () => {
    setLoading(true);

    try {
      const params: {
        lim: number;
        page: number;
        search?: string;
        brand?: string;
        available?: boolean;
      } = {
        lim: PAGE_SIZE,
        page,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (brandFilter) {
        params.brand = brandFilter;
      }

      if (availableFilter === "available") {
        params.available = true;
      } else if (availableFilter === "rented") {
        params.available = false;
      }

      const response = await fetchCars(params);
      setCars(response.cars);
      setTotalPages(response.totalPages);

      const brandsFromResponse = response.cars.map((car) => car.brand);
      setKnownBrands((prev) =>
        [...new Set([...prev, ...brandsFromResponse])].sort(),
      );
    } catch (error) {
      setCars([]);
      showToast("error", getApiErrorMessage(error, "Failed to load cars."));
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, brandFilter, availableFilter, showToast]);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, brandFilter, availableFilter]);

  const brands = useMemo(
    () => [...new Set(knownBrands)].sort(),
    [knownBrands],
  );

  const handleAddCar = () => {
    setEditingCarId(undefined);
    setFormModalOpen(true);
  };

  const handleEditCar = (id: number) => {
    setEditingCarId(id);
    setFormModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCarId) return;

    setDeleting(true);
    try {
      await deleteCar(deleteCarId);
      showToast("success", "Car deleted successfully.");
      setDeleteCarId(null);
      loadCars();
    } catch (error) {
      showToast("error", getApiErrorMessage(error, "Failed to delete car."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageMeta title="Cars | Car Rental Admin" description="Manage cars" />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white/90">
              Cars Management
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your fleet inventory
            </p>
          </div>
          <Button onClick={handleAddCar}>Add Car</Button>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <CarsFilters
            search={search}
            onSearchChange={setSearch}
            availableFilter={availableFilter}
            onAvailableFilterChange={setAvailableFilter}
            brandFilter={brandFilter}
            onBrandFilterChange={setBrandFilter}
            brands={brands}
          />
        </div>

        {loading ? (
          <CarsTableSkeleton />
        ) : (
          <CarsTable
            cars={cars}
            onDetails={setDetailsCarId}
            onEdit={handleEditCar}
            onDelete={setDeleteCarId}
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

      <CarFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSuccess={loadCars}
        carId={editingCarId}
      />

      <CarDetailsModal
        isOpen={detailsCarId !== null}
        onClose={() => setDetailsCarId(null)}
        carId={detailsCarId}
      />

      <DeleteCarDialog
        isOpen={deleteCarId !== null}
        onClose={() => setDeleteCarId(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
      />
    </>
  );
}
