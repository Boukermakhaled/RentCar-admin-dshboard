import Label from "../form/Label";
import Input from "../form/input/InputField";

export type AvailableFilter = "all" | "available" | "rented";

interface CarsFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  availableFilter: AvailableFilter;
  onAvailableFilterChange: (value: AvailableFilter) => void;
  brandFilter: string;
  onBrandFilterChange: (value: string) => void;
  brands: string[];
}

const selectClassName =
  "h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs text-gray-800 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";

export default function CarsFilters({
  search,
  onSearchChange,
  availableFilter,
  onAvailableFilterChange,
  brandFilter,
  onBrandFilterChange,
  brands,
}: CarsFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div>
        <Label htmlFor="car-search">Search</Label>
        <Input
          id="car-search"
          type="text"
          placeholder="Search by brand or model..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="available-filter">Availability</Label>
        <select
          id="available-filter"
          className={selectClassName}
          value={availableFilter}
          onChange={(e) =>
            onAvailableFilterChange(e.target.value as AvailableFilter)
          }
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="rented">Rented</option>
        </select>
      </div>
      <div>
        <Label htmlFor="brand-filter">Brand</Label>
        <select
          id="brand-filter"
          className={selectClassName}
          value={brandFilter}
          onChange={(e) => onBrandFilterChange(e.target.value)}
        >
          <option value="">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
