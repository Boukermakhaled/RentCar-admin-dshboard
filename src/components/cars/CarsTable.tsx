import Badge from "../ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { CarListItem } from "../../types/cars";
import { formatPrice, getCarImageUrl } from "../../utils/cars";

interface CarsTableProps {
  cars: CarListItem[];
  onDetails: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const actionButtonClass =
  "text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300";

export default function CarsTable({
  cars,
  onDetails,
  onEdit,
  onDelete,
}: CarsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {["Image", "Plate", "Brand", "Model", "Price", "Available", "Actions"].map(
                (header) => (
                  <TableCell
                    key={header}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {header}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {cars.length === 0 ? (
              <TableRow>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No cars found.
                </td>
              </TableRow>
            ) : (
              cars.map((car) => (
                <TableRow key={car.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="h-10 w-10 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                      {car.image ? (
                        <img
                          src={getCarImageUrl(car.image)}
                          alt={`${car.brand} ${car.model}`}
                          className="h-full w-full object-cover"
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          N/A
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90">
                    {car.plate}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {car.brand}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {car.model}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatPrice(car.price)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={car.available ? "success" : "error"}
                    >
                      {car.available ? "Available" : "Rented"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        className={actionButtonClass}
                        onClick={() => onDetails(car.id)}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        className={actionButtonClass}
                        onClick={() => onEdit(car.id)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-sm font-medium text-error-500 hover:text-error-600 dark:text-error-400 dark:hover:text-error-300"
                        onClick={() => onDelete(car.id)}
                      >
                        Delete
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
